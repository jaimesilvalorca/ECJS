import cartModel from "../models/carts.models.js";
import productModel from "../models/products.models.js";


export const getCart = async(req,res)=>{
    const carts = await cartModel.find().lean().exec()
    res.json({carts})
}

export const viewCartProducts = async (req, res) => {
  try {
    const user = req.user.user;
    const cartID = user.cart;
    const cart = await cartModel.findById(cartID);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productsInCart = cart.products;

    const productQuantities = {};

    for (const cartProduct of productsInCart) {
      if (productQuantities[cartProduct.id]) {
        productQuantities[cartProduct.id] += cartProduct.quantity;
      } else {
        productQuantities[cartProduct.id] = cartProduct.quantity;
      }
    }

    const productsWithDetails = [];

    let totalCartPrice = 0;
    for (const productId in productQuantities) {
      const product = await productModel.findById(productId);

      if (product) {
        const totalPrice = product.price * productQuantities[productId];

        productsWithDetails.push({
          title: product.title,
          price: product.price,
          quantity: productQuantities[productId],
          total: totalPrice,
        });

        totalCartPrice += totalPrice;
      }
    }

    return res.render("cart", { products: productsWithDetails, totalCartPrice, user });
  } catch (error) {
    console.error("Error al cargar los productos del carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getCartById = async(req,res)=>{
    const id = req.params.id
    const cart = await cartModel.findOne({_id:id})
    res.json({cart})
}

export const addCart = async(req,res)=>{
  try {
    const newCart = await cartModel.create({})
    res.json({status:'Success',newCart})
    
  } catch (error) {
    next(error)
    
  }
}

export const addProductToCart = async (req, res, next) => {
  try {
    const cartID = req.params.cid; 
    const productID = req.params.pid; 
    const quantity = req.body.quantity || 1; 
    const cart = await cartModel.findById(cartID);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    const existingProduct = cart.products.find(
      (product) => product.id === productID
    );
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ id: productID, quantity });
    }
    await cart.save();
    res.json({ status: "Producto agregado al carrito con éxito", cart });
  } catch (error) {
    next(error);
  }
};

export const cartDelete = async(req,res)=>{
  try {
    const cartID = req.params.cid
    const productID = req.params.pid
    const cart = await cartModel.findById(cartID)
    if(!cart) return res.status(404).json({status: "error",error:"cart not found"})
    const productIDX = cart.products.findIndex(p=p.id == productID)
    if(productIDX <=0) return res.status(404).json({status:"error",error:'Product Not Found on Cart'})
    cart.products = cart.products.splice(productIDX,1)
    await cart.save()
    res.json({status:'Success',cart})
    
  } catch (error) {
    next(error)
    
  }
}

export const purchaseCart = async (req, res) => {
  try {
    const cartID = req.params.cid;
    const cart = await cartModel.findById(cartID);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }
    const productsNotProcessed = [];
    const cartProducts = cart.products;
    for (const cartProduct of cartProducts) {
      const product = await productModel.findById(cartProduct.id);
      if (!product) {
        return res.status(404).json({ status: "error", error: "Producto no encontrado" });
      }

      if (product.stock < cartProduct.quantity) {
        productsNotProcessed.push(cartProduct.id);
      } else {
        product.stock -= cartProduct.quantity;
        await product.save();
      }
    }

    if (productsNotProcessed.length === 0) {
      const ticket = ticketService.generateTicket(cartProducts, req.body.email);
      return res.status(200).json({ status: "success", message: "Compra realizada con éxito", ticket });
    }
    const productsProcessed = cartProducts.filter((cartProduct) => !productsNotProcessed.includes(cartProduct.id));
    cart.products = productsProcessed;
    await cart.save();
    return res.status(200).json({ status: "warning", message: "Algunos productos no pudieron procesarse", productsNotProcessed });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error al procesar la compra", error: error.message });
  }
};
