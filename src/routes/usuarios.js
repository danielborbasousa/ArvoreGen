const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET todos os usuários
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
