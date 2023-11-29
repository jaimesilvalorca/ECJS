import { Router } from "express";
import UserModel from "../models/user.model.js";
import productModel from "../models/products.models.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport"
import dotenv from 'dotenv'
import { failureRegister, getCurrentSession, githubCallback, githubCallbackJWT, githubLogin, loginUser, loginUserSucces, logoutUser, redirectToLogin, registerUser, showLoginPage, showRegisterPage } from "../controller/session.controller.js";
import { getCurrentUser } from "../controller/user.controller.js";

dotenv.config()


const router = Router()

router.get('/register', showRegisterPage)
router.get('/login', showLoginPage)
router.get('/github/login', githubLogin)
router.get('/githubcallback', githubCallback, githubCallbackJWT)
router.post('/register', registerUser,redirectToLogin, failureRegister)
router.post('/login', loginUser, loginUserSucces)
router.get('/logout', logoutUser);
router.get('/current',getCurrentUser)


export default router

// router.get('/register', (req, res) => {
//     res.render('sessions/register')
// })

// router.get('/github/login',passport.authenticate('github',{scope:['user:email']}),(req,res)=>{})

// router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/session/login'}),
// async(req,res)=>{
//     if (!req.user) {
//         return res.status(400).send({ status: 'error', error: 'Invalid credentials'})
//     }
//     res.cookie(process.env.JWT_COOKIE_NAME,req.user.token).redirect('/api/products/view')
// }
// )

// router.post('/register',
//     passport.authenticate('register', { failureRedirect: '/session/failureRegister' }),
//     async (req, res) => {
//         res.redirect('/session/login')
//     })

// router.get('/failureRegister', (req, res) => {
//     res.send({ error: 'failed' })
// })

// router.get('/login', (req, res) => {
//     res.render('sessions/login')
// })

// router.post('/login', 
//     passport.authenticate('login', {failureRedirect: '/session/failLogin'}),
//     async (req, res) => {

//     if (!req.user) {
//         return res.status(400).send({ status: 'error', error: 'Invalid credentials'})
//     }
//     res.cookie(process.env.JWT_COOKIE_NAME,req.user.token).redirect('/products')
// })

// router.get('/failLogin', (req, res) => {
//     res.send({ error: 'Fail in login' })
// })

// router.get('/logout', (req, res) => {
//     res.clearCookie(process.env.JWT_COOKIE_NAME).redirect('/session/login')
// })

// router.get('/current',(req,res)=>{
//     res.send('')
// })


