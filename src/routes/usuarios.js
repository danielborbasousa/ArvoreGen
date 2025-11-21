const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ ROTA DE CADASTRO (Corrigida: Sem o campo 'role')
router.post("/", (req, res) => {
  const { no_usuario, pw_senha, ds_email, nu_whatsapp, dt_nascimento, lk_foto } = req.body;

  // Validação básica
  if (!no_usuario || !pw_senha || !ds_email) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes (Nome, Senha, Email)." });
  }

  // Removi 'role' desta query para compatibilidade com seu banco
  const sql = `
    INSERT INTO tbl_usuarios 
    (no_usuario, pw_senha, ds_email, nu_whatsapp, dt_nascimento, lk_foto, nu_vertical, nu_horizontal)
    VALUES (?, ?, ?, ?, ?, ?, 0, 0)
  `;

  db.query(
    sql, 
    [no_usuario, pw_senha, ds_email, nu_whatsapp || null, dt_nascimento || null, lk_foto || null], 
    (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar usuário:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "Este e-mail já está cadastrado." });
        }
        return res.status(500).json({ error: "Erro ao cadastrar usuário no banco." });
      }
      res.status(201).json({
        message: "Usuário cadastrado com sucesso!",
        id_usuario: result.insertId,
      });
    }
  );
});

// ✅ ROTA DE LOGIN (Corrigida: Sem buscar 'role' no banco)
router.post("/login", (req, res) => {
  const { ds_email, pw_senha } = req.body;

  if (!ds_email || !pw_senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
  }

  // Removi 'role' do SELECT
  const sql = "SELECT id_usuario, no_usuario, ds_email FROM tbl_usuarios WHERE ds_email = ? AND pw_senha = ?";
  
  db.query(sql, [ds_email, pw_senha], (err, results) => {
    if (err) {
      console.error("Erro ao realizar login:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    const usuario = results[0];

    // Atribuímos 'user' manualmente no código, já que não tem no banco
    usuario.role = "user";

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario,
    });
  });
});

// ✅ ROTA DE LISTAGEM
router.get("/", (req, res) => {
  db.query("SELECT id_usuario, no_usuario, ds_email FROM tbl_usuarios", (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuários:", err);
      return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
    res.json(results);
  });
});

module.exports = router;