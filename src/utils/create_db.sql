CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE Users (
                       id uuid DEFAULT gen_random_uuid(),
                       admin BOOLEAN NOT NULL DEFAULT false,
                       nom VARCHAR(32),
                       prenom VARCHAR(32),
                       pseudo VARCHAR(32) NOT NULL,
                       description VARCHAR(255),
                       ban BOOLEAN NOT NULL DEFAULT false,
                       passwordHash TEXT NOT NULL,
                       mail VARCHAR(100) NOT NULL UNIQUE,
                       solde NUMERIC NOT NULL DEFAULT 0,
                       CONSTRAINT PK_User PRIMARY KEY (id),
                       CONSTRAINT CK_User_Solde CHECK (solde >= 0)
);

CREATE TABLE Amis (
                      idUser uuid,
                      idAmis uuid,
                      CONSTRAINT PK_Amis PRIMARY KEY (idUser, idAmis),
                      CONSTRAINT FK_User_Amis FOREIGN KEY (idUser) REFERENCES Users(id) ON DELETE CASCADE,
                      CONSTRAINT FK_Amis_User FOREIGN KEY (idAmis) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Choix (
                       id uuid DEFAULT gen_random_uuid(),
                       libelle VARCHAR(64) NOT NULL,
                       CONSTRAINT PK_Choix PRIMARY KEY (id)
);

CREATE TABLE Pari (
                      id uuid DEFAULT gen_random_uuid(),
                      idUser uuid NOT NULL,
                      visible BOOLEAN NOT NULL DEFAULT false,       -- est-ce que le pari est visible pour tous les utilisateurs ?
                      actif BOOLEAN NOT NULL DEFAULT false,         -- le pari a-t-il été archivé ou non approuvé ?
                      approuve BOOLEAN NOT NULL DEFAULT false,      -- le pari a-t-il été validé par un admin ?
                      intitule VARCHAR(64) NOT NULL,
                      description TEXT,
                      dateCreation TIMESTAMPTZ NOT NULL DEFAULT now(),
                      dateCloture TIMESTAMPTZ,  -- quand les gens ne pourront plus parier
                      dateArchivage TIMESTAMPTZ,  -- le pari n'est plus actif et est donc archivé
                      idChoixGagnant uuid,
                      CONSTRAINT PK_Pari PRIMARY KEY (id),
                      CONSTRAINT FK_User_Pari FOREIGN KEY (idUser) REFERENCES Users(id) ON DELETE CASCADE,
                      CONSTRAINT FK_Choix_Pari FOREIGN KEY (idChoixGagnant) REFERENCES Choix(id)
);

CREATE TABLE Tag (
                     id uuid DEFAULT gen_random_uuid(),
                     libelle VARCHAR(16) NOT NULL UNIQUE,
                     CONSTRAINT PK_Tag PRIMARY KEY (id)
);

CREATE TABLE PariChoix (
                           idPari uuid,
                           idChoix uuid,
                           CONSTRAINT PK_PariChoix PRIMARY KEY (idPari, idChoix),
                           CONSTRAINT FK_Pari_PariChoix FOREIGN KEY (idPari) REFERENCES Pari(id) ON DELETE CASCADE,
                           CONSTRAINT FK_Choix_PariChoix FOREIGN KEY (idChoix) REFERENCES Choix(id)
);

CREATE TABLE PariTag (
                         idPari uuid,
                         idTag uuid,
                         CONSTRAINT PK_PariTag PRIMARY KEY (idPari, idTag),
                         CONSTRAINT FK_Pari_Tag FOREIGN KEY (idPari) REFERENCES Pari(id) ON DELETE CASCADE,
                         CONSTRAINT FK_Tag_Pari FOREIGN KEY (idTag) REFERENCES Tag(id)
);

CREATE TABLE Mise (
                      id uuid DEFAULT gen_random_uuid(),
                      idUser uuid NOT NULL,
                      idPari uuid NOT NULL,
                      idChoix uuid NOT NULL,
                      montant NUMERIC NOT NULL,
                      dateDePari TIMESTAMPTZ NOT NULL DEFAULT now(),
                      CONSTRAINT PK_Mise PRIMARY KEY (id),
                      CONSTRAINT FK_Mise_User FOREIGN KEY (idUser) REFERENCES Users(id) ON DELETE CASCADE,
                      CONSTRAINT FK_Mise_Pari FOREIGN KEY (idPari) REFERENCES Pari(id) ON DELETE CASCADE,
                      CONSTRAINT FK_Mise_Choix FOREIGN KEY (idChoix) REFERENCES Choix(id),
                      CONSTRAINT CK_Mise_Montant CHECK (montant > 0)
);



