const express = require("express");
const clc = require("cli-color");
require("dotenv").config();

//file-imports
const db = require("./db");
const AuthRouter = require("./Controllers/AuthController");

//variables
const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());

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
