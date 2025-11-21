const express = require("express");
const router = express.Router();
const db = require("../config/db");

// LOGIN COM ROLE
router.post("/login", (req, res) => {
  const { ds_email, pw_senha } = req.body;

  if (!ds_email || !pw_senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
  }

  const sql = "SELECT id_usuario, no_usuario, ds_email, role FROM tbl_usuarios WHERE ds_email = ? AND pw_senha = ?";
  db.query(sql, [ds_email, pw_senha], (err, results) => {
    if (err) {
      console.error("Erro ao realizar login:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    const usuario = results[0];

    // Se não existir role no banco, define user
    if (!usuario.role) {
      usuario.role = "user";
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario,
    });
  });
});

module.exports = router;
