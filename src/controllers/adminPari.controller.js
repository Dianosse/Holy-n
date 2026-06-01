const { users, pari, choix, tag, parichoix, mise } = require('../models');
const { Op } = require('sequelize');
const sequelize = require("../config/database");


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

        const allBets = await mise.findAll({ where: { idpari: poll.id } });
        for (const bet of allBets) {
            const bettor = await users.findByPk(bet.iduser);
            if (bettor) {
                await bettor.update({ solde: Number(bettor.solde) + Number(bet.montant) });
            }
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
                message : "Pari refusé, mises remboursées"
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

        const allBets = await mise.findAll({ where: { idpari: poll.id } });
        for (const bet of allBets) {
            const bettor = await users.findByPk(bet.iduser);
            if (bettor) {
                await bettor.update({ solde: Number(bettor.solde) + Number(bet.montant) });
            }
        }

        await poll.update({
            actif : false,
            visible : false,
            datearchivage : new Date()
        });

        return res.status(200).json({
            success : true,
            data : {
                message : "Pari fermé, mises remboursées"
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
                message : "Pari résolu. Appelez /:id/redistribute pour distribuer les gains."
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

async function patchRedistributePoll(req, res) {
    try {
        const poll = await pari.findByPk(req.params.id);

        if (!poll) {
            return res.status(404).json({
                success: false,
                error: "Pari introuvable"
            });
        }

        if (poll.actif !== false || !poll.dateresolution || !poll.idchoixgagnant) {
            return res.status(400).json({
                success: false,
                error: "Le pari doit être résolu avant redistribution"
            });
        }

        const allMises = await mise.findAll({ where: { idpari: poll.id } });

        if (allMises.length === 0) {
            return res.status(200).json({
                success: true,
                data: { message: "Aucune mise sur ce pari, rien à redistribuer" }
            });
        }

        const totalMisePari = allMises.reduce((sum, m) => sum + Number(m.montant), 0);
        const misesGagnantes = allMises.filter(m => m.idchoix === poll.idchoixgagnant);
        const totalMiseGagnante = misesGagnantes.reduce((sum, m) => sum + Number(m.montant), 0);

        if (misesGagnantes.length === 0) {
            for (const bet of allMises) {
                const bettor = await users.findByPk(bet.iduser);
                if (bettor) {
                    await bettor.update({ solde: Number(bettor.solde) + Number(bet.montant) });
                }
            }
            return res.status(200).json({
                success: true,
                data: {
                    message: "Aucun parieur sur le choix gagnant, toutes les mises remboursées",
                    totalMisePari
                }
            });
        }

        for (const miseGagnante of misesGagnantes) {
            const gain = (Number(miseGagnante.montant) / totalMiseGagnante) * totalMisePari;
            const userGagnant = await users.findByPk(miseGagnante.iduser);
            if (userGagnant) {
                await userGagnant.update({ solde: Number(userGagnant.solde) + gain });
            }
        }

        return res.status(200).json({
            success: true,
            data: {
                message: "Gains distribués aux gagnants",
                totalMisePari,
                totalMiseGagnante,
                nbGagnants: misesGagnantes.length
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
    getAllPollsPending,
    patchAcceptPoll,
    patchRefusePoll,
    patchClosePoll,
    patchResolvePoll,
    patchRedistributePoll
}
