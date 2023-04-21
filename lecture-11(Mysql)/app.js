const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(express.json());

//db connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Karan@130101",
  database: "tododb",
  multipleStatements: true,
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Mysql Db is connected");
});

app.get("/", (req, res) => {
  return res.send("This is app");
});

app.get("/todo", (req, res) => {
  db.query("SELECT * FROM users", {}, (err, users) => {
    console.log(users);
    if (users) {
      return res.send({
        status: 200,
        message: "Read success",
        data: users,
      });
    } else {
      return res.send({
        status: 400,
        message: "Mysql error",
        error: err,
      });
    }
  });
});

app.post("/user-create", (req, res) => {
  console.log(req.body);
  const { todoId, userName, email, password } = req.body;
  db.query(
    "INSERT INTO users (todoId, userName, email, password) VALUES (?,?,?,?)",
    [todoId, userName, email, password],
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(400).send(false);
      } else {
        return res.status(200).send(true);
      }
    }
  );
});

app.listen(8000, () => {
  console.log("server is running or port 8000");
});
