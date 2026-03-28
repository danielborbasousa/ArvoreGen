const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", //Veja se seu banco está com ou sem senha
  database: "sistema_familia"
});

connection.connect((err) => {
  if (err) {
    console.error("Erro na conexão com MySQL:", err);
    return;
  }
  console.log("Conectado ao MySQL!");
});

module.exports = connection;
