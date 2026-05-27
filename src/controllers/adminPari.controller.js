const { users, pari, choix, tag, parichoix } = require('../models');

async function getAllPollsPending(req, res) {
    try {
        const allPollsPending = await pari.findAll({
            where: {
                approuve: false,
                datearchivage: null
            },
            include: [
                {
                    model: choix,
                    as: "idchoix_choixes",
                    attributes: ["id", "libelle"],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: tag,
                    as: "idtag_tags",
                    attributes: ["id", "libelle"],
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        return res.status(200).json({
            success : true,
            data : {
                allPollsPending
            }
        })

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function patchAcceptPoll(req, res) {
    try {
        const poll = await pari.findByPk(req.params.id);

        if(!poll) {
            return res.status(404).json({
                success: false,
                error : "Pari introuvable"
            });
        }

        await poll.update({
            approuve : true,
            visible : true,
            actif : true
        })

        return res.status(200).json({
            success : true,
            data : {
                message : "Pari accepté, désormais approuvé, actif et visible pour tous"
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

async function patchRefusePoll(req, res) {
    try {
        const poll = await pari.findByPk(req.params.id);

        if(!poll) {
            return res.status(404).json({
                success: false,
                error : "Pari introuvable"
            });
        }

        await poll.update({
            approuve : false,
            visible : false,
            actif : false,
            datearchivage : new Date()
        });

        return res.status(200).json({
            success : true,
            data : {
                message : "Pari refusé avec succès"
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

async function patchClosePoll(req, res) {
    try {
        const poll = await pari.findByPk(req.params.id);

        if(!poll) {
            return res.status(404).json({
                success: false,
                error : "Pari introuvable"
            });
        }

        await poll.update({
            actif : false,
        });

        return res.status(200).json({
            success : true,
            data : {
                message : "Pari fermé"
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

async function patchResolvePoll(req, res) {
    try {
        const poll = await pari.findByPk(req.params.id);

        if(!poll) {
            return res.status(404).json({
                success: false,
                error : "Pari introuvable"
            });
        }

        const { idChoix } = req.body;

        const choixExistant = await choix.findByPk(idChoix);

        if(!choixExistant) {
            return res.status(404).json({
                success: false,
                error : "Choix introuvable"
            });
        }

        const pariChoixExistant = await parichoix.findOne({
            where : {
                idpari : poll.id,
                idchoix : idChoix
            }
        });

        if(!pariChoixExistant) {
            return res.status(404).json({
                success: false,
                error : "Ce pari ne comporte pas ce choix"
            });
        }

        await poll.update({
            idchoixgagnant : idChoix,
            actif: false,
            dateresolution: new Date()
        });

        return res.status(200).json({
            success : true,
            data : {
                message : "Pari résolu"
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
    getAllPollsPending,
    patchAcceptPoll,
    patchRefusePoll,
    patchClosePoll,
    patchResolvePoll
}