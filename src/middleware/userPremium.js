const userPremium = (req, res, next) => {
    if (req.user.role === 'premium') {
        return next();
    } else {
        return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
    }
};

export default userPremium
