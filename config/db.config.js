"use strict";

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "65.21.153.116",
  user: "root",
  password: "JYq1Nyr2l7Cf",
  database: "conscience",
  // host: '135.181.104.107',
  // user: 'root',
  // password: 'JYq1Nyr2l7Cf',
  // database: 'freedom-buzz'
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Database connected");
});

function keepAlive() {
  db.query("SELECT 1", (err) => {
    if (err) throw err;
  });
}
setInterval(keepAlive, 30000);

module.exports = db;
