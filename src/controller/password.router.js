import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import emailService from '../services/emailService.js';
import config from '../config/config.js';
import { createHash, isValidPassword } from '../utils.js';

const jwtPrivateKey = config.jwtPrivateKey;

const resetPasswordController = {
  showResetPasswordPage: (req, res) => {
    res.render('reset-password');
  },

  sendResetPasswordEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.render('reset-password', { error: 'Usuario no encontrado' });
      }

      const token = jwt.sign({ user }, jwtPrivateKey, { expiresIn: '1h' });

      const resetLink = `http://localhost:8080/reset-password/${token}`;

      await emailService.sendPasswordResetEmail(user.email, resetLink); // 
      res.render('reset-password-sent');
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      res.render('reset-password', { error: 'Error al enviar el correo de restablecimiento' });
    }
  },

  showResetPasswordForm: async (req, res) => {
    try {
      const token = req.params.token;
      const decodedToken = jwt.verify(token, jwtPrivateKey);
      if (!decodedToken || !decodedToken.user) {
        return res.render('reset-password', { error: 'Token inválido' });
      }

      res.render('reset-password-form', { token });
    } catch (error) {
      console.error('Error al verificar el token:', error);
      res.render('reset-password', { error: 'Error al verificar el token' });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      const decodedToken = jwt.verify(token, jwtPrivateKey);
      if (!decodedToken || !decodedToken.user) {
        return res.render('reset-password-form', { error: 'Token inválido' });
      }

      const user = await UserModel.findById(decodedToken.user._id);
      if (!user) {
        return res.render('reset-password-form', { error: 'Usuario no encontrado' });
      }

      if (isValidPassword(user, newPassword)) {
        return res.render('reset-password-form', { error: 'No puedes usar la misma contraseña actual' });
      }

      user.password = createHash(newPassword);
      await user.save();

      res.render('reset-password-form', { success: 'Contraseña restablecida exitosamente' });
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      res.render('reset-password-form', { error: 'Error al restablecer la contraseña' });
    }
  }
};

export default resetPasswordController;

