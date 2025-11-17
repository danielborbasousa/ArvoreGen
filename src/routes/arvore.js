const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const query = (sql) => {
      return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
    };

    // Busca dados
    const usuarios = await query("SELECT * FROM tbl_usuarios");
    const conjuges = await query("SELECT * FROM tbl_conjuges");
    const filhos = await query("SELECT * FROM tbl_filhos");

    // Mapeia usuários
    const mapUsuarios = usuarios.map(u => ({
      id: u.id_usuario,
      name: u.no_usuario,
      email: u.ds_email,
      imageUrl: u.lk_foto, 
      // Dados extras opcionais
      birthDate: u.dt_nascimento ? new Date(u.dt_nascimento).toLocaleDateString('pt-BR') : "—",
      city: "Local não cadastrado",
      parentId: null,
      spouseId: null
    }));

    const userMap = {};
    mapUsuarios.forEach(u => userMap[u.id] = u);

    // Conecta Cônjuges
    conjuges.forEach(c => {
      const uA = userMap[c.usuario_a];
      const uB = userMap[c.usuario_b];
      if (uA && uB) {
        uA.spouseId = uB.id;
        uB.spouseId = uA.id;
      }
    });

    // Conecta Filhos (Lógica Melhorada)
    filhos.forEach(f => {
      const filho = userMap[f.id_usuario_filho];
      if (filho) {
        // Tenta conectar pelo pai, se não der, conecta pela mãe
        if (f.id_pai && userMap[f.id_pai]) {
          filho.parentId = f.id_pai;
        } else if (f.id_mae && userMap[f.id_mae]) {
          filho.parentId = f.id_mae;
        }
      }
    });

    res.json(mapUsuarios);

  } catch (error) {
    console.error("Erro ao montar árvore:", error);
    res.status(500).json({ error: "Erro ao buscar dados da árvore" });
  }
});

module.exports = router;