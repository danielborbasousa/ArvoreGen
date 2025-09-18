const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Listar filhos
router.get("/", (req, res) => {
  const sql = `
    SELECT f.id_filho, uf.no_usuario AS filho, pai.no_usuario AS pai, mae.no_usuario AS mae
    FROM tbl_filhos f
    JOIN tbl_usuarios uf ON f.id_usuario_filho = uf.id_usuario
    LEFT JOIN tbl_usuarios pai ON f.id_pai = pai.id_usuario
    LEFT JOIN tbl_usuarios mae ON f.id_mae = mae.id_usuario
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render("filhos", { filhos: results });
  });
});

// Form de cadastro
router.get("/cadastro", (req, res) => {
  db.query("SELECT * FROM tbl_usuarios", (err, usuarios) => {
    if (err) throw err;
    res.render("cadastroFilho", { usuarios });
  });
});

// Salvar
router.post("/cadastro", (req, res) => {
  const { id_usuario_filho, id_pai, id_mae } = req.body;
  const sql = "INSERT INTO tbl_filhos (id_usuario_filho, id_pai, id_mae) VALUES (?, ?, ?)";
  db.query(sql, [id_usuario_filho, id_pai, id_mae], (err) => {
    if (err) throw err;
    res.redirect("/filhos");
  });
});

// Deletar
router.get("/delete/:id", (req, res) => {
  const sql = "DELETE FROM tbl_filhos WHERE id_filho = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) throw err;
    res.redirect("/filhos");
  });
});

// Editar
router.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM tbl_filhos WHERE id_filho = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    db.query("SELECT * FROM tbl_usuarios", (err2, usuarios) => {
      if (err2) throw err2;
      res.render("editarFilho", { filho: result[0], usuarios });
    });
  });
});

// Atualizar
router.post("/edit/:id", (req, res) => {
  const { id_usuario_filho, id_pai, id_mae } = req.body;
  const sql = "UPDATE tbl_filhos SET id_usuario_filho=?, id_pai=?, id_mae=? WHERE id_filho=?";
  db.query(sql, [id_usuario_filho, id_pai, id_mae, req.params.id], (err) => {
    if (err) throw err;
    res.redirect("/filhos");
  });
});

module.exports = router;