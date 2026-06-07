const { users } = require('../models')
const { v4: uuidv4 } = require('uuid');
const cookieLib = require('cookie');

const passwordUtils = require('../utils/passwordHash');


/**
 * Permet la création d'un compte, tous les champs (mail, pseudo, password, passwordConfirm, nom, prenom) doivent être présents dans le bon format
 * Condition mot de passe : au moins 8 caractères / une minuscule / une majuscule / un caractère spécial / un chiffre
 * @Condition : aucun autre utilisateur ne doit avoir l'email de ce nouveau compte
 */
async function registerUser(req, res) {
    try {
        const {mail, pseudo, password, passwordConfirm, nom, prenom} = req.body;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
        const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const admin = false;

        if (!mail || !pseudo || !password || !passwordConfirm || !nom || !prenom) {
            return res.status(400).json({
                success: false,
                error: 'Champs obligatoires manquants'
            });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({
                success: false,
                error: 'Les mots de passe ne correspondent pas'
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'
            });
        }

        if (!mailRegex.test(mail) || mail.length > 100) {
            return res.status(400).json({
                success: false,
                error: 'Format de mail invalide'
            });
        }

        if(nom.trim().length === 0 || nom.length > 32) {
            return res.status(400).json({
                success: false,
                error: 'Format de nom invalide'
            });
        }

        if(prenom.trim().length === 0 || prenom.length > 32) {
            return res.status(400).json({
                success: false,
                error: 'Format de prenom invalide'
            });
        }

        if(pseudo.trim().length === 0 || pseudo.length > 32) {
            return res.status(400).json({
                success: false,
                error: 'Format de pseudo invalide'
            });
        }

        const userExistant = await users.findOne({
            where :
                {
                    mail : mail
                }
        });

        if(userExistant != null) {
            return res.status(400).json({
                success: false,
                error: 'Mail déjà utilisé'
            });
        }

        const passwordhash = await passwordUtils.hashPassword(password);

        console.log(passwordhash);

        const user = await users.create({
            admin,
            nom,
            prenom,
            pseudo,
            mail,
            passwordhash
        });

        req.session.regenerate((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    error: 'Erreur serveur'
                });
            }

            // stock l'utilisateur au sein de req
            req.session.user = {
                id: user.id,
                mail: user.mail,
                pseudo: user.pseudo,
                admin: user.admin
            };

            return res.status(201).json({
                success: true,
                data: {
                    id: user.id,
                    mail: user.mail,
                    pseudo: user.pseudo
                }
            });
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
 * Connexion à un compte existant via l'email et le mot de passe
 * @Condition : un utilisateur avec cet email doit exister et le mot de passe doit être valide
 */
async function loginUser(req, res) {
    try {
        const { mail, password, rememberMe } = req.body;

        if (!mail || !password) {
            return res.status(400).json({
                success: false,
                error: 'Champs obligatoires manquants'
            });
        }

        const userExistant = await users.findOne({
            where :
                {
                    mail : mail
                }
        });

        if (userExistant === null) {
            return res.status(401).json({
                success: false,
                error: 'Identifiants invalides'
            });
        }

        const match = await passwordUtils.comparePassword(userExistant.passwordhash, password);

        if (!match) {
            return res.status(401).json({
                success: false,
                error: 'Identifiants invalides'
            });
        }

        req.session.regenerate(async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    error: 'Erreur serveur'
                });
            }

            req.session.user = {
                id: userExistant.id,
                mail: userExistant.mail,
                pseudo: userExistant.pseudo,
                admin: userExistant.admin
            };

            if (rememberMe) {
                try {
                    const token = uuidv4();
                    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    await userExistant.update({ remember_token: token, remember_token_expires: expires });
                    res.cookie('remember_token', token, {
                        httpOnly: true,
                        secure: false,
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                        sameSite: 'lax'
                    });
                } catch (tokenErr) {
                    console.error('[remember_me]', tokenErr.message);
                }
            }

            return res.status(201).json({
                success: true,
                data: {
                    id: userExistant.id,
                    mail: userExistant.mail,
                    pseudo: userExistant.pseudo
                }
            });
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
 * Supprime la session de l'utilisateur connecté, efface le remember_token et retire les cookies.
 */
async function logoutUser(req, res) {
    try {
        const cookies = cookieLib.parse(req.headers.cookie || '');
        const token = cookies.remember_token;
        if (token) {
            await users.update(
                { remember_token: null, remember_token_expires: null },
                { where: { remember_token: token } }
            );
        }

        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    error: 'Erreur lors de la déconnexion'
                });
            }

            res.clearCookie('connect.sid');
            res.clearCookie('remember_token');

            return res.status(200).json({
                success: true,
                message: 'Déconnexion réussie'
            });
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
 * Retourne les informations relatives à l'utilisateur actuellement connecté.
 */
async function getMe(req, res) {
    try {
        const user = await users.findOne({
            where : {
                id : req.user.id
            }
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
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe
};