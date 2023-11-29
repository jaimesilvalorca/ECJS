import passport from "passport";

import dotenv from 'dotenv'

dotenv.config()

export const showRegisterPage = (req, res) => {
    res.render('sessions/register');
}

export const showLoginPage = (req, res) => {
    res.render('sessions/login')
}

export const registerUser = passport.authenticate('register', 
{ failureRedirect: '/session/failureRegister' })

export const redirectToLogin = (req, res) => {
    res.redirect('/session/login')
}

export const failureRegister = (req, res) => {
    res.send({ error: 'failed' })
}

export const loginUser = passport.authenticate('login', { failureRedirect: '/session/failLogin' })

export const loginUserSucces = (req,res) =>{
    if (!req.user) {
        return res.status(400).send({status: 'error', error:'Invalid credentials'})
    }
    res.cookie(process.env.JWT_COOKIE_NAME,req.user.token).redirect('/products')
}

export const failureLogin = (req,res)=>{
    res.send({error:'Fail in login'})
}

export const logoutUser = (req,res) =>{
    res.clearCookie(process.env.JWT_COOKIE_NAME).redirect('/session/login')

}

export const githubLogin = passport.authenticate('github',{scope:['user:email']})

export const githubCallback = passport.authenticate('github',{failureRedirect:'/sessions/login'})

export const githubCallbackJWT = async(req,res)=>{
    if(!req.user){
        return res.status(400).send({status: 'error',error:'Invalid credentials'})
    }
    const token = req.user.token;
    res.cookie(process.env.JWT_COOKIE_NAME, token).redirect('/products');
}

export const getCurrentSession = (req,res) =>{
    if (req.user) {
        return res.json({ user: req.user });
      } else {
        return res.status(401).json({ error: 'Token Invalido' });
      }
    };