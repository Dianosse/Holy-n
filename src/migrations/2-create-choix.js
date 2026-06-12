'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('choix', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                primaryKey: true,
            },
            libelle: {
                type: Sequelize.STRING(64),
                allowNull: false,
            },
        }, {
            schema: 'public',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('choix');
    },
};