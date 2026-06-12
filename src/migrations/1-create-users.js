'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                primaryKey: true,
            },
            admin: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            nom: {
                type: Sequelize.STRING(32),
                allowNull: true,
            },
            prenom: {
                type: Sequelize.STRING(32),
                allowNull: true,
            },
            pseudo: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            ban: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            passwordhash: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            mail: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            solde: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                defaultValue: 0,
            },
            remember_token: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            remember_token_expires: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        }, {
            schema: 'public',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('users');
    },
};