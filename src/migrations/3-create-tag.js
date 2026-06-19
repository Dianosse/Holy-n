'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tag', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                primaryKey: true,
            },
            libelle: {
                type: Sequelize.STRING(16),
                allowNull: false,
                unique: true,
            },
        }, {
            schema: 'public',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('tag');
    },
};