'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('mise', [
            { id: '40885134-c22c-466f-a1f9-12bc6d5b84ea', iduser: '6d10faf0-7bde-49a8-8313-ee0419e17b8c', idpari: 'fd81ac1e-87d9-4efd-b304-8dd1edcbd3a8', idchoix: '49b10898-f1ab-437c-8514-b27d1ece96ee', montant: 50, datedepari: '2026-06-02 10:00:00.000000 +00:00' },
            { id: '7ee6e148-1bb2-4d14-a512-29c81151cc32', iduser: '06009b68-4d46-4de6-9c21-a9f5f975fe42', idpari: 'fd81ac1e-87d9-4efd-b304-8dd1edcbd3a8', idchoix: '49b10898-f1ab-437c-8514-b27d1ece96ee', montant: 75, datedepari: '2026-06-02 10:20:00.000000 +00:00' },
            { id: '25278a43-592a-49d1-bdd1-51c3d2d80d72', iduser: '390be483-2443-4e4a-8f56-f0b0cbaa1c5e', idpari: 'fd81ac1e-87d9-4efd-b304-8dd1edcbd3a8', idchoix: 'fcbaa34b-0d47-4cc9-b781-c833d62f62bb', montant: 30, datedepari: '2026-06-03 07:10:00.000000 +00:00' },
            { id: 'c1cf11dd-b552-44f7-8514-002538f7a072', iduser: 'a40de2af-c00a-45c3-b468-0646eb228526', idpari: 'fd81ac1e-87d9-4efd-b304-8dd1edcbd3a8', idchoix: '00d768dd-8065-4883-b41d-06ef93bf6cfd', montant: 40, datedepari: '2026-06-03 12:45:00.000000 +00:00' },
            { id: '4b1990c2-f9af-47d7-802b-31eb602352f5', iduser: 'fb375591-7ded-48a3-b6f0-da582b2130c7', idpari: '5dc572d7-7e62-4fbf-a7f2-14ed5fa8ffa0', idchoix: '7d1215f3-8ad7-41ae-ada3-37541f2e14e6', montant: 100, datedepari: '2026-06-04 15:00:00.000000 +00:00' },
            { id: '90e25e21-97ed-4a95-9b05-17265a20ea50', iduser: '77f548a5-84e0-4562-b276-2bf0c41efb50', idpari: '5dc572d7-7e62-4fbf-a7f2-14ed5fa8ffa0', idchoix: '51bda75a-d543-42e3-bbc1-cc91f6cfa215', montant: 25, datedepari: '2026-06-04 16:10:00.000000 +00:00' },
            { id: '6068f704-d4e7-49db-8611-8544f6499713', iduser: '6dd9a80c-469a-4589-83d5-c79c6afff168', idpari: '5dc572d7-7e62-4fbf-a7f2-14ed5fa8ffa0', idchoix: '7d1215f3-8ad7-41ae-ada3-37541f2e14e6', montant: 60, datedepari: '2026-06-05 09:00:00.000000 +00:00' },
            { id: '0d690b10-27af-45c3-bfbe-8eec14e428c9', iduser: 'fb375591-7ded-48a3-b6f0-da582b2130c7', idpari: '7862ecd5-32e0-4260-b5a5-4d3d1434a522', idchoix: 'b50a964d-9724-4e8a-95c9-dcc0fe8733f6', montant: 45, datedepari: '2026-06-05 17:15:00.000000 +00:00' },
            { id: '285e16d7-af50-413f-a73a-b1b2a31d6cc6', iduser: 'cf95662e-cc88-4b9e-8bf4-9243655fa474', idpari: '7862ecd5-32e0-4260-b5a5-4d3d1434a522', idchoix: '319e4cfc-83a9-4889-9ebd-875f4a5ab254', montant: 30, datedepari: '2026-06-06 06:40:00.000000 +00:00' },
            { id: 'bb249406-5c36-4771-8825-e8d337e1338b', iduser: 'e7a02d86-cddc-43ed-8c74-a98b59308790', idpari: '7862ecd5-32e0-4260-b5a5-4d3d1434a522', idchoix: '61726d05-b830-4e7d-9e75-f47a0580a0ff', montant: 15, datedepari: '2026-06-06 08:00:00.000000 +00:00' },
            { id: '565ba6bd-3540-41cf-beac-4f025346ee60', iduser: '390be483-2443-4e4a-8f56-f0b0cbaa1c5e', idpari: '7862ecd5-32e0-4260-b5a5-4d3d1434a522', idchoix: 'b50a964d-9724-4e8a-95c9-dcc0fe8733f6', montant: 80, datedepari: '2026-06-06 09:25:00.000000 +00:00' },
            { id: '32f3ce5a-8bd9-4004-978e-af7b6cd1fc65', iduser: '6d10faf0-7bde-49a8-8313-ee0419e17b8c', idpari: 'a85d615c-77b4-49cd-abc5-d58d8c6e175d', idchoix: 'eafce937-a473-4f06-b59b-bf93feb957ea', montant: 35, datedepari: '2026-06-06 11:00:00.000000 +00:00' },
            { id: '8e8b3ae0-f959-4ccf-b6b7-dfa4f50ffb82', iduser: '06009b68-4d46-4de6-9c21-a9f5f975fe42', idpari: 'a85d615c-77b4-49cd-abc5-d58d8c6e175d', idchoix: '37fdd673-ea13-4eab-9859-35ea78022660', montant: 55, datedepari: '2026-06-06 11:30:00.000000 +00:00' },
            { id: 'a51b8dd8-7ed6-45b7-b714-dcb8ebce8286', iduser: 'a40de2af-c00a-45c3-b468-0646eb228526', idpari: 'a85d615c-77b4-49cd-abc5-d58d8c6e175d', idchoix: 'eafce937-a473-4f06-b59b-bf93feb957ea', montant: 65, datedepari: '2026-06-07 07:00:00.000000 +00:00' },
            { id: '1fb7376d-8532-4515-a0a9-27036c1636a4', iduser: '390be483-2443-4e4a-8f56-f0b0cbaa1c5e', idpari: '0fa3971e-3b68-46fe-aebb-bcdf8686e04a', idchoix: '6d0d44f5-171b-435e-b75d-fc496cf1caf7', montant: 90, datedepari: '2026-06-07 08:00:00.000000 +00:00' },
            { id: 'b9319877-5ca9-4079-8e10-964d6957ddc3', iduser: 'fb375591-7ded-48a3-b6f0-da582b2130c7', idpari: '0fa3971e-3b68-46fe-aebb-bcdf8686e04a', idchoix: 'be0844db-94c4-4857-bbb6-d4768a23ca84', montant: 70, datedepari: '2026-06-07 08:30:00.000000 +00:00' },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('mise', null, {});
    },
};