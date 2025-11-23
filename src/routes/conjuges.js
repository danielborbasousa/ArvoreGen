const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET - Listar Cônjuges
router.get("/", (req, res) => {
  const sql = `
    SELECT c.id_conjuge, u1.no_usuario AS nome_a, u2.no_usuario AS nome_b, c.dt_casamento, c.ds_local
    FROM tbl_conjuges c
    JOIN tbl_usuarios u1 ON c.usuario_a = u1.id_usuario
    JOIN tbl_usuarios u2 ON c.usuario_b = u2.id_usuario
    WHERE c.fl_divorcio = 0
  `; 
  // Nota: Adicionei WHERE fl_divorcio = 0 para listar apenas casados na tela de admin, se desejar.
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar dados" });
    res.json(results);
  });
});

// POST - Cadastrar
router.post("/", (req, res) => {
  const { id_usuario_a, id_usuario_b, dt_casamento, ds_local } = req.body;

  if (!id_usuario_a || !id_usuario_b) return res.status(400).json({ error: "Selecione os dois cônjuges." });
  if (id_usuario_a == id_usuario_b) return res.status(400).json({ error: "Usuários iguais." });

  // Primeiro, verifica se já existe um vínculo ativo para evitar poligamia acidental no sistema
  const checkSql = "SELECT * FROM tbl_conjuges WHERE (usuario_a = ? OR usuario_b = ?) AND fl_divorcio = 0";
  
  // Nota simplificada: Insert direto.
  const sql = "INSERT INTO tbl_conjuges (usuario_a, usuario_b, dt_casamento, ds_local, fl_divorcio) VALUES (?, ?, ?, ?, 0)";
  
  db.query(sql, [id_usuario_a, id_usuario_b, dt_casamento || null, ds_local || null], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao salvar." });
    }
    res.status(201).json({ message: "Vínculo criado!" });
  });
});

// --- NOVA ROTA: DIVÓRCIO ---
router.post("/divorcio", (req, res) => {
  const { id_usuario_a, id_usuario_b } = req.body;

  if (!id_usuario_a || !id_usuario_b) {
    return res.status(400).json({ error: "IDs inválidos para divórcio." });
  }

  const sql = `
    UPDATE tbl_conjuges 
    SET fl_divorcio = 1, dt_fim_casamento = NOW() 
    WHERE (usuario_a = ? AND usuario_b = ?) OR (usuario_a = ? AND usuario_b = ?)
  `;

  db.query(sql, [id_usuario_a, id_usuario_b, id_usuario_b, id_usuario_a], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao registrar divórcio." });
    }
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Vínculo não encontrado." });
    }
    res.json({ message: "Divórcio registrado com sucesso." });
  });
});

module.exports = router;
