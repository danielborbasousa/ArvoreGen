const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Cadastro de usuário
router.post("/", (req, res) => {
  const { no_usuario, pw_senha, ds_email, nu_whatsapp, lk_foto } = req.body;

  if (!no_usuario || !pw_senha || !ds_email) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  const sql = `
    INSERT INTO tbl_usuarios (no_usuario, pw_senha, ds_email, nu_whatsapp, lk_foto)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [no_usuario, pw_senha, ds_email, nu_whatsapp || null, lk_foto || null], (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar usuário:", err);
      return res.status(500).json({ error: "Erro ao cadastrar usuário." });
    }
    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      id_usuario: result.insertId,
    });
  });
});

// ✅ Login de usuário
router.post("/login", (req, res) => {
  const { ds_email, pw_senha } = req.body;

  if (!ds_email || !pw_senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
  }

  const sql = "SELECT * FROM tbl_usuarios WHERE ds_email = ? AND pw_senha = ?";
  db.query(sql, [ds_email, pw_senha], (err, results) => {
    if (err) {
      console.error("Erro ao realizar login:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: results[0],
    });
  });
});

// ✅ Listar todos os usuários
router.get("/", (req, res) => {
  db.query("SELECT * FROM tbl_usuarios", (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuários:", err);
      res.status(500).json({ error: "Erro ao buscar usuários" });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
