'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('amis', [
            { iduser: '6d10faf0-7bde-49a8-8313-ee0419e17b8c', idamis: 'fb375591-7ded-48a3-b6f0-da582b2130c7' },
            { iduser: '6d10faf0-7bde-49a8-8313-ee0419e17b8c', idamis: '06009b68-4d46-4de6-9c21-a9f5f975fe42' },
            { iduser: '06009b68-4d46-4de6-9c21-a9f5f975fe42', idamis: '6d10faf0-7bde-49a8-8313-ee0419e17b8c' },
            { iduser: '06009b68-4d46-4de6-9c21-a9f5f975fe42', idamis: 'fb375591-7ded-48a3-b6f0-da582b2130c7' },
            { iduser: 'fb375591-7ded-48a3-b6f0-da582b2130c7', idamis: '6d10faf0-7bde-49a8-8313-ee0419e17b8c' },
            { iduser: 'fb375591-7ded-48a3-b6f0-da582b2130c7', idamis: '390be483-2443-4e4a-8f56-f0b0cbaa1c5e' },
            { iduser: 'cf95662e-cc88-4b9e-8bf4-9243655fa474', idamis: '6dd9a80c-469a-4589-83d5-c79c6afff168' },
            { iduser: '6dd9a80c-469a-4589-83d5-c79c6afff168', idamis: 'cf95662e-cc88-4b9e-8bf4-9243655fa474' },
            { iduser: 'e7a02d86-cddc-43ed-8c74-a98b59308790', idamis: '390be483-2443-4e4a-8f56-f0b0cbaa1c5e' },
            { iduser: '390be483-2443-4e4a-8f56-f0b0cbaa1c5e', idamis: 'e7a02d86-cddc-43ed-8c74-a98b59308790' },
            { iduser: 'a40de2af-c00a-45c3-b468-0646eb228526', idamis: 'fb375591-7ded-48a3-b6f0-da582b2130c7' },
            { iduser: '77f548a5-84e0-4562-b276-2bf0c41efb50', idamis: '06009b68-4d46-4de6-9c21-a9f5f975fe42' },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('amis', null, {});
    },
};