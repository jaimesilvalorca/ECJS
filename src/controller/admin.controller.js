import UserModel from '../models/user.model.js';

export const renderAdminPage = async (req, res) => {
    try {
        const user = req.user.user;
        const users = await UserModel.find({}, 'first_name email role').lean().exec();
        res.render('admin', { users,user,layout:false });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const updateRole = async (req, res) => {
    try {
        const userId = req.params.userId;
        const newRole = req.body.newRole;


        if (!['user', 'admin','premium'].includes(newRole)) {
            return res.status(400).json({ error: 'Role no válido' });
        }

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { role: newRole },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.redirect('/admin'); 
    } catch (error) {
        console.error('Error al actualizar el rol del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const deletedUser = await UserModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.redirect('/admin');
    } catch (error) {
        console.error('Error al eliminar al usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
