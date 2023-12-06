import dotenv from "dotenv";
import nodemailer from "nodemailer";
import mailgen from 'mailgen'

dotenv.config();

class TicketService {
  async generateTicket(ticketDetails, userEmail) {
    const MailGenerator = new mailgen({
      theme: 'default',
      product: {
        name: 'Limonatura',
        link: 'http://www.limonatura.cl'
      }
    });

    const response = {
      body: {
        intro: 'El detalle de tu compra ha llegado!!',
        table: {
          data: [
            {
              item: 'Código',
              description: ticketDetails.code,
              price: '',
            },
            {
              item: 'Fecha de compra',
              description: ticketDetails.purchase_datetime.toISOString(),
              price: '',
            },
            {
              item: 'Monto',
              description: `$ ${ticketDetails.amount}`,
              price: '',
            },
            {
              item: 'Comprador',
              description: ticketDetails.purchaser,
              price: '',
            },
          ],
        },
        outro: 'Esperamos seguir haciendo negocios contigo...'
      }
    };

    const mail = MailGenerator.generate(response);
    const config = {
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    };
    
    try {
      const transporter = nodemailer.createTransport(config);
      const message = {
        from: process.env.GMAIL_USER,
        to: userEmail,
        subject: "¡Compra realizada en Limonatura!",
        html: mail,
      };

      await transporter.sendMail(message);
      console.log("Correo electrónico enviado");
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
    }

    return response;
  }
}

const ticketService = new TicketService();
export default ticketService;
