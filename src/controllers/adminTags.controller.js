const { tag } = require('../models');

/**
 * Permet aux admins de créer de nouveaux tags.
 * @Condition : Aucun tag déjà présent en BD ne doit comporter ce libelle.
 * Exemple de body :
 * {
 *     "libelle" : "films"
 * }
 */
async function postCreateTag(req, res) {
    try {

        const { newLibelle } = req.body;

        const tagExistant = await tag.findOne({
            where : {
                libelle : newLibelle
            }
        });

        if(tagExistant) {
            return res.status(400).json({
                success: false,
                error : "Un tag comporte déjà ce libelle"
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


/**
 * Permet la suppression d'un tag existant en BD.
 */
async function deleteTagById(req, res) {
    try{
        const tagExistant = await tag.findByPk(req.params.id);

        if(!tagExistant) {
            return res.status(404).json({
                success: false,
                error : "Tag introuvable"
            });
        }

        await tagExistant.destroy();

        return res.status(200).json({
            success : true,
            data : {
                success: false,
                error : "Tag supprimé avec succès"
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
    postCreateTag,
    deleteTagById
};