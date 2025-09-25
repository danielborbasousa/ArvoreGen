const express = require("express");
const cors = require("cors");
const db = require("./config/db");

// importa as rotas
const usuariosRoutes = require("./routes/usuarios");
const conjuguesRoutes = require("./routes/conjugues");
const filhosRoutes = require("./routes/filhos");

const app = express();
app.use(cors());
app.use(express.json());

// rotas
app.use("/usuarios", usuariosRoutes);
app.use("/conjugues", conjuguesRoutes);  // <- nome igual ao da pasta
app.use("/filhos", filhosRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  db.connect(err => {
    if (err) {
      console.error("Erro ao conectar no MySQL:", err);
      return;
    }
    console.log("Conectado ao MySQL!");
  });
});
