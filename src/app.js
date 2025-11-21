const express = require("express");
const cors = require("cors");

// importa as rotas
const usuariosRoutes = require("./routes/usuarios");
const conjugesRoutes = require("./routes/conjuges");
const filhosRoutes = require("./routes/filhos");
const arvoreRoutes = require("./routes/arvore");

const app = express();
app.use(cors());
app.use(express.json());

// rotas
app.use("/usuarios", usuariosRoutes);
app.use("/conjuges", conjugesRoutes);
app.use("/filhos", filhosRoutes);
app.use("/arvore", arvoreRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
