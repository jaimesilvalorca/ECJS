import express from "express"
import { Server } from "socket.io"
import productRouter from "./router/products.router.js"
import cartRouter from "./router/carts.router.js"
import productViewRouter from "./router/productsView.router.js"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import chatRouter from "./router/chat.router.js"
import messagesModel from "./models/message.models.js"
import sessionRouter from "./router/session.router.js"
import session from "express-session"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import { passportCall } from "./utils.js"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import config from './config/config.js'
import MongoClient from "./config/MongoClient.js"
import mockingRouter from "./router/mockingProducts.router.js"
import errorMiddlware from "./middleware/errorMiddlware.js"
import loggerRouter from './router/logger.router.js'
import swaggerJSDoc from "swagger-jsdoc"
import SwaggerUiExpress from "swagger-ui-express"
import resetPasswordRoutes from './router/reset.router.js';
import userPremiumRouter from './router/user.router.js'
import adminRouter from './router/admin.router.js'
import cartViewRouter from './router/cartsView.router.js'
import cors from 'cors'
import paymentRouter from './router/payments.router.js'
import ticketRouter from './router/ticket.router.js'
import userRouter from './router/user.router.js'
import misDatosRouter from './router/datos.router.js'



dotenv.config()

let client = new MongoClient()

const swaggerOptions = {
    definition:{
        openapi: '3.0.1',
        info:{
            title: 'Documentacion Ecommerce',
            description:'Descripcion de la documentacion del proyecto de backend ecommerce'
        }
    },
    apis:['./docs/**/*.yaml']
}

const specs = swaggerJSDoc(swaggerOptions)

const port = config.port || 3000


const app = express()

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.engine('handlebars', handlebars.engine())

app.set('views', './src/views')
app.set('view engine', 'handlebars')
app.use(express.static('./src/public'))
app.get('/', (request, response) => {
    response.send('Desafio 03!')
})

app.use(session({
    secret: 'jaimesilva',
    resave: true,
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/session', sessionRouter)

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/products', passportCall('jwt'), productViewRouter)
app.use('/api/chats', chatRouter)
app.use('/carts',passportCall('jwt'),cartViewRouter)
app.use('/mockingproducts', mockingRouter)
app.use('/loggertest',loggerRouter)
app.use('/reset-password', resetPasswordRoutes)
app.use('/docs',SwaggerUiExpress.serve,SwaggerUiExpress.setup(specs))
app.use('/premium',userPremiumRouter)
app.use('/admin',passportCall('jwt'),adminRouter)
app.use('/payment',passportCall('jwt'),paymentRouter)
app.use('/ticket',passportCall('jwt'),ticketRouter)
app.use('/api/users',passportCall('jwt'),userRouter)
app.use('/misdatos',passportCall('jwt'),misDatosRouter)

app.use((req, res, next) => {
    const error = new Error('Ruta no encontrada');
    error.name = 'NotFoundError';
    next(error);
});

app.use(errorMiddlware)

app.use((err, req, res, next) => {
    if (err.name === 'NotFoundError') {
        res.status(404).json({ status: 'error', error: err.message });
    } else {
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

mongoose.set('strictQuery', false)

try {
    client.connect();
    console.log("DB conected");
    const httpServer = app.listen(port, () => {
        console.log("Server UP");
        console.log(`http://localhost:${port}/`)
    });

    const socketServer = new Server(httpServer);

    socketServer.on("connection", socket => {
        console.log("New client connected")
        socket.on("message", async data => {
            await messagesModel.create(data)
            let messages = await messagesModel.find().lean().exec()
            socketServer.emit("logs", messages)
        })
    })

} catch (error) {
    console.log(error);
}

export default app