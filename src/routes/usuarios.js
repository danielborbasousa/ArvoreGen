const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- CONFIGURAÇÃO DO MULTER (UPLOAD) ---
// Garante que a pasta de uploads existe
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Pasta onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    // Gera um nome único: timestamp + extensão original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- ROTAS ---

// ✅ ROTA DE CADASTRO (Com Upload)
// 'foto' é o nome do campo que enviaremos do frontend
router.post("/", upload.single('foto'), (req, res) => {
  // Os campos de texto vêm em req.body
  const { no_usuario, pw_senha, ds_email, nu_whatsapp, dt_nascimento } = req.body;
  
  // O arquivo vem em req.file
  // Se houver arquivo, salvamos o caminho relativo. Se não, null.
  const lk_foto = req.file ? `/uploads/${req.file.filename}` : null;

  if (!no_usuario || !pw_senha || !ds_email) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes (Nome, Senha, Email)." });
  }

  const sql = `
    INSERT INTO tbl_usuarios 
    (no_usuario, pw_senha, ds_email, nu_whatsapp, dt_nascimento, lk_foto, nu_vertical, nu_horizontal)
    VALUES (?, ?, ?, ?, ?, ?, 0, 0)
  `;

  db.query(
    sql, 
    [no_usuario, pw_senha, ds_email, nu_whatsapp || null, dt_nascimento || null, lk_foto], 
    (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar usuário:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "Este e-mail já está cadastrado." });
        }
        return res.status(500).json({ error: "Erro ao cadastrar usuário no banco." });
      }
      res.status(201).json({
        message: "Usuário cadastrado com sucesso!",
        id_usuario: result.insertId,
        foto: lk_foto
      });
    }
  );
});

// ✅ ROTA DE LOGIN (Mantida)
router.post("/login", (req, res) => {
  const { ds_email, pw_senha } = req.body;

  if (!ds_email || !pw_senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
  }

  const sql = "SELECT id_usuario, no_usuario, ds_email, lk_foto, role FROM tbl_usuarios WHERE ds_email = ? AND pw_senha = ?";
  
  db.query(sql, [ds_email, pw_senha], (err, results) => {
    if (err) return res.status(500).json({ message: "Erro no servidor." });
    if (results.length === 0) return res.status(401).json({ message: "E-mail ou senha incorretos." });

    const usuario = results[0];
    if (!usuario.role) usuario.role = 'user';

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario,
    });
  });
});

// ✅ ROTA DE LISTAGEM
router.get("/", (req, res) => {
  db.query("SELECT id_usuario, no_usuario, ds_email FROM tbl_usuarios", (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar dados." });
    res.json(results);
  });
});

module.exports = router;
