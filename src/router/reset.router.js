import express from 'express';
import resetPasswordController from '../controller/password.router.js';

const router = express.Router();

router.get('/', resetPasswordController.showResetPasswordPage);
router.post('/', resetPasswordController.sendResetPasswordEmail);
router.get('/:token', resetPasswordController.showResetPasswordForm);
router.post('/:token', resetPasswordController.updatePassword);

export default router;
