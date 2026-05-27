const { pari, tag, users, paritag, parichoix, choix, mise } = require('../models');
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { QueryTypes } = require('sequelize');

// TODO : un peu partout, vérifier que l'utilisateur n'est pas banni, vérifier pour les polls les booleans du type actif


/**
 * exemple de requête : http://localhost:3000/api/polls?search=aaaaa&tag=sport&sort=ASC&page=1&limit=10
 */
async function getAllPolls(req, res) {
    try {
        const { search, tag: tagQuery, sort } = req.query;

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
        const offset = (page - 1) * limit;

        const where = {
            visible: true,
            actif: true,
            approuve: true
        };

        const order = [];

        if (search) {
            where[Op.or] = [
                { intitule: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (sort?.toUpperCase() === "ASC") {
            order.push(["datecreation", "ASC"]);
        } else {
            order.push(["datecreation", "DESC"]);
        }

        const include = [
            {
                model: tag,
                as: "idtag_tags",
                attributes: ["id", "libelle"],
                through: {
                    attributes: []
                },
                required: !!tagQuery,
                ...(tagQuery && {
                    where: {
                        libelle: {
                            [Op.iLike]: tagQuery
                        }
                    }
                })
            }
        ];

        const { count, rows } = await pari.findAndCountAll({
            attributes: [
                "id",
                "intitule",
                "description",
                "datecreation",
                "datecloture"
            ],
            where,
            include,
            order,
            limit,
            offset,
            distinct: true
        });

        return res.status(200).json({
            success: true,
            data: {
                polls: rows
            },
            pagination: {
                page,
                limit,
                totalItems: count,
                totalPages: Math.ceil(count / limit)
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

async function getPollById(req, res) {
    try {
        const poll = await pari.findByPk(req.params.id);

        if(!poll) {
            return res.status(404).json({
                success: false,
                error : "Pari introuvable"
            });
        }

        const user = await users.findByPk(poll.iduser);

        const pollTags = await tag.findAll({
            attributes: ['id', 'libelle'],
            include: [
                {
                    model: paritag,
                    as: 'paritags',
                    attributes: [],
                    required: true,
                    where: {
                        idpari: poll.id
                    }
                }
            ],
            raw: true
        });

        const pollChoix = await choix.findAll({
            attributes: ['id', 'libelle'],
            include: [
                {
                    model: parichoix,
                    as: 'parichoixes',
                    attributes: [],
                    required: true,
                    where: {
                        idpari: poll.id
                    }
                }
            ],
            raw: true
        });

        return res.status(201).json({
            success : true,
            data : {
                poll,
                "creator" : {
                    "id" : user.id,
                    "pseudo" : user.pseudo
                },
                pollChoix,
                pollTags
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

async function deletePollById(req, res) {
    try {
        const poll = await pari.findByPk(req.params.id);

        if(!poll) {
            return res.status(404).json({
                success: false,
                error : "Pari introuvable"
            });
        }

        const idUserSuppose = poll.iduser;

        if(idUserSuppose !== req.user.id) {
            return res.status(404).json({
                success: false,
                error : "L'utilisateur essayant de supprimer le pari n'est pas celui à l'origine de ce pari"
            });
        }

        await poll.destroy();

        return res.status(201).json({
            success: true,
            data : {
                message : "Pari supprimé avec succès"
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

async function getAllTags(req, res) {
    try {
        const allTags = await tag.findAll();

        res.status(201).json({
           success : true,
           data : {
               allTags
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
 * Exemple du body du post :
 * {
 *   "intitule": "test test",
 *   "description": "desc de test",
 *   "dateCloture": "2026-06-01T20:00:00.000Z",
 *   "allChoix": [
 *     {
 *       "libelle": "Oui"
 *     },
 *     {
 *       "libelle": "Non"
 *     },
 *     {
 *         "libelle" : "Jsp"
 *     }
 *   ],
 *   "allTags": ["sport", "football"]
 * }
 */
async function postSubmitPoll(req, res) {
    try {
        const { intitule, description, dateCloture, allChoix, allTags} = req.body;

        const iduser = req.user.id;

        if(!intitule || intitule < 3 || intitule > 64) {
            return res.status(400).json({
                success: false,
                error: "Intitule invalide"
            });
        }

        const pariExistant = await pari.findOne({
            where : {
                intitule : intitule
            }
        });

        if (pariExistant) {                                 // chaque pari doit avoir un nom unique
            return res.status(400).json({
                success: false,
                error: "Un autre pari a déjà cet intitulé"
            });
        }

        if(!description || description < 3 || description > 255) {
            return res.status(400).json({
                success: false,
                error: "Description invalide"
            });
        }

        if(!dateCloture) {
            return res.status(400).json({
                success: false,
                error: "Date de cloture obligatoire"
            });
        }

        const dateClotureObj = new Date(dateCloture);

        if (isNaN(dateClotureObj.getTime())) {
            return res.status(400).json({
                success: false,
                error: "Date de cloture invalide"
            });
        }

        const now = new Date();

        if (dateClotureObj <= now) {
            return res.status(400).json({
                success: false,
                error: "La date de cloture doit être supérieur à aujourd'hui"
            });
        }

        // gestion des tags

        const allConfirmedTags = [];

        for(let i = 0; i < allTags.length; i++){
            const tagExistant = await tag.findOne({
                where : {
                    libelle : allTags[i]
                }
            });

            if(!tagExistant) {
                return res.status(400).json({
                    success: false,
                    error: "Un des tags n'existe pas"
                });
            }
            allConfirmedTags.push(tagExistant);
        }

        // gestion des choix

        if(allChoix.length > 10) {
            return res.status(400).json({
                success: false,
                error: "Le pari doit contenir moins que 10 choix"
            });
        }

        const allConfirmedChoix = [];

        for (let i = 0; i < allChoix.length; i++) {
            const choixExistant = await choix.findOne({
                where : {
                    libelle : allChoix[i].libelle
                }
            });

            if(!choixExistant) {
                const newChoix = await choix.create({
                    libelle : allChoix[i].libelle
                })
                allConfirmedChoix.push(newChoix);
            } else {
                allConfirmedChoix.push(choixExistant);
            }
        }

        // TODO : comment on gère si la création dans paritag ou parichoix plante pour rollback le pari ?

        console.log(dateClotureObj);

        // create du pari

        const newPari = await pari.create({
            iduser,
            intitule,
            description,
            datecloture : dateClotureObj
        })

        //create du lien paritag

        for(let i = 0; i < allConfirmedTags.length; i++){
            await paritag.create({
                idpari : newPari.id,
                idtag : allConfirmedTags[i].id
            });
        }

        // create du lien parichoix

        for(let i = 0; i < allConfirmedChoix.length; i++){
            await parichoix.create({
                idpari : newPari.id,
                idchoix : allConfirmedChoix[i].id
            });
        }

        return res.status(201).json({
            success : true,
            data : {
                newPari,
                "creator" : {
                    "id" : req.user.id,
                    "pseudo" : req.user.pseudo
                },
                allConfirmedTags,
                allConfirmedChoix
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
 * {
 *   "idChoix": "67b85b91-c10a-43bd-be9f-60cf62eb4580",
 *   "montant": 25
 * }
 */
async function postBet(req, res) {
    try {
        const poll = await pari.findByPk(req.params.id);

        if(!poll) {
            return res.status(404).json({
                success: false,
                error : "Pari introuvable"
            });
        }

        if(!poll.actif || !poll.visible || !poll.approuve) {
            return res.status(404).json({
                success: false,
                error : "Il n'est possible de parier que sur des paris actifs, visibles pour tous et approuvés par un admin"
            });
        }

        const userExistant = await users.findOne({
            where : {
                id : req.user.id
            }
        });

        if(!userExistant) {
            return res.status(404).json({
                success: false,
                error : "User introuvable"
            });
        }


        const { idChoix, montant } = req.body;

        const choixExistant = await choix.findOne({
            where : {
                id : idChoix
            }
        });

        if(!choixExistant) {
            return res.status(404).json({
                success: false,
                error : "Choix introuvable"
            });
        }

        if(montant === undefined || montant === null || montant === "") {
            return res.status(400).json({
                success: false,
                error: "Le montant est obligatoire"
            });
        }

        const montantNumber = Number(montant);

        if (Number.isNaN(montantNumber)) {
            return res.status(400).json({
                success: false,
                error: "Le montant doit être un nombre"
            });
        }

        if (montantNumber <= 0) {
            return res.status(400).json({
                success: false,
                error: "Le montant doit être positif"
            });
        }

        const newSolde = Number(userExistant.solde) - montantNumber;

        if(newSolde < 0) {
            return res.status(400).json({
                success: false,
                error: "Impossible de tomber en négatif en pariant"
            });
        }


        const newMise = await mise.create({
            iduser : userExistant.id,
            idpari : poll.id,
            idchoix : choixExistant.id,
            montant : montantNumber
        });

        await userExistant.update({
            solde : newSolde
        });

        return res.status(200).json({
            success : true,
            data : {
                newMise
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

async function getBets(req, res) {
    try {
        const poll = await pari.findByPk(req.params.id);

        if(!poll) {
            return res.status(404).json({
                success: false,
                error : "Pari introuvable"
            });
        }

        const allBets = await mise.findAll({
            where : {
                idpari : poll.id
            }
        });

        return res.status(200).json({
            success : true,
            data : {
                allBets
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


async function getQuoteAllChoicesById(req, res) {
    try {
        const poll = await pari.findByPk(req.params.id);

        if (!poll) {
            return res.status(404).json({
                success: false,
                error: "Pari introuvable"
            });
        }

        if (!poll.visible || !poll.approuve) {
            return res.status(403).json({
                success: false,
                error: "Ce pari n'est pas accessible"
            });
        }

        const choices = await sequelize.query(
            `
                SELECT 
                    c.id,
                    c.libelle,
                    COALESCE(SUM(m.montant), 0) AS total_mise
                FROM parichoix pc
                INNER JOIN choix c ON pc.idchoix = c.id
                LEFT JOIN mise m 
                    ON m.idchoix = c.id 
                    AND m.idpari = pc.idpari
                WHERE pc.idpari = :idPari
                GROUP BY c.id, c.libelle;
            `,
            {
                replacements: {
                    idPari: poll.id
                },
                type: QueryTypes.SELECT
            }
        );


        let totalVolumeChoix = 0;
        for (let i = 0; i < choices.length; i++) {
            totalVolumeChoix += Number(choices[i].total_mise);
        }

        const quotes = choices.map(choice => {
            const totalMise = Number(choice.total_mise);

            let quote;

            if (totalVolumeChoix === 0) {
                quote = choices.length;
            } else if (totalMise === 0) {
                quote = null;
            } else {
                quote = totalVolumeChoix / totalMise;
            }

            return {
                id: choice.id,
                libelle: choice.libelle,
                totalMise,
                quote: quote === null ? null : Number(quote.toFixed(2))
            };
        });

        return res.status(200).json({
            success: true,
            data: {
                pollId: poll.id,
                totalVolumeChoix,
                quotes
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
    getAllPolls,
    getPollById,
    deletePollById,
    getAllTags,
    postSubmitPoll,
    postBet,
    getBets,
    getQuoteAllChoicesById
};