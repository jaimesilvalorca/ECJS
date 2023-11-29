import Stripe from 'stripe';
import productModel from '../models/products.models.js';
import cartModel from '../models/carts.models.js';
import TicketModel from '../models/ticket.models.js';

const stripeSecretKey = process.env.STRIPE_SECRET;
const stripe = new Stripe(stripeSecretKey);


export const createSession = async (req, res) => {
  try {
    const user = req.user.user;
    const cartID = user.cart;
    const cart = await cartModel.findById(cartID);

    if (!user || !cart) {
      return res.status(404).json({ error: "Usuario o carrito no encontrado" });
    }

    const productsInCart = cart.products;
    const lineItems = [];

    let totalCartPrice = 0;

    const purchasedQuantities = {};

    for (const cartProduct of productsInCart) {
      const product = await productModel.findById(cartProduct.id);

      if (product) {
        const lineItem = {
          price_data: {
            product_data: {
              name: product.title,
            },
            currency: 'clp',
            unit_amount: product.price,
          },
          quantity: cartProduct.quantity,
        };

        lineItems.push(lineItem);

        totalCartPrice += product.price * cartProduct.quantity;


        if (!purchasedQuantities[cartProduct.id]) {
          purchasedQuantities[cartProduct.id] = cartProduct.quantity;
        } else {
          purchasedQuantities[cartProduct.id] += cartProduct.quantity;
        }
      }
    }


    for (const productId in purchasedQuantities) {
      const product = await productModel.findById(productId);

      if (product) {
        const purchasedQuantity = purchasedQuantities[productId];

        if (product.stock >= purchasedQuantity) {
          product.stock -= purchasedQuantity;

          await product.save();
        } else {
          return res.status(400).json({ error: "Stock insuficiente para el producto: " + product.title });
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:8080/payment/success',
      cancel_url: 'http://localhost:8080/payment/cancel',
    });

    const ticketData = {
      code: session.id, 
      amount: totalCartPrice,
      purchaser: user.email
    };

    const ticket = new TicketModel(ticketData);
    await ticket.save();

    cart.products = [];
    await cart.save();

    return res.redirect(session.url);
  } catch (error) {
    console.error("Error al crear la sesión de pago:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const renderPaymentSuccessPage = (req, res) => {
  const user = req.user.user;
  console.log(user)
  res.render('payment-success',{layout: false});
};

export const renderPaymentErrorPage = (req, res) => {
  const user = req.user.user;
  console.log(user)
  res.render('payment-error',{layout: false});
};
