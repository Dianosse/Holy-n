'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('users', [
            { id: '8005f07c-7464-47d5-af61-3661afe5f027', admin: true, nom: 'admin', prenom: 'admin', pseudo: 'admin', description: null, ban: false, passwordhash: '$argon2id$v=19$m=65536,t=3,p=4$Kb7euTsLXaMBeTdLWUW2HA$3UqNO394ZL7GB8oF9XoMIYJZ3q0Or9Z9VGuvOXUs23Y', mail: 'admin@exemple.com', solde: 1000 },
            { id: 'cf95662e-cc88-4b9e-8bf4-9243655fa474', admin: false, nom: 'YAPA', prenom: 'Yann', pseudo: 'Yaya', description: null, ban: false, passwordhash: '$argon2id$v=19$m=65536,t=3,p=4$0fp3WIo/aDpjpUByYhH5gQ$rE/LCFRbgHk5BrNERBjdDc09i76BcpGdQTfGrcO3vHQ', mail: 'yayan@exemple.com', solde: 180 },
            { id: '6dd9a80c-469a-4589-83d5-c79c6afff168', admin: false, nom: 'ESCALADE', prenom: 'Alex', pseudo: 'Alex', description: null, ban: false, passwordhash: '$argon2id$v=19$m=65536,t=3,p=4$sTbkCceBhK59dxf18UQzAA$a8jf/YmTVHsLviIOOXcNqNDVpOKiS1cpgdqZNAPRVs4', mail: 'alex@exemple.com', solde: 510 },
            { id: 'e7a02d86-cddc-43ed-8c74-a98b59308790', admin: false, nom: 'Bridges', prenom: 'Sam', pseudo: 'Porter', description: null, ban: false, passwordhash: '$argon2id$v=19$m=65536,t=3,p=4$l4fe+aX81KSb0U/JTp+CwQ$ja7LpBstLIMbehuSEZrop+EFn5nQ3mK6IR0rYJfvjeU', mail: 'higgs@exemple.com', solde: 230 },
            { id: '390be483-2443-4e4a-8f56-f0b0cbaa1c5e', admin: false, nom: 'SOPRANO', prenom: 'Tony', pseudo: 'gabagool', description: null, ban: false, passwordhash: '$argon2id$v=19$m=65536,t=3,p=4$RB7EZVNsaGz74/9Lz5+d1Q$db78kybwGxw0Oh3cS+pIwDECrgW2Zx9uSKCVQD5dXCo', mail: 'hereheis@exemple.com', solde: 850 },
            { id: 'a40de2af-c00a-45c3-b468-0646eb228526', admin: false, nom: 'Parker', prenom: 'Peter', pseudo: 'voisinSympa', description: null, ban: false, passwordhash: '$argon2id$v=19$m=65536,t=3,p=4$B3eIBdXtt1bdKn7N/e14nA$tehFyUFCDp2V4LX01piSfolylVYIKGM7DVCSC+VJ+S4', mail: 'batman@exemple.com', solde: 620 },
            { id: '77f548a5-84e0-4562-b276-2bf0c41efb50', admin: false, nom: 'MAD', prenom: 'Max', pseudo: 'Vrooom', description: null, ban: false, passwordhash: '$argon2id$v=19$m=65536,t=3,p=4$hHytGPc7Vfg5JE4Hj6KpvA$s9X+1KFpwePG87RQYxisRr9SFoQHd44IDEoR5osHFnU', mail: 'pascontent@exemple.com', solde: 95 },
            { id: 'fb375591-7ded-48a3-b6f0-da582b2130c7', admin: false, nom: 'toitoi', prenom: 'ne', pseudo: 'anto', description: null, ban: false, passwordhash: '$argon2id$v=19$m=65536,t=3,p=4$88H+ZDv4tEQsJBO8fANbKg$WgNsdBHwOcslUpQRi/Q0T+ESNMWxbYrVLy05PiwjRGc', mail: 'toine@exemple.com', solde: 205 },
            { id: '6d10faf0-7bde-49a8-8313-ee0419e17b8c', admin: false, nom: 'ILIES', prenom: 'ELIAS', pseudo: 'elias', description: null, ban: false, passwordhash: '$argon2id$v=19$m=65536,t=3,p=4$o3WEdGoAW/mbmkf9yf7+og$xzRkQ4dddWbFgmiO818DmcVcTAsbtDnwFXKZUARgHd0', mail: 'elias@leboss.com', solde: 128 },
            { id: '06009b68-4d46-4de6-9c21-a9f5f975fe42', admin: false, nom: 'PISC', prenom: 'Victor', pseudo: 'Vicovic', description: null, ban: false, passwordhash: '$argon2id$v=19$m=65536,t=3,p=4$fvekZsNAbE/GgLmgH8RzpQ$xu9LsRFwWE87Swon6fptGzMVuUGN6rHX78X7kx/BN08', mail: 'vic@exemple.com', solde: 400 },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('users', null, {});
    },
};