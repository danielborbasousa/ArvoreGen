const express = require("express");
const router = express.Router();
const db = require("../config/db");

// LOGIN
router.post("/login", (req, res) => {
  const { ds_email, pw_senha } = req.body;

  const sql = `
    SELECT 
      id_usuario,
      no_usuario,
      dt_nascimento,
      ds_email,
      nu_vertical,
      nu_horizontal,
      nu_whatsapp,
      lk_foto,
      role,
      pw_senha
    FROM tbl_usuarios
    WHERE ds_email = ? AND pw_senha = ?
  `;

  db.query(sql, [ds_email, pw_senha], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.length === 0) {
      return res.status(400).json({ message: "Email ou senha incorretos!" });
    }

    const usuario = result[0];
    delete usuario.pw_senha;

    res.json({ usuario });
  });
});

// BUSCAR USUÁRIO
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      id_usuario,
      no_usuario,
      dt_nascimento,
      ds_email,
      nu_vertical,
      nu_horizontal,
      nu_whatsapp,
      lk_foto,
      role
    FROM tbl_usuarios
    WHERE id_usuario = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(result[0]);
  });
});

// ATUALIZAR USUÁRIO
router.put("/:id", (req, res) => {
  const { id } = req.params;

  const {
    no_usuario,
    dt_nascimento,
    ds_email,
    nu_vertical,
    nu_horizontal,
    nu_whatsapp,
    lk_foto,
    pw_senha
  } = req.body;

  const sql = `
    UPDATE tbl_usuarios SET 
      no_usuario = ?, 
      dt_nascimento = ?, 
      ds_email = ?, 
      nu_vertical = ?, 
      nu_horizontal = ?, 
      nu_whatsapp = ?, 
      lk_foto = ?
      ${pw_senha ? ", pw_senha = ?" : ""}
    WHERE id_usuario = ?
  `;

  const params = [
    no_usuario,
    dt_nascimento,
    ds_email,
    nu_vertical,
    nu_horizontal,
    nu_whatsapp,
    lk_foto
  ];

  if (pw_senha) params.push(pw_senha);

  params.push(id);

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Perfil atualizado com sucesso!" });
  });
});

module.exports = router;
