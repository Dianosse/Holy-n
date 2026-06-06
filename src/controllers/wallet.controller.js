const { users } = require('../models');
const sequelize = require("../config/database");
const { QueryTypes } = require("sequelize");


/**
 * Retourne le solde de l'utilisateur actuellement connecté et le total d'argent qu'il a actuellement misé.
 */
async function getPersonnalWallet(req, res) {
    try{
        const userConnecte = await users.findByPk(req.user.id);

        const solde = Number(userConnecte.solde);

        const result = await sequelize.query(
            `
            SELECT COALESCE(SUM(m.montant), 0) AS "totalMise"
            FROM mise m
            JOIN pari p ON m.idpari = p.id
            WHERE m.iduser = :idUser
              AND p.actif = true;
            `,
            {
                replacements: {
                    idUser: userConnecte.id
                },
                type: QueryTypes.SELECT
            }
        );

        const totalMise = Number(result[0].totalMise);

        return res.status(200).json({
            success : true,
            data : {
                "solde" : solde,
                "totalMise" : totalMise
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
 * Ajoute au solde de l'utilisateur connecté le montant envoyé depuis le front.
 * @Condition : argent doit être un nombre positif.
 * Exemple de body :
 * {
 *     "argent" : 12345
 * }
 */
async function postDepositMoney(req, res) {
    try {
        const userConnecte = await users.findByPk(req.user.id);

        const { argent } = req.body;

        if (argent === undefined || argent === null || argent === "") {
            return res.status(400).json({
                success: false,
                error: "Le montant est obligatoire"
            });
        }

        const argentNumber = Number(argent);

        if (Number.isNaN(argentNumber)) {
            return res.status(400).json({
                success: false,
                error: "Le montant doit être un nombre"
            });
        }

        if (argentNumber <= 0) {
            return res.status(400).json({
                success: false,
                error: "Le montant doit être positif"
            });
        }

        const soldeActuel = Number(userConnecte.solde);
        const nouveauSolde = soldeActuel + argentNumber;

        await userConnecte.update({
            solde: nouveauSolde
        });

        return res.status(200).json({
            success: true,
            data: {
                id: userConnecte.id,
                admin: userConnecte.admin,
                mail: userConnecte.mail,
                pseudo: userConnecte.pseudo,
                nom: userConnecte.nom,
                prenom: userConnecte.prenom,
                description: userConnecte.description,
                ban: userConnecte.ban,
                solde: userConnecte.solde
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
 * Retire au solde de l'utilisateur connecté le montant envoyé depuis le front.
 * @Conditions :
 *  - argent doit être un nombre positif.
 *  - Le solde de l'utilisateur ne doit pas tomber en négatif
 * Exemple de body :
 * {
 *     "argent" : "114114"
 * }
 */
async function postWithdrawMoney(req, res) {
    try {
        const userConnecte = await users.findByPk(req.user.id);

        const { argent } = req.body;

        if (argent === undefined || argent === null || argent === "") {
            return res.status(400).json({
                success: false,
                error: "Le montant est obligatoire"
            });
        }

        const argentNumber = Number(argent);

        if (Number.isNaN(argentNumber)) {
            return res.status(400).json({
                success: false,
                error: "Le montant doit être un nombre"
            });
        }

        if (argentNumber <= 0) {
            return res.status(400).json({
                success: false,
                error: "Le montant doit être positif"
            });
        }

        const soldeActuel = Number(userConnecte.solde);
        const nouveauSolde = soldeActuel - argentNumber;

        if (nouveauSolde < 0) {
            return res.status(400).json({
                success: false,
                error: "Le solde ne peut pas passer en négatif"
            });
        }

        await userConnecte.update({
            solde: nouveauSolde
        });

        return res.status(200).json({
            success: true,
            data: {
                id: userConnecte.id,
                admin: userConnecte.admin,
                mail: userConnecte.mail,
                pseudo: userConnecte.pseudo,
                nom: userConnecte.nom,
                prenom: userConnecte.prenom,
                description: userConnecte.description,
                ban: userConnecte.ban,
                solde: userConnecte.solde
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
    getPersonnalWallet,
    postDepositMoney,
    postWithdrawMoney
};