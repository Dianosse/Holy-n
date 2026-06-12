'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('tag', [
            { id: '3c9deec2-8030-4f1b-8dbe-be19c78c26b2', libelle: 'sport' },
            { id: '7f3fc9b2-5d5d-45b6-919e-36ba10f2c1a1', libelle: 'foot' },
            { id: '1209497f-025b-46e7-810a-25a0d764c498', libelle: 'cinema' },
            { id: 'a075ac0f-5eff-41b1-a065-ca80d37427e0', libelle: 'gaming' },
            { id: '7b4b591e-3d05-4a86-b4c6-cf0148814382', libelle: 'politique' },
            { id: '1c3bad7a-6d5d-4820-9c1a-c6e6d5c03140', libelle: 'tech' },
            { id: '8ae805ef-8ba0-485b-b990-47936ef91537', libelle: 'serie' },
            { id: 'feea3a30-c8ed-4ffa-b017-07e2cb87fbe8', libelle: 'fun' },
            { id: '4e1b6e54-f6f7-4cc3-a62e-7c89b1b1a3a2', libelle: 'musique' },
            { id: '1f81c2ef-6d20-4db1-b597-7bbeb9c04a0c', libelle: 'anime' },
            { id: '0d8ad8ef-7d6f-4cc9-9922-4c3e0e8dc30b', libelle: 'food' },
            { id: 'ffb5e812-d3c9-40d8-95cf-bf6806053b29', libelle: 'auto' },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('tag', null, {});
    },
};