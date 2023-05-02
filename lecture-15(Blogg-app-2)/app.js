const express = require("express");
const clc = require("cli-color");
require("dotenv").config();
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

//file-imports
const db = require("./db");
const AuthRouter = require("./Controllers/AuthController");

//variables
const app = express();
const PORT = process.env.PORT;
const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//middlewares
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.get("/", (req, res) => {
  return res.send({
    status: 200,
    message: "Server is running",
  });
});

//routes
app.use("/auth", AuthRouter);

app.listen(PORT, () => {
  console.log(clc.yellow.underline(`Server is running on PORT:${PORT}`));
});
