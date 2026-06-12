'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('pari', {
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
            visible: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            actif: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            approuve: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            intitule: {
                type: Sequelize.STRING(64),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            datecreation: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('now()'),
            },
            datecloture: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            datearchivage: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            idchoixgagnant: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'choix',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
        }, {
            schema: 'public',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('pari');
    },
};