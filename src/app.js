const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const usuarioRoutes = require("./routes/usuarios");
const conjugeRoutes = require("./routes/conjuges");
const filhoRoutes = require("./routes/filhos");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rotas
app.use("/usuarios", usuarioRoutes);
app.use("/conjuges", conjugeRoutes);
app.use("/filhos", filhoRoutes);

// Rota inicial -> Dashboard
app.get("/", (req, res) => {
  res.render("dashboard");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});