const express = require("express");
const clc = require("cli-color");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//file-imports
const { cleanupAndValidate } = require("./utils/authUtils");
const userModel = require("./Models/userModel");

//variables
const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.3ije6wh.mongodb.net/aprilTodoApp`;
const saltRound = 9;

//middlwares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(clc.blueBright.bold.underline("MongoDb Connected"));
  })
  .catch((error) => {
    console.log(clc.red(error));
  });

//routes
app.get("/", (req, res) => {
  return res.send("Welcome to TODO-APP server");
});

app.get("/register", (req, res) => {
  return res.render("register");
});

app.post("/register", async (req, res) => {
  //Data validation
  //   console.log(req.body);
  const { name, email, password, username } = req.body;

  try {
    await cleanupAndValidate({ email, name, password, username });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data Error",
      error: error,
    });
  }

  //check is the email exits or not in Db;
  const userObjEmailExits = await userModel.findOne({ email });
  console.log(userObjEmailExits);

  if (userObjEmailExits) {
    return res.send({
      status: 400,
      message: "Email Already Exits",
    });
  }

  //check is the username exits or not in Db;
  const userObjUsernameExits = await userModel.findOne({ username });
  console.log(userObjUsernameExits);

  if (userObjUsernameExits) {
    return res.send({
      status: 400,
      message: "Username Already Exits",
    });
  }

  //password hashing
  const hashedPassword = await bcrypt.hash(password, saltRound);

  //Create userObj
  const userObj = new userModel({
    //key:value
    name: name,
    email: email,
    password: hashedPassword,
    username: username,
  });
  //Save in Db
  try {
    const userDb = await userObj.save();
    // console.log(userDb);

    return res.send({
      status: 201,
      message: "User created successfully",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database Error",
      error: error,
    });
  }
});

app.get("/login", (req, res) => {
  return res.render("login");
});

app.listen(PORT, () => {
  console.log(clc.yellow(`Server is running: http://localhost:${PORT}/`));
});

//Register Page
//Registration Api

//Login Page
//Login Api

//Session Base Authentication

//Dashboard Page
//Logout
//Logout from all devices

//Todo Api
//Create
//Edit
//Delete
//Read

//Dashbaord
//Axios - GET and POST
//Read component

//Pagination of API's
//Ratelimiting

//MVC (Models, Views, Controller)
//jsx
//EJS
