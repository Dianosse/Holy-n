const { tag, users } = require('../models');

/**
 * {
 *     "libelle" : "films"
 * }
 */
async function postCreateTag(req, res) {
    try {
        const userExistant = await users.findOne({
            where : {
                id : req.user.id
            }
        });

        if(!userExistant) {
            return res.status(404).json({
                message: "User introuvable"
            });
        }

        if(!userExistant.admin){
            return res.status(400).json({
                message: "Il faut être admin pour effectuer cette action"
            });
        }

        const { newLibelle } = req.body;

        const tagExistant = await tag.findOne({
            where : {
                libelle : newLibelle
            }
        });

        if(tagExistant) {
            return res.status(400).json({
                message : "Un tag comporte déjà ce libelle"
            });
        }

        const newTag = await tag.create({
            libelle : newLibelle
        });

        res.status(201).json({
            success : true,
            data : {
                newTag
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

async function deleteTagById(req, res) {

}

module.exports = {
    postCreateTag,
    deleteTagById
};