const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Komal@2786",
  database: "internship_db"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL Connected ✅");
});

module.exports = db;