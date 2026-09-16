USE teste_banco_v001;

CREATE TABLE RESPONSAVEL (
    id_responsavel INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    rg VARCHAR(20),
    copia_rg_e_cpf JSON NOT NULL,
    tel_contato VARCHAR(20) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    UNIQUE (cpf, email)
);

CREATE TABLE ALUNO (
    id_aluno INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    rg VARCHAR(20),
    genero ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
    copia_documentos JSON NOT NULL,
    informacoes_medicas VARCHAR(255),
    data_matricula DATETIME NOT NULL,
    UNIQUE (cpf)
);

CREATE TABLE ALUNO_RESPONSAVEL (
    grau_parentesco ENUM('Pai', 'Mãe', 'Tutor', 'Outro') NOT NULL,
    id_responsavel INT NOT NULL,
    id_aluno INT NOT NULL,
    PRIMARY KEY (id_responsavel, id_aluno)
);

CREATE TABLE CAMPEONATO (
    id_campeonato INT PRIMARY KEY AUTO_INCREMENT,
    nome_campeonato VARCHAR(100) NOT NULL,
    tipo_formato VARCHAR(50),
    status ENUM('Planejado', 'Em Andamento', 'Finalizado', 'Cancelado')
);

CREATE TABLE ALUNO_CAMPEONATO (
    id_aluno INT NOT NULL,
    id_campeonato INT NOT NULL,
    PRIMARY KEY (id_aluno, id_campeonato)
);

CREATE TABLE PROFESSOR_VOLUNTARIO (
    id_professor INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    formacao VARCHAR(100),
    UNIQUE (cpf)
);

CREATE TABLE TURMA (
    id_turma INT PRIMARY KEY AUTO_INCREMENT,
    horarios_semanal DATETIME NOT NULL,
    id_aluno INT NOT NULL
);

CREATE TABLE AULA (
    id_aula INT PRIMARY KEY AUTO_INCREMENT,
    data_aula DATE NOT NULL,
    observacoes VARCHAR(255),
    id_turma INT,
    id_professor INT NOT NULL
);

CREATE TABLE LISTA_PRESENCA (
    status_presenca BOOLEAN NOT NULL,
    id_aluno INT NOT NULL,
    id_aula INT NOT NULL,
    PRIMARY KEY (id_aluno, id_aula)
);

CREATE TABLE PARTIDA (
    id_partida INT PRIMARY KEY AUTO_INCREMENT,
    fase VARCHAR(50),
    placar VARCHAR(20),
    data_jogo DATE,
    id_campeonato INT NOT NULL
);

CREATE TABLE MINISTRAR_AULA (
    id_ministra INT PRIMARY KEY AUTO_INCREMENT,
    id_aula INT NOT NULL,
    id_professor INT NOT NULL
);

CREATE TABLE COORDENAR_CAMPEONATO (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
    id_campeonato INT,
    id_professor INT NOT NULL
);

-- CHAVES ESTRANGEIRAS (FOREIGN KEYS)

ALTER TABLE ALUNO_RESPONSAVEL ADD FOREIGN KEY(id_responsavel) REFERENCES RESPONSAVEL (id_responsavel);
ALTER TABLE ALUNO_RESPONSAVEL ADD FOREIGN KEY(id_aluno) REFERENCES ALUNO (id_aluno);

ALTER TABLE ALUNO_CAMPEONATO ADD FOREIGN KEY(id_aluno) REFERENCES ALUNO (id_aluno);
ALTER TABLE ALUNO_CAMPEONATO ADD FOREIGN KEY(id_campeonato) REFERENCES CAMPEONATO (id_campeonato);

ALTER TABLE LISTA_PRESENCA ADD FOREIGN KEY(id_aluno) REFERENCES ALUNO (id_aluno);
ALTER TABLE LISTA_PRESENCA ADD FOREIGN KEY(id_aula) REFERENCES AULA (id_aula);

ALTER TABLE AULA ADD FOREIGN KEY(id_turma) REFERENCES TURMA (id_turma);
ALTER TABLE AULA ADD FOREIGN KEY(id_professor) REFERENCES PROFESSOR_VOLUNTARIO (id_professor);

ALTER TABLE TURMA ADD FOREIGN KEY(id_aluno) REFERENCES ALUNO (id_aluno);

ALTER TABLE PARTIDA ADD FOREIGN KEY(id_campeonato) REFERENCES CAMPEONATO (id_campeonato);

ALTER TABLE MINISTRAR_AULA ADD FOREIGN KEY(id_aula) REFERENCES AULA (id_aula);
ALTER TABLE MINISTRAR_AULA ADD FOREIGN KEY(id_professor) REFERENCES PROFESSOR_VOLUNTARIO (id_professor);

ALTER TABLE COORDENAR_CAMPEONATO ADD FOREIGN KEY(id_campeonato) REFERENCES CAMPEONATO (id_campeonato);
ALTER TABLE COORDENAR_CAMPEONATO ADD FOREIGN KEY(id_professor) REFERENCES PROFESSOR_VOLUNTARIO (id_professor);