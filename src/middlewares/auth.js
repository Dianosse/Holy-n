const { users } = require('../models')


/**
 * Vérifie s'il y a un utilisateur actuellement connecté et s'il n'est pas banni.
 */
async function protect(req, res, next) {
    try {
        if (!req.session?.user) {
            return res.status(401).json({
                success: false,
                error: 'Non authentifié'
            });
        }

        const user = await users.findByPk(req.session.user.id);

        if (!user) {
            req.session.destroy(() => {});
            return res.status(401).json({
                success: false,
                error: 'Session invalide'
            });
        }

        if (user.ban) {
            req.session.destroy(() => {});
            return res.status(403).json({
                success: false,
                error: 'Compte banni'
            });
        }

        req.user = {
            id: user.id,
            mail: user.mail,
            pseudo: user.pseudo,
            admin: user.admin
        };

        return next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
}

module.exports = protect;