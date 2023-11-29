import passport from "passport";
import local from "passport-local"
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword,generateToken,extractCookie } from "../utils.js";
import GitHubStrategy from 'passport-github2'
import dotenv from 'dotenv'
import passport_jwt, { ExtractJwt } from 'passport-jwt'
import config from "./config.js";
import cartModel from "../models/carts.models.js";




const LocalStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy
const clientId = config.clientId
const clientSecret = config.clientSecret
const jwtPrivateKey = config.jwtPrivateKey

const initializePassport = () => {

    passport.use('github',new GitHubStrategy({
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: 'http://localhost:8080/session/githubcallback'
    },async(accessToken,refreshToken,profile,done)=>{
        console.log(profile)
        try {
            const user = await UserModel.findOne({email:profile._json.email})
            if(user)return done(null,user)
            const newUser = await UserModel.create({
                first_name: profile._json.name,
                email:profile._json.email
            })

            const token = generateToken(user)
            user.token = token

            return done(null,user)
            
        } catch (error) {
            return done('Error to login with github'+error)
        }
    }))

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, age, email, role } = req.body;
        const userRole = role || 'user';
    
        try {
            const user = await UserModel.findOne({ email: username });
            if (user) {
                console.log('User already exists!');
                return done(null, false);
            }
    
            const cartForNewUser = await cartModel.create({});
            const newUser = {
                first_name,
                last_name,
                age,
                email,
                role: userRole, 
                password: createHash(password),
                cart: cartForNewUser._id,
            };
    
            const result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done('Error en el passport register: ' + error);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email'

    }, async (username, password, done) => {
        try {
            const user = await UserModel.findOne({ email: username })
            if (!user) {
                console.log('User does not exists')
                return done(null, user)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            console.log("logeado")

            const token = generateToken(user)
            user.token = token

            return done(null, user)

        } catch (error) {
            return done('error')

        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: jwtPrivateKey 
    },async(jwt_payload,done)=>{
        done(null,jwt_payload)
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

    passport.use('forgot-password', new LocalStrategy({
        usernameField: 'email'
    }, async (email, done) => {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('jwt-reset-password', new JWTStrategy({
        jwtFromRequest: passport_jwt.ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: jwtPrivateKey 
    }, async (jwt_payload, done) => {
        try {
            const user = await UserModel.findById(jwt_payload.user._id);
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}


export default initializePassport