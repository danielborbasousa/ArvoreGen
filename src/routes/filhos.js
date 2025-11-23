const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET - Listar Filhos
router.get("/", (req, res) => {
  const sql = `
    SELECT f.id_filho, 
           u.no_usuario AS nome_filho,
           u.dt_nascimento,
           pai.no_usuario AS nome_pai, 
           mae.no_usuario AS nome_mae
    FROM tbl_filhos f
    JOIN tbl_usuarios u ON f.id_usuario_filho = u.id_usuario
    LEFT JOIN tbl_usuarios pai ON f.id_pai = pai.id_usuario
    LEFT JOIN tbl_usuarios mae ON f.id_mae = mae.id_usuario
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar:", err);
      return res.status(500).json({ error: "Erro ao buscar dados" });
    }
    res.json(results);
  });
});

// POST - Cadastrar
router.post("/", (req, res) => {
  const { id_filho, id_pai, id_mae } = req.body;

  if (!id_filho) return res.status(400).json({ error: "Selecione o filho." });
  if (!id_pai && !id_mae) return res.status(400).json({ error: "Selecione pelo menos um pai/mãe." });

  const sql = "INSERT INTO tbl_filhos (id_usuario_filho, id_pai, id_mae) VALUES (?, ?, ?)";
  
  db.query(sql, [id_filho, id_pai || null, id_mae || null], (err, result) => {
    if (err) {
      console.error("Erro SQL:", err);
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Filiação já cadastrada." });
      return res.status(500).json({ error: "Erro ao salvar no banco." });
    }
    res.status(201).json({ message: "Vínculo criado com sucesso!" });
  });
});

// GET - Listar
router.get("/", (req, res) => {
  const sql = `
    SELECT f.id_filho, u.no_usuario AS nome_filho, u.dt_nascimento, pai.no_usuario AS nome_pai, mae.no_usuario AS nome_mae
    FROM tbl_filhos f
    JOIN tbl_usuarios u ON f.id_usuario_filho = u.id_usuario
    LEFT JOIN tbl_usuarios pai ON f.id_pai = pai.id_usuario
    LEFT JOIN tbl_usuarios mae ON f.id_mae = mae.id_usuario
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar dados" });
    res.json(results);
  });
});

module.exports = router;