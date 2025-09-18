const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Listar cônjuges
router.get("/", (req, res) => {
  const sql = `
    SELECT c.id_conjuge, u1.no_usuario AS usuario_a, u2.no_usuario AS usuario_b, c.dt_casamento, c.ds_local
    FROM tbl_conjuges c
    JOIN tbl_usuarios u1 ON c.usuario_a = u1.id_usuario
    JOIN tbl_usuarios u2 ON c.usuario_b = u2.id_usuario
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render("conjuges", { conjuges: results });
  });
});

// Form de cadastro
router.get("/cadastro", (req, res) => {
  db.query("SELECT * FROM tbl_usuarios", (err, results) => {
    if (err) throw err;
    res.render("cadastroConjuge", { usuarios: results });
  });
});

// Salvar
router.post("/cadastro", (req, res) => {
  const { usuario_a, usuario_b, dt_casamento, ds_local } = req.body;
  const sql = "INSERT INTO tbl_conjuges (usuario_a, usuario_b, dt_casamento, ds_local) VALUES (?, ?, ?, ?)";
  db.query(sql, [usuario_a, usuario_b, dt_casamento, ds_local], (err) => {
    if (err) throw err;
    res.redirect("/conjuges");
  });
});

// Deletar
router.get("/delete/:id", (req, res) => {
  const sql = "DELETE FROM tbl_conjuges WHERE id_conjuge = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) throw err;
    res.redirect("/conjuges");
  });
});

// Editar (form)
router.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM tbl_conjuges WHERE id_conjuge = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    db.query("SELECT * FROM tbl_usuarios", (err2, usuarios) => {
      if (err2) throw err2;
      res.render("editarConjuge", { conjuge: result[0], usuarios });
    });
  });
});

// Atualizar
router.post("/edit/:id", (req, res) => {
  const { usuario_a, usuario_b, dt_casamento, ds_local } = req.body;
  const sql = "UPDATE tbl_conjuges SET usuario_a=?, usuario_b=?, dt_casamento=?, ds_local=? WHERE id_conjuge=?";
  db.query(sql, [usuario_a, usuario_b, dt_casamento, ds_local, req.params.id], (err) => {
    if (err) throw err;
    res.redirect("/conjuges");
  });
});

module.exports = router;