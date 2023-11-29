import dotenv from 'dotenv'

dotenv.config()

export default{
    port:process.env.PORT,
    url:process.env.URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    jwtCookieName: process.env.JWT_COOKIE_NAME

}