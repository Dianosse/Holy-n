'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('parichoix', {
            idpari: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'pari',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            idchoix: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'choix',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
        }, {
            schema: 'public',
        });

        await queryInterface.addIndex('parichoix', ['idpari', 'idchoix'], {
            name: 'pk_parichoix',
            unique: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('parichoix');
    },
};