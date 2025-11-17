const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET - Listar Cônjuges
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
      console.error("Erro ao buscar:", err);
      return res.status(500).json({ error: "Erro ao buscar dados" });
    }
    res.json(results);
  });
});

// POST - Cadastrar (CORRIGIDO PARA RECEBER IDs)
router.post("/", (req, res) => {
  // Agora pegamos os IDs, não os nomes
  const { id_usuario_a, id_usuario_b, dt_casamento, ds_local } = req.body;

  // Validação dos IDs
  if (!id_usuario_a || !id_usuario_b) {
    return res.status(400).json({ error: "Selecione os dois cônjuges na lista." });
  }

  if (id_usuario_a == id_usuario_b) {
    return res.status(400).json({ error: "Não é possível vincular a mesma pessoa." });
  }

  const sql = "INSERT INTO tbl_conjuges (usuario_a, usuario_b, dt_casamento, ds_local) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [id_usuario_a, id_usuario_b, dt_casamento || null, ds_local || null], (err, result) => {
    if (err) {
      console.error("Erro ao salvar:", err);
      return res.status(500).json({ error: "Erro ao salvar no banco." });
    }
    res.status(201).json({ message: "Vínculo de cônjuges criado com sucesso!" });
  });
});

module.exports = router;
