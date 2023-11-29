import nodemailer from 'nodemailer';
import mailgen from 'mailgen';

const emailService = {
  sendPasswordResetEmail: async (toEmail, resetLink) => {
    const MailGenerator = new mailgen({
      theme: 'default',
      product: {
        name: 'JS ESHOP',
        link: 'http://www.limonatura.cl'
      }
    });

    const emailContent = {
      body: {
        intro: '¡Hola!',
        action: {
          instructions: 'Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.',
          button: {
            text: 'Restablecer contraseña',
            link: resetLink
          }
        },
        outro: 'Si no solicitaste esto, no es necesario realizar ninguna acción.',
        signature: 'Atentamente,\nJS ESHOP'
      }
    };

    const emailText = MailGenerator.generatePlaintext(emailContent);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const message = {
      from: process.env.GMAIL_USER,
      to: toEmail,
      subject: 'Restablecimiento de contraseña - JS ESHOP',
      html: MailGenerator.generate(emailContent),
      text: emailText
    };

    try {
      await transporter.sendMail(message);
      console.log('Correo electrónico de restablecimiento de contraseña enviado');
    } catch (error) {
      console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error);
    }
  }
};

export default emailService;
