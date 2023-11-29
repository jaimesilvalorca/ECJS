import {Router} from 'express'
import {createSession, renderPaymentErrorPage, renderPaymentSuccessPage} from '../controller/payment.controller.js'

const router = Router()

router.get('/create-checkout-session',createSession)
router.get('/success',renderPaymentSuccessPage)
router.get('/cancel',renderPaymentErrorPage)

export default router