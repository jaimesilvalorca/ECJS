import { Router } from 'express'
import { showAddProduct,addProduct, deleteProduct, getProductById, getProducts, updatedProduct, viewProducts, } from '../controller/products.controller.js'
import authorize from "../middleware/userMiddleware.js"

const router = Router()
const adminOnly = authorize(['admin'])

router.get('/',getProducts) //ok
router.get('/view',viewProducts) //ok
router.get('/addproduct',showAddProduct)
router.get('/:id',getProductById) //ok
router.get('/update')
router.delete('/:pid',deleteProduct) //ok
router.post('/',addProduct)
router.put('/',updatedProduct)


export default router

