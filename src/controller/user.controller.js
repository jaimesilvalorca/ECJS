import UserService from "../services/userService.js";

const userService = new UserService()

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "No estás autenticado" });
    }
    const userId = req.user.id;
    const user = await userService.getUserById(userId);

    if (user && user.first_name && user.last_name && user.email) {
      const fullName = `${user.first_name} ${user.last_name}`;
      const email = user.email;
      const role = user.role

      return res.status(200).json({ fullName, email,role });
    } else {
      return res.status(404).json({ message: "Usuario no encontrado o información incompleta" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el usuario actual", error: error.message });
  }
};