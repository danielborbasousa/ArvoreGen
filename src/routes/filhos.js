const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET todos os filhos
router.get("/", (req, res) => {
  const sql = `
    SELECT f.id_filho, 
           u.no_usuario AS nome_filho, 
           pai.no_usuario AS nome_pai, 
           mae.no_usuario AS nome_mae
    FROM tbl_filhos f
    JOIN tbl_usuarios u ON f.id_usuario_filho = u.id_usuario
    JOIN tbl_usuarios pai ON f.id_pai = pai.id_usuario
    JOIN tbl_usuarios mae ON f.id_mae = mae.id_usuario
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar filhos:", err);
      res.status(500).json({ error: "Erro ao buscar filhos" });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
