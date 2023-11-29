import UserModel from '../models/user.model.js';

export const getPremiumUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (user.role !== 'premium') {
            return res.status(403).json({ message: 'No tienes permiso para acceder a este recurso' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Error al obtener el perfil del usuario premium:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const cambioRoleUsuario = async (req, res, next) => {
    try {
        const userEmail = req.params.email;
        const user = await UserModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        user.role = user.role === 'user' ? 'premium' : 'user';

        await user.save();
        res.json({ status: 'success', message: 'Rol de usuario actualizado', user });
    } catch (error) {
        next(error);
    }
};

export const uploadDocuments = async (req, res) => {
    const { uid } = req.params;
    const user = await UserModel.findById(uid);

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    user.hasUploadedDocuments = true;
    await user.save();

    return res.status(200).json({ message: 'Documentos subidos exitosamente' });
};

export const updateUserToPremium = async (req, res) => {
    const { uid } = req.params;
    const user = await UserModel.findById(uid);

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    if (!user.hasUploadedDocuments) {
        return res.status(400).json({ message: 'El usuario debe cargar los documentos requeridos antes de actualizar a premium' });
    }
    user.role = 'premium';
    await user.save();

    return res.status(200).json({ message: 'Usuario actualizado a premium' });
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user.user


    const user = await UserModel.findById(userId._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    console.log(user)

    res.render('userProfile', { user });

  } catch (error) {
    console.error('Error al obtener los datos del usuario actual:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, 'first_name last_name email role');

        res.json({ users });
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const deleteInactiveUsers = async (req, res) => {
    try {
        const twoDaysAgo = moment().subtract(2, 'days').toDate();

        const inactiveUsers = await UserModel.find({ last_connection: { $lt: twoDaysAgo } });

        const emailPromises = inactiveUsers.map(async (user) => {
            await sendEmail(user.email, 'Cuenta eliminada por inactividad', 'Tu cuenta ha sido eliminada debido a la inactividad durante los últimos 2 días.');
            await UserModel.findByIdAndDelete(user._id);
        });
 
        await Promise.all(emailPromises);

        res.json({ message: `Se eliminaron ${inactiveUsers.length} usuarios inactivos.` });
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};