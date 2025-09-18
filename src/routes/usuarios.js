const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Listar usuários
router.get("/", (req, res) => {
  db.query("SELECT * FROM tbl_usuarios", (err, results) => {
    if (err) throw err;
    res.render("usuarios", { usuarios: results });
  });
});

// Form de cadastro
router.get("/cadastro", (req, res) => {
  res.render("cadastroUsuario");
});

// Salvar usuário
router.post("/cadastro", (req, res) => {
  const { no_usuario, pw_senha, dt_nascimento, ds_email, nu_whatsapp } = req.body;
  const sql = "INSERT INTO tbl_usuarios (no_usuario, pw_senha, dt_nascimento, ds_email, nu_whatsapp) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [no_usuario, pw_senha, dt_nascimento, ds_email, nu_whatsapp], (err) => {
    if (err) throw err;
    res.redirect("/usuarios");
  });
});

module.exports = router;