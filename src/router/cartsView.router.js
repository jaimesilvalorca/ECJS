import { Router } from 'express'
import {viewCartProducts } from '../controller/carts.controller.js'



const router = Router()

router.get('/products', viewCartProducts);

export default router
