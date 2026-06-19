'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('paritag', {
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
            idtag: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'tag',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
        }, {
            schema: 'public',
        });

        await queryInterface.addIndex('paritag', ['idpari', 'idtag'], {
            name: 'pk_paritag',
            unique: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('paritag');
    },
};