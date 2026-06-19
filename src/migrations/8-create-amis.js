'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('amis', {
            iduser: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            idamis: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
        }, {
            schema: 'public',
        });

        await queryInterface.addIndex('amis', ['iduser', 'idamis'], {
            name: 'pk_amis',
            unique: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('amis');
    },
};