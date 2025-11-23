📁 README.md: API & BANCO DE DADOS (BACKEND)
Este README contém o guia para configurar e iniciar o servidor Node.js e o banco de dados MySQL para o sistema ArvoreGen.

⚙️ 1. Visão Geral do Sistema
Este repositório contém a API (Node.js/Express) responsável por gerenciar a conexão com o banco de dados MySQL, manipular as regras de negócio (como vincular cônjuges e filhos) e fornecer os dados formatados (JSON) para o frontend.

🛠️ 2. Pré-requisitos
Node.js e npm: Versão 16+ (recomendado Node v20+).

MySQL Server: Servidor MySQL ativo e acessível (Ex: localhost:3306).

💾 3. Configuração do Banco de Dados
3.1. Criação do Schema
Crie um novo schema (banco de dados) no seu MySQL com o nome: sistema_familia.

Garanta que as credenciais em backend/config/db.js estejam corretas (host, user, password).

3.2. Estrutura das Tabelas (SQL) 

CREATE DATABASE sistema_familia;
USE sistema_familia;

-- Tabela de usuários
CREATE TABLE tbl_usuarios (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    no_usuario VARCHAR(120) NOT NULL,
    pw_senha VARCHAR(80) NOT NULL,
    dt_nascimento DATE,
    ds_email VARCHAR(120),
    nu_vertical INT,
    nu_horizontal INT,
    nu_whatsapp VARCHAR(20),
    lk_foto VARCHAR(80)
);

-- Tabela de cônjuges
CREATE TABLE tbl_conjuges (
    id_conjuge BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_a BIGINT,
    usuario_b BIGINT,
    dt_casamento DATE,
    ds_local VARCHAR(80),
    FOREIGN KEY (usuario_a) REFERENCES tbl_usuarios(id_usuario),
    FOREIGN KEY (usuario_b) REFERENCES tbl_usuarios(id_usuario)
);

-- Tabela de filhos
CREATE TABLE tbl_filhos (
    id_filho BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_filho BIGINT,
    id_pai BIGINT,
    id_mae BIGINT,
    FOREIGN KEY (id_usuario_filho) REFERENCES tbl_usuarios(id_usuario),
    FOREIGN KEY (id_pai) REFERENCES tbl_usuarios(id_usuario),
    FOREIGN KEY (id_mae) REFERENCES tbl_usuarios(id_usuario)
);

USE sistema_familia;

INSERT INTO tbl_usuarios (no_usuario, pw_senha, dt_nascimento, ds_email, nu_vertical, nu_horizontal, nu_whatsapp, lk_foto)
VALUES
('João Silva', '1234', '1990-05-15', 'joao@email.com', 1, 1, '11999999999', 'joao.png'),
('Maria Souza', '1234', '1992-08-20', 'maria@email.com', 2, 1, '11988888888', 'maria.png'),
('Pedro Oliveira', '1234', '2015-03-10', 'pedro@email.com', 1, 2, NULL, 'pedro.png');


INSERT INTO tbl_conjuges (usuario_a, usuario_b, dt_casamento, ds_local)
VALUES (1, 2, '2014-06-20', 'São Paulo');

INSERT INTO tbl_filhos (id_usuario_filho, id_pai, id_mae)
VALUES (3, 1, 2);

SELECT * FROM tbl_usuarios

ALTER TABLE tbl_usuarios
ADD COLUMN role VARCHAR(20) DEFAULT 'user';


UPDATE tbl_usuarios 
SET role = 'admin'
WHERE id_usuario = 9;

UPDATE tbl_usuarios 
SET role = 'user'
WHERE id_usuario = 1;

ALTER TABLE tbl_conjuges ADD COLUMN fl_divorcio BOOLEAN DEFAULT FALSE;
ALTER TABLE tbl_conjuges ADD COLUMN dt_fim_casamento DATE NULL;

🚀 4. Como Iniciar o Servidor
Abra o terminal na pasta raiz do backend.

Instale as dependências (express, mysql2, cors, multer):

npm install

Inicie o servidor:

node app.js

(O servidor estará rodando em http://localhost:3001).

🌐 5. Endpoints PrincipaisMétodoEndpointDescriçãoGET/arvore[PRINCIPAL] Retorna todos os dados formatados (pessoas, cônjuges, pais/filhos) para o frontend.POST/usuariosCadastra um novo usuário (com upload de foto).POST/conjugesCria um vínculo conjugal entre dois IDs.POST/conjuges/divorcioMarca um vínculo conjugal existente como encerrado (fl_divorcio = 1).POST/filhosCria o vínculo de filiação entre filho, pai e mãe.
