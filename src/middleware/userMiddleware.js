const authorize = (roles) => {
    return (req, res, next) => {
      const currentUser = req.user.user;
      if (!currentUser) {
        return res.status(401).json({ message: "No estás autenticado" });
      }
      if (!roles.includes(currentUser.role)) {
        return res.status(403).json({ message: "No tienes permisos para acceder a este recurso" });
      }
      next();
    };
  };

  
  
  export default authorize;