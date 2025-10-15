const express = require("express");
const cors = require("cors");
const db = require("./config/db");

// importa as rotas
const usuariosRoutes = require("./routes/usuarios");
const conjugesRoutes = require("./routes/conjuges");
const filhosRoutes = require("./routes/filhos");

const app = express();
app.use(cors());
app.use(express.json());

// rotas
app.use("/usuarios", usuariosRoutes);
app.use("/conjuges", conjugesRoutes);
app.use("/filhos", filhosRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
