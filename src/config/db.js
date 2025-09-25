const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sistema_familia" // <-- altere aqui
});

connection.connect((err) => {
  if (err) {
    console.error("Erro na conexão com MySQL:", err);
    return;
  }
  console.log("Conectado ao MySQL!");
});

module.exports = connection;
