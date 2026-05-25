const { pari, tag, users, paritag, parichoix, choix } = require('../models');

async function getAllPolls(req, res) {
    try {
        // TODO : recherche par mot-clef dans intitule/description, par tag et par choix
        const polls = await pari.findByPk({
            where : {
                approuve : true
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
                message : "Pari introuvable"
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

        // TODO : faire que chaque pari a un nom unique ?

        if(!intitule || intitule < 3 || intitule > 64) {
            return res.status(400).json({
                success: false,
                error: "Intitule invalide"
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

async function postBet(req, res) {
    try {

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

    } catch(error) {
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
    getBets
};