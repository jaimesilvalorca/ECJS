import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import passport from 'passport'
import Strategy from 'passport-github2'
import config from "./config/config.js";
import {fakerES as faker} from "@faker-js/faker"

const jwtCookieName = config.jwtCookieName
const jwtPrivateKey = config.jwtPrivateKey


export const createHash = password =>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}

export const isValidPassword = (user,password)=>{
    return bcrypt.compareSync(password,user.password)
}

export const generateToken = user =>{
    const token = jwt.sign({user}, jwtPrivateKey,{expiresIn:'24h'})
    return token
}

export const extractCookie = req =>{
    return (req && req.cookies) ? req.cookies[jwtCookieName] : null
}

export const passportCall = strategy =>{
    return async(req,res,next)=>{
        passport.authenticate(strategy, function(err,user,info){
            if(err) return next(err)
            if (!user) return res.status(401).render('errors/base',{error: info.messages ? info.message : info.toString()})
            req.user = user
            next()

        })(req,res,next)
    }
}

export const generateProduct = () =>{
    return{
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int(),
        category: faker.commerce.department(),
        thumbnails: faker.image.urlPicsumPhotos()        
    }
}

