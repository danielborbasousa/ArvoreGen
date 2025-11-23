const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const query = (sql, params) => {
      return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
    };

    // 1. Buscar dados
    const usuarios = await query("SELECT * FROM tbl_usuarios", []);
    const conjuges = await query("SELECT usuario_a, usuario_b, fl_divorcio FROM tbl_conjuges", []);
    const filhos = await query("SELECT * FROM tbl_filhos", []);

    // 2. Mapeamento
    const mapUsuarios = usuarios.map(u => ({
      id: u.id_usuario,
      name: u.no_usuario,
      email: u.ds_email,
      whatsapp: u.nu_whatsapp,
      imageUrl: u.lk_foto, 
      birthDate: u.dt_nascimento ? new Date(u.dt_nascimento).toLocaleDateString('pt-BR') : "—",
      city: "Local não cadastrado",
      parentId: null,
      spouseId: null,
      // Novo campo: armazena todos os IDs dos ex-parceiros (para o modal)
      exSpouses: [], 
      // Novo campo: armazena dados de casamento do relacionamento ATIVO
      activeMarriage: null
    }));

    const userMap = {};
    mapUsuarios.forEach(u => userMap[u.id] = u);

    // 3. Conecta Cônjuges (Priorizando o Vínculo ATIVO)
    conjuges.forEach(c => {
      const uA = userMap[c.usuario_a];
      const uB = userMap[c.usuario_b];
      const isDivorced = c.fl_divorcio === 1;

      if (uA && uB) {
        if (!isDivorced) {
          // Se não está divorciado, este é o vínculo ATIVO que a árvore deve desenhar.
          uA.spouseId = uB.id;
          uB.spouseId = uA.id;
        } else {
          // Se está divorciado, o vínculo é EX-CÔNJUGE (guardamos para o modal de filhos)
          uA.exSpouses.push(uB.id);
          uB.exSpouses.push(uA.id);
        }
      }
    });

    // 4. Conecta Filhos (a lógica de parentesco se mantém)
    filhos.forEach(f => {
      const filho = userMap[f.id_usuario_filho];
      if (filho) {
        if (f.id_pai && userMap[f.id_pai]) {
          filho.parentId = f.id_pai;
        } else if (f.id_mae && userMap[f.id_mae]) {
          filho.parentId = f.id_mae;
        }
        // Novo campo no filho para guardar os pais biológicos
        filho.bioParents = {
            fatherId: f.id_pai,
            motherId: f.id_mae,
        };
      }
    });

    res.json(mapUsuarios);

  } catch (error) {
    console.error("Erro ao montar árvore:", error);
    res.status(500).json({ error: "Erro ao buscar dados da árvore" });
  }
});

module.exports = router;