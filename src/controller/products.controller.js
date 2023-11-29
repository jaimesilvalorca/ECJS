import productModel from "../models/products.models.js";


export const getProducts = async (req, res) => {
    const products = await productModel.find().lean().exec()
    return res.json(products)
}

export const showAddProduct = (req, res) => {
    return res.render('addproduct')
}


export const viewProducts = async (req, res) => {
    const products = await productModel.find().lean().exec()
    res.render('realTimeProducts', {
        data: products
    })
}

export const getProductById = async (req, res) => {
    const id = req.params.id
    const product = await productModel.findOne({ _id: id })
    res.json({
        product
    })
}

export const deleteProduct = async (req, res) => {
    try {
        const pid = req.params.pid
        const product = await productModel.findById({ _id: pid })
        console.log(product)
        const productDeleted = await productModel.deleteOne({ _id: pid })
        const data = {
            _id: product._id,
            title: product.title,
            description: product.description,
            price: product.price

        }
        res.status(201).json({
            success: true,
            message: `El producto ha sido eliminado correctamente ${product.title}`,
            data: data

        })

    } catch (err) {
        res.status(502).json({
            sucess: false,
            message: 'Error al eliminar el producto',
            error: err
        })
    }
}

export const addProduct = async (req, res, next) => {
    try {
        const product = req.body
        console.log(product)
        if (!product.title) {
            return res.status(400).json({
                message: "Error no se ingresó el nombre"
            })
        }
        const productAdded = await productModel.create(product)
        res.render('addproduct',{
            message:'Producto agregado correctamente'
        }
        )
        

    } catch (error) {
        next(error)
    }
}

export const updatedProduct = async (req, res) => {
    const product = req.body
    const existingProduct = await productModel.findOne({ _id: product._id })

    if (!existingProduct) {
        return res.status(401).json({
            success: false,
            message: 'No se encontró ningun producto'
        })
    }

    existingProduct.title = product.title || existingProduct.title
    existingProduct.description = product.description || existingProduct.description
    existingProduct.price = product.price || existingProduct.price
    existingProduct.status = product.status || existingProduct.status
    existingProduct.stock = product.stock || existingProduct.stock
    existingProduct.category = product.category || existingProduct.category
    existingProduct.thumbnails = product.thumbnails || existingProduct.thumbnails

    await existingProduct.save()

    const updateProduct = {

        title:existingProduct.title,
        description:existingProduct.description,
        price:existingProduct.price,
        status:existingProduct.status,
        stock:existingProduct.stock,
        category:existingProduct.category,
        thumbnails:existingProduct.thumbnails,

    }

    return res.status(201).json({
        success:true,
        message:'Se ha actualziado correctamente el producto',
        data:updateProduct
    })

}

