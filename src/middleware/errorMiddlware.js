import { customError } from "../services/errors/customError.js";
import Eerros from "../services/errors/enums.js";

export default (error, req, res, next) => {
    if (error.name === 'Custom Error') {
        switch (error.message) {
            case Eerros.PRODUCT_NOT_FOUND:
                res.status(404).json({ status: 'error', error: error.message })
                break;
            case Eerros.INVALID_PRODUCT_DATA:
                res.status(404).json({ status: 'error', error: error.message })
                break;
            case Eerros.ADD_TO_CART_ERROR:
                res.status(404).json({ status: 'error', error: error.message })
                break;
            default:
                res.status(500).json({status:'error', error:'Error desconocido'})
        }
    }else{
        res.status(500).json({status:'error', error:'Error desconocido'})

    }
}