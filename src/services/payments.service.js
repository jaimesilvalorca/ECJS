import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const STRIPE_SECRET = process.env.STRIPE_SECRET;

class PaymentService {
  constructor() {
    this.stripe = new Stripe(STRIPE_SECRET);
  }

  async createPaymentIntent(amount, currency) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: currency,
      });
      return paymentIntent;
    } catch (error) {
      console.error("Error al crear la intención de pago:", error);
      throw error;
    }
  }

  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId
      );
      return paymentIntent.status === "succeeded";
    } catch (error) {
      console.error("Error al confirmar el pago:", error);
      throw error;
    }
  }
}

export default PaymentService;
