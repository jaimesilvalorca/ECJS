import { Router } from "express";
import { addProductMocking} from "../controller/mockingProducts.controller.js";

const router = Router()

router.get('/',addProductMocking)

export default router