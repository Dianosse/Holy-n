const { users, pari, mise, amis } = require('../models');
const sequelize = require("../config/database");
const { QueryTypes } = require("sequelize");
const { Op } = require('sequelize');


/**
 * Retourne le classement des 10 utilisateurs ayant gagné le plus d'argent
 * sur les paris résolus durant les 30 derniers jours.
 */
async function getLeaderboard(req, res) {
    try {
        const leaderboard = await sequelize.query(
            `
                SELECT
                    u.id,
                    u.pseudo,
                    u.description,

                    COALESCE(SUM(
                        CASE
                            WHEN m.idchoix = p.idchoixgagnant THEN
                                (
                                    m.montant / gagnants.total_mise_gagnante
                                ) * total_pari.total_mise_pari
                            ELSE 0
                        END
                    ), 0) AS total_gagne

                FROM users u

                INNER JOIN mise m ON m.iduser = u.id
                INNER JOIN pari p ON p.id = m.idpari

                INNER JOIN (
                    SELECT
                        idpari,
                        SUM(montant) AS total_mise_pari
                    FROM mise
                    GROUP BY idpari
                ) total_pari ON total_pari.idpari = p.id

                INNER JOIN (
                    SELECT
                        m2.idpari,
                        SUM(m2.montant) AS total_mise_gagnante
                    FROM mise m2
                    INNER JOIN pari p2 ON p2.id = m2.idpari
                    WHERE m2.idchoix = p2.idchoixgagnant
                    GROUP BY m2.idpari
                ) gagnants ON gagnants.idpari = p.id

                WHERE p.idchoixgagnant IS NOT NULL
                  AND p.datearchivage >= NOW() - INTERVAL '30 days'
                  AND u.ban = false

                GROUP BY u.id, u.pseudo, u.description

                ORDER BY total_gagne DESC

                LIMIT 10;
            `,
            {
                type: QueryTypes.SELECT
            }
        );

        return res.status(200).json({
            success: true,
            data: {
                leaderboard
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Modifie les informations du profil de l'utilisateur connecté.
 * @Condition : les champs fournis doivent respecter les formats attendus.
 */
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


/**
 * Retourne toutes les mises de l'utilisateur actuellement connecté.
 */
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


/**
 * Retourne tous les paris créés par l'utilisateur actuellement connecté.
 */
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


/**
 * Supprime le compte de l'utilisateur actuellement connecté.
 */
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


/**
 * Retourne les informations publiques d'un utilisateur à partir de son ID.
 * @Condition : l'ID fourni doit correspondre à un utilisateur existant.
 */
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


/**
 * Retourne les statistiques d'un utilisateur.
 * Les statistiques comprennent le total misé, le total gagné et le taux de réussite.
 * @Condition : l'ID fourni doit correspondre à un utilisateur existant.
 */
async function getUserStatsById(req, res) {
    try {
        const userExistant = await users.findByPk(req.params.id);

        if (!userExistant) {
            return res.status(404).json({
                success: false,
                error: "User introuvable"
            });
        }

        const stats = await sequelize.query(
            `
                SELECT
                    COALESCE(SUM(m.montant), 0) AS total_mise,
                    COUNT(m.id) AS nb_mises,

                    COUNT(
                        CASE 
                            WHEN p.idchoixgagnant IS NOT NULL 
                            THEN 1 
                        END
                    ) AS nb_mises_resolues,

                    COUNT(
                        CASE 
                            WHEN p.idchoixgagnant IS NOT NULL 
                             AND m.idchoix = p.idchoixgagnant
                            THEN 1 
                        END
                    ) AS nb_mises_gagnees
                FROM mise m
                INNER JOIN pari p ON m.idpari = p.id
                WHERE m.iduser = :idUser;
            `,
            {
                replacements: {
                    idUser: userExistant.id
                },
                type: QueryTypes.SELECT
            }
        );

        const stat = stats[0];

        const totalMise = Number(stat.total_mise);
        const nbMises = Number(stat.nb_mises);
        const nbMisesResolues = Number(stat.nb_mises_resolues);
        const nbMisesGagnees = Number(stat.nb_mises_gagnees);

        const tauxReussite = nbMisesResolues === 0
            ? 0
            : Number(((nbMisesGagnees / nbMisesResolues) * 100).toFixed(2));

        const misesGagnantes = await sequelize.query(
            `
                SELECT 
                    m.id AS id_mise,
                    m.idpari,
                    m.idchoix,
                    m.montant
                FROM mise m
                INNER JOIN pari p ON m.idpari = p.id
                WHERE m.iduser = :idUser
                  AND p.idchoixgagnant IS NOT NULL
                  AND m.idchoix = p.idchoixgagnant;
            `,
            {
                replacements: {
                    idUser: userExistant.id
                },
                type: QueryTypes.SELECT
            }
        );

        let totalGagne = 0;

        for (const miseGagnante of misesGagnantes) {
            const result = await sequelize.query(
                `
                    SELECT
                        COALESCE(SUM(m.montant), 0) AS total_mise_pari,

                        COALESCE(SUM(
                            CASE 
                                WHEN m.idchoix = p.idchoixgagnant
                                THEN m.montant
                                ELSE 0
                            END
                        ), 0) AS total_mise_choix_gagnant
                    FROM mise m
                    INNER JOIN pari p ON m.idpari = p.id
                    WHERE m.idpari = :idPari
                    GROUP BY p.idchoixgagnant;
                `,
                {
                    replacements: {
                        idPari: miseGagnante.idpari
                    },
                    type: QueryTypes.SELECT
                }
            );

            if (result.length > 0) {
                const totalMisePari = Number(result[0].total_mise_pari);
                const totalMiseChoixGagnant = Number(result[0].total_mise_choix_gagnant);
                const montantUser = Number(miseGagnante.montant);

                if (totalMiseChoixGagnant > 0) {
                    const gain = (montantUser / totalMiseChoixGagnant) * totalMisePari;
                    totalGagne += gain;
                }
            }
        }

        totalGagne = Number(totalGagne.toFixed(2));

        return res.status(200).json({
            success: true,
            data: {
                user: {
                    id: userExistant.id,
                    pseudo: userExistant.pseudo
                },
                stats: {
                    totalMise,
                    totalGagne,
                    nbMises,
                    nbMisesResolues,
                    nbMisesGagnees,
                    tauxReussite
                }
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


/**
 * Retourne tous les paris créés par un utilisateur à partir de son ID.
 * @Condition : l'ID fourni doit correspondre à un utilisateur existant.
 */
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
 * Permet à l'utilisateur connecté de suivre un autre utilisateur.
 * idUser = la personne qui suit
 * idAmis = la personne suivie
 * @Condition : l'utilisateur suivi doit exister et ne doit pas déjà être suivi.
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

        if(req.user.admin) {
            return res.status(403).json({
                success: false,
                error : "Les admins ne peuvent pas suivre d'autres utilisateurs"
            });
        }

        if(userExistant.admin) {
            return res.status(403).json({
                success: false,
                error : "Impossible de suivre un administrateur"
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


/**
 * Permet à l'utilisateur connecté d'arrêter de suivre un utilisateur.
 * @Condition : l'utilisateur doit exister et être suivi par l'utilisateur connecté.
 */
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

        if(req.user.admin) {
            return res.status(403).json({
                success: false,
                error : "Les admins ne peuvent pas gérer des follows"
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
 * Retourne les utilisateurs qui suivent l'utilisateur dont l'ID est fourni.
 * @Condition : l'ID fourni doit correspondre à un utilisateur existant.
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
 * Retourne les utilisateurs suivis par l'utilisateur dont l'ID est fourni.
 * @Condition : l'ID fourni doit correspondre à un utilisateur existant.
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


/**
 * Recherche des utilisateurs non bannis et non administrateurs.
 * La recherche se fait sur le pseudo, le nom, le prénom et le mail.
 * @Condition : le paramètre q doit être fourni.
 */
async function searchUsers(req, res) {
    try {
        const { q } = req.query;

        if (!q || q.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Le paramètre q est obligatoire"
            });
        }

        const usersFound = await users.findAll({
            where: {
                ban: false,
                admin: false,
                [Op.or]: [
                    {
                        pseudo: {
                            [Op.iLike]: `%${q}%`
                        }
                    },
                    {
                        nom: {
                            [Op.iLike]: `%${q}%`
                        }
                    },
                    {
                        prenom: {
                            [Op.iLike]: `%${q}%`
                        }
                    },
                    {
                        mail: {
                            [Op.iLike]: `%${q}%`
                        }
                    }
                ]
            },
            attributes: [
                "id",
                "pseudo",
                "nom",
                "prenom",
                "description",
                "mail"
            ],
            limit: 20
        });

        return res.status(200).json({
            success: true,
            data: {
                users: usersFound
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


module.exports = {
    getLeaderboard,
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
    getFollowingById,
    searchUsers
};