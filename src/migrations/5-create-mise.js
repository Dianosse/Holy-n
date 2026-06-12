'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('mise', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                primaryKey: true,
            },
            iduser: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            idpari: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'pari',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            idchoix: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'choix',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            montant: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            datedepari: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('now()'),
            },
        }, {
            schema: 'public',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('mise');
    },
};