
---

# 📁 ArvoreGen – API & Banco de Dados (Backend)

Este repositório contém o backend do sistema **ArvoreGen**, responsável pela API em **Node.js/Express** e pelo gerenciamento do banco de dados **MySQL**.
Aqui você encontrará tudo o que precisa para configurar o ambiente e iniciar o servidor.

---

## ⚙️ 1. Visão Geral do Sistema

A API é responsável por:

* Conectar ao banco MySQL
* Gerenciar regras de negócio (cônjuges, filhos, vínculos familiares)
* Fornecer dados formatados em **JSON** para o frontend
* Integrar uploads de imagens (perfil dos usuários)

---

## 🛠️ 2. Pré-requisitos

Certifique-se de ter:

* **Node.js 16+** (recomendado: Node v20+)
* **npm**
* **MySQL Server** ativo (ex: `localhost:3306`)

---

## 💾 3. Configuração do Banco de Dados

### **3.1 Criar o Schema**

Crie um banco de dados chamado:

```
sistema_familia
```

Atualize suas credenciais em:

```
backend/config/db.js
```

### **3.2 Estrutura das Tabelas (SQL Completo)**

```sql
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

-- Dados de exemplo
INSERT INTO tbl_usuarios (no_usuario, pw_senha, dt_nascimento, ds_email, nu_vertical, nu_horizontal, nu_whatsapp, lk_foto)
VALUES
('João Silva', '1234', '1990-05-15', 'joao@email.com', 1, 1, '11999999999', 'joao.png'),
('Maria Souza', '1234', '1992-08-20', 'maria@email.com', 2, 1, '11988888888', 'maria.png'),
('Pedro Oliveira', '1234', '2015-03-10', 'pedro@email.com', 1, 2, NULL, 'pedro.png');

INSERT INTO tbl_conjuges (usuario_a, usuario_b, dt_casamento, ds_local)
VALUES (1, 2, '2014-06-20', 'São Paulo');

INSERT INTO tbl_filhos (id_usuario_filho, id_pai, id_mae)
VALUES (3, 1, 2);

-- Adicionar campo de permissão
ALTER TABLE tbl_usuarios
ADD COLUMN role VARCHAR(20) DEFAULT 'user';

UPDATE tbl_usuarios SET role = 'admin' WHERE id_usuario = 9;
UPDATE tbl_usuarios SET role = 'user' WHERE id_usuario = 1;

-- Campos para divórcio
ALTER TABLE tbl_conjuges ADD COLUMN fl_divorcio BOOLEAN DEFAULT FALSE;
ALTER TABLE tbl_conjuges ADD COLUMN dt_fim_casamento DATE NULL;
```

---

## 🚀 4. Como Iniciar o Servidor

1. Acesse a pasta **backend** no terminal.
2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor:

```bash
node app.js
```

O backend ficará disponível em:
👉 **[http://localhost:3001](http://localhost:3001)**

---

## 🌐 5. Endpoints Principais

| Método | Endpoint             | Descrição                                                 |
| ------ | -------------------- | --------------------------------------------------------- |
| GET    | `/arvore`            | **[PRINCIPAL]** Retorna todos os dados da árvore familiar |
| POST   | `/usuarios`          | Cadastra um novo usuário (com upload de foto)             |
| POST   | `/conjuges`          | Cria vínculo conjugal entre dois usuários                 |
| POST   | `/conjuges/divorcio` | Marca um casal como divorciado                            |
| POST   | `/filhos`            | Cria vínculo de filiação entre filho, pai e mãe           |

---

