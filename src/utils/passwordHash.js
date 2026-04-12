const argon2 = require('argon2');

async function hashPassword(password){
    try {
        return await argon2.hash(password);
    } catch (err) {
        console.error(err);
    }
}

async function comparePassword(hash, password) {
    try {
        return await argon2.verify(hash, password);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    hashPassword,
    comparePassword
};