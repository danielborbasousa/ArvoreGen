const express = require("express");
const cors = require("cors");
// db já é usado internamente nas rotas

// importa as rotas
const usuariosRoutes = require("./routes/usuarios");
const conjugesRoutes = require("./routes/conjuges");
const filhosRoutes = require("./routes/filhos");
const arvoreRoutes = require("./routes/arvore"); // <--- IMPORTAR NOVA ROTA

const app = express();
app.use(cors());
app.use(express.json());

// rotas
app.use("/usuarios", usuariosRoutes);
app.use("/conjuges", conjugesRoutes);
app.use("/filhos", filhosRoutes);
app.use("/arvore", arvoreRoutes); // <--- REGISTRAR NOVA ROTA

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
