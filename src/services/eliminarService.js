import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

export async function sendEmail(to, subject, text) {
    try {
        const emailOptions = {
            from: 'tucorreo@gmail.com',
            to,
            subject,
            text
        };

        await transporter.sendMail(emailOptions);
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw error;
    }
}