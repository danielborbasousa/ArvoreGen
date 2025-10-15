const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET todos os cônjuges
router.get("/", (req, res) => {
  const sql = `
    SELECT c.id_conjuge, 
           u1.no_usuario AS nome_a, 
           u2.no_usuario AS nome_b, 
           c.dt_casamento, 
           c.ds_local
    FROM tbl_conjuges c
    JOIN tbl_usuarios u1 ON c.usuario_a = u1.id_usuario
    JOIN tbl_usuarios u2 ON c.usuario_b = u2.id_usuario
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar cônjuges:", err);
      res.status(500).json({ error: "Erro ao buscar cônjuges" });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
