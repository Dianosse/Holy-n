const { users } = require('../models');

async function isAdmin(req, res, next) {
    try {
        const userConnecte = await users.findByPk(req.user.id);

        if (!userConnecte) {
            return res.status(404).json({
                success: false,
                error: "User introuvable"
            });
        }

        if (!userConnecte.admin) {
            return res.status(403).json({
                success: false,
                error: "Accès interdit : admin requis"
            });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = isAdmin;