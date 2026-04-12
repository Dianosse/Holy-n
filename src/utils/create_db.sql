CREATE TABLE Users (
                       id uuid DEFAULT gen_random_uuid(),
                       admin BOOLEAN,
                       nom VARCHAR(32),
                       prenom VARCHAR(32),
                       pseudo VARCHAR(32),
                       description VARCHAR(128),
                       ban BOOLEAN,
                       passwordHash TEXT,
                       mail VARCHAR(32) NOT NULL UNIQUE,
                       solde NUMERIC,
                       CONSTRAINT PK_User PRIMARY KEY (id)
);

CREATE TABLE Amis (
                      idUser uuid,
                      idAmis uuid,
                      CONSTRAINT PK_Amis PRIMARY KEY (idUser, idAmis),
                      CONSTRAINT FK_User_Amis FOREIGN KEY (idUser) REFERENCES Users(id),
                      CONSTRAINT FK_Amis_User FOREIGN KEY (idAmis) REFERENCES Users(id)
);


CREATE TABLE Pari (
                      id uuid DEFAULT gen_random_uuid(),
                      idUser uuid,
                      visible BOOLEAN,
                      actif BOOLEAN,
                      approuve BOOLEAN,
                      intitule VARCHAR(32),
                      description VARCHAR(100),
                      dateCreation DATE,
                      dateCloture DATE,
                      dateSuppression DATE,
                      CONSTRAINT PK_Pari PRIMARY KEY (id),
                      CONSTRAINT FK_User_Pari FOREIGN KEY (idUser) REFERENCES Users(id)
);

CREATE TABLE Tag (
                     id uuid DEFAULT gen_random_uuid(),
                     libelle VARCHAR(16),
                     CONSTRAINT PK_Tag PRIMARY KEY (id)
);

CREATE TABLE Choix (
                       id uuid DEFAULT gen_random_uuid(),
                       libelle VARCHAR(16),
                       CONSTRAINT PK_Choix PRIMARY KEY (id)
);

CREATE TABLE PariChoix (
                           idPari uuid,
                           idChoix uuid,
                           CONSTRAINT PK_PariChoix PRIMARY KEY (idPari, idChoix),
                           CONSTRAINT FK_Pari_Choix FOREIGN KEY (idPari) REFERENCES Pari(id),
                           CONSTRAINT FK_Choix_Pari FOREIGN KEY (idChoix) REFERENCES Choix(id)
);

CREATE TABLE PariTag (
                         idPari uuid,
                         idTag uuid,
                         CONSTRAINT PK_PariTag PRIMARY KEY (idPari, idTag),
                         CONSTRAINT FK_Pari_Tag FOREIGN KEY (idPari) REFERENCES Pari(id),
                         CONSTRAINT FK_Tag_Pari FOREIGN KEY (idTag) REFERENCES Tag(id)
);

CREATE TABLE Mise (
                      idUser uuid,
                      idPari uuid,
                      idChoix uuid,
                      montant NUMERIC,
                      dateDePari DATE,
                      CONSTRAINT PK_Mise PRIMARY KEY (idUser, idPari, idChoix),
                      CONSTRAINT FK_Mise_User FOREIGN KEY (idUser) REFERENCES Users(id),
                      CONSTRAINT FK_Mise_Pari FOREIGN KEY (idPari) REFERENCES Pari(id),
                      CONSTRAINT FK_Mise_Choix FOREIGN KEY (idChoix) REFERENCES Choix(id)
);
