const { users } = require('../models');


/**
 * Permet aux admins d'obtenir une liste de tous les utilisateurs.
 */
async function getAllUsers(req, res) {
    try {
        const allUsers = await users.findAll({
            attributes: ["id", "admin", "nom", "prenom", "pseudo", "description", "ban", "mail", "solde"]
        });

        return res.status(200).json({
            allUsers
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


/**
 * Permet à un admin de bannir un utilisateur dont l'ID est fourni dans l'URL.
 * @Conditions :
 *  - l'ID fourni correspond à un utilisateur existant
 *  - l'utilisateur n'est pas déjà banni.
 */
async function patchBanUserById(req, res) {
    try {
        const userExistant = await users.findByPk(req.params.id);

        if(!userExistant) {
            return res.status(404).json({
                success: false,
                error : "User introuvable"
            });
        }

        if(userExistant.ban){
            return res.status(400).json({
                success: false,
                error : "L'user est déjà banni"
            });
        }

        await userExistant.update({
            ban : true
        });

        return res.status(200).json({
            success : true,
            data : {
                message : "Utilisateur banni avec succès"
            }
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


/**
 * Permet à un admin de débannir un utilisateur dont l'ID est fourni dans l'URL.
 * @Conditions :
 *  - l'ID fourni correspond à un utilisateur existant
 *  - l'utilisateur est déjà banni
 */
async function patchUnbanUserById(req, res) {
    try {
        const userExistant = await users.findByPk(req.params.id);

        if(!userExistant) {
            return res.status(404).json({
                success: false,
                error : "User introuvable"
            });
        }

        if(!userExistant.ban){
            return res.status(400).json({
                success: false,
                error : "L'user n'est actuellement pas ban"
            });
        }

        await userExistant.update({
            ban : false
        });

        return res.status(200).json({
            success : true,
            data : {
                message : "L'utilisateur a été débanni avec succès"
            }
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    getAllUsers,
    patchBanUserById,
    patchUnbanUserById
}