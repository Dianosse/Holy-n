const { users, pari, mise, amis } = require('../models');
const sequelize = require("../config/database");
const { QueryTypes } = require("sequelize");


async function getLeaderbord(req, res) {

}

// end-points qui a un effet sur l'utilisateur actuellement connecté

async function modifyUser(req, res) {
    try {
        const user = await users.findByPk(req.user.id);
        const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const {nom, prenom, pseudo, description, mail} = req.body;

        if(mail !== undefined) {
            if(!mailRegex.test(mail) || mail.length > 100) {
                return res.status(400).json({
                    success: false,
                    error: "Email invalide"
                });
            }
        }

        if(nom !== undefined) {
            if(nom.trim().length === 0 || nom.length > 32) {
                return res.status(400).json({
                    success: false,
                    error: 'Format de nom invalide'
                });
            }
        }

        if(prenom !== undefined) {
            if(prenom.trim().length === 0 || prenom.length > 32) {
                return res.status(400).json({
                    success: false,
                    error: 'Format de prenom invalide'
                });
            }
        }

        if(pseudo !== undefined) {
            if(pseudo.trim().length === 0 || pseudo.length > 32) {
                return res.status(400).json({
                    success: false,
                    error: 'Format de pseudo invalide'
                });
            }
        }

        if(description !== undefined) {
            if(description.length > 255) {
                return res.status(400).json({
                    success: false,
                    error: 'Format de description invalide'
                });
            }
        }

        await user.update({
            nom,
            prenom,
            pseudo,
            description,
            mail
        });

        return res.status(200).json({
            success : true,
            data : {
                id : user.id,
                admin : user.admin,
                mail: user.mail,
                pseudo: user.pseudo,
                nom : user.nom,
                prenom : user.prenom,
                description : user.description,
                ban : user.ban,
                solde : user.solde
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

async function getUserBets(req, res) {
    try {
        const userBets = await mise.findAll({
            where : {
                iduser : req.user.id
            }
        });

        res.status(201).json({
            success: true,
            data : {
                userBets
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

async function getUserPolls(req, res) {
    try {
        const userPolls = await pari.findAll({
            where : {
                iduser : req.user.id
            }
        });

        return res.status(201).json({
            success: true,
            data : {
                userPolls
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

async function deleteUser(req, res) {
    try {
        const user = await users.findByPk(req.user.id);

        await user.destroy();

        return res.status(200).json({
            success: true,
            infos: "Utilisateur supprimé avec succès"
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// end-points qui a un effet sur n'importe quel user via l'ID

async function getUserById(req, res) {
    try {
        const id = req.params.id;

        const user = await users.findByPk(id);

        if(!user) {
            return res.status(404).json({
                success: false,
                error : "User introuvable"
            });
        }

        return res.status(201).json({
            success: true,
            data : {
                id : user.id,
                admin : user.admin,
                mail: user.mail,
                pseudo: user.pseudo,
                nom : user.nom,
                prenom : user.prenom,
                description : user.description,
                ban : user.ban,
                solde : user.solde
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

async function getUserStatsById(req, res) {
    try {

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function getUserPollsById(req, res) {
    try {
        const id = req.params.id;

        const user = await users.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error : "User introuvable"
            });
        }

        const userPolls = await pari.findAll({
            where : {
                iduser : user.id
            }
        });

        return res.status(201).json({
            success: true,
            data : {
                userPolls
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
 * idUser = la personne qui suit
 * idAmis = la personne suivie
 */
async function postFollowUserById(req, res) {
    try {
        const userConnecteId = req.user.id;
        const userExistant = await users.findByPk(req.params.id);

        if(!userExistant) {
            return res.status(404).json({
                success: false,
                error : "Un user n'existe pas"
            });
        }

        if(userConnecteId === userExistant.id) {
            return res.status(400).json({
                success: false,
                error : "Impossible d'être amis avec soi-même"
            });
        }

        const amiExistant = await amis.findOne({
            where : {
                iduser : userConnecteId,
                idamis : userExistant.id
            }
        });

        if(amiExistant) {
            return res.status(400).json({
                success: false,
                error : "L'utilisateur actuellement connecté follow déjà cet user"
            });
        }

        await amis.create({
            iduser : userConnecteId,
            idamis : userExistant.id
        });

        return res.status(201).json({
            success : true,
            data : {
                success: false,
                error : "L'utilisateur connecté follow désormais cet user"
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

async function deleteFollowUserById(req, res) {
    try {
        const userConnecteId = req.user.id;
        const userExistant = await users.findByPk(req.params.id);

        if(!userExistant) {
            return res.status(404).json({
                success: false,
                error : "L'user mentionné n'existe pas"
            });
        }

        const amiExistant = await amis.findOne({
            where : {
                iduser : userConnecteId,
                idamis : userExistant.id
            }
        });

        if(!amiExistant) {
            return res.status(400).json({
                success: false,
                error : "L'utilisateur connecté ne follow pas cet user"
            });
        }

        await amiExistant.destroy();

        return res.status(200).json({
            success : true,
            data : {
                success: false,
                error : "L'utilisateur connecté ne follow plus cet user"
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
 * Retourne les users qui suivent l'user qui a l'id :id
 */
async function getFollowersById(req, res) {
    try {
        const userExistant = await users.findByPk(req.params.id);

        if(!userExistant) {
            return res.status(404).json({
                success: false,
                error : "L'user mentionné n'existe pas"
            });
        }

        const allFollowers = await sequelize.query(
            `
                SELECT u1.id, u1.pseudo, u1.mail
                FROM amis a
                         INNER JOIN users u1 ON a.iduser = u1.id
                         INNER JOIN users u2 ON a.idamis = u2.id
                WHERE u2.id = :idUser;
            `,
            {
                replacements: {
                    idUser: userExistant.id
                },
                type: QueryTypes.SELECT
            }
        );

        return res.status(200).json({
            success : true,
            data : {
                allFollowers
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
 * Retourne les users que :id follow
 */
async function getFollowingById(req, res) {
    try {
        const userExistant = await users.findByPk(req.params.id);

        if(!userExistant) {
            return res.status(404).json({
                success: false,
                error : "L'user mentionné n'existe pas"
            });
        }

        const allFollowing = await sequelize.query(
            `
                SELECT u2.id, u2.pseudo, u2.mail
                FROM amis a
                         INNER JOIN users u1 ON a.iduser = u1.id
                         INNER JOIN users u2 ON a.idamis = u2.id
                WHERE u1.id = :idUser;
            `,
            {
                replacements: {
                    idUser: userExistant.id
                },
                type: QueryTypes.SELECT
            }
        );

        return res.status(200).json({
            success : true,
            data : {
                allFollowing
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
    getLeaderbord,
    modifyUser,
    getUserBets,
    getUserById,
    getUserStatsById,
    getUserPollsById,
    deleteUser,
    getUserPolls,
    postFollowUserById,
    deleteFollowUserById,
    getFollowersById,
    getFollowingById
};