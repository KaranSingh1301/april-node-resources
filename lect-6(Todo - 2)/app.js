const express = require("express");
const clc = require("cli-color");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

//file-imports
const { cleanupAndValidate } = require("./utils/authUtils");
const userModel = require("./Models/userModel");
const { isAuth } = require("./middlewares/isAuthmiddleware");

//variables
const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.3ije6wh.mongodb.net/aprilTodoApp`;
const saltRound = 9;
const store = new mongoDbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

//middlwares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "This is our april nodejs class",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

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
  const { name, email, password, username } = req.body;
  //Data validation
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

    return res.redirect("/login");
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

app.post("/login", async (req, res) => {
  //console.log(req.body);
  const { loginId, password } = req.body;
  //Data validation

  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "Missing credentials",
    });
  }

  if (typeof loginId !== "string" || typeof password !== "string") {
    return res.send({
      status: 400,
      message: "Invalid Data Format",
    });
  }

  //find the user obj from loginId
  let userDb;
  if (validator.isEmail(loginId)) {
    userDb = await userModel.findOne({ email: loginId });
  } else {
    userDb = await userModel.findOne({ username: loginId });
  }
  // console.log(userDb);
  if (!userDb) {
    return res.send({
      status: 400,
      message: "User does not exist, Please register first",
    });
  }

  //compare the password

  const isMatch = await bcrypt.compare(password, userDb.password);
  console.log(isMatch);
  if (!isMatch) {
    return res.send({
      status: 400,
      message: "Password incorrect",
    });
  }
  //successfull login

  console.log(req.session);
  req.session.isAuth = true;
  req.session.user = {
    username: userDb.name,
    email: userDb.email,
    userId: userDb._id,
  };

  return res.redirect("/dashboard");
});

app.get("/dashboard", isAuth, (req, res) => {
  return res.render("dashboard");
});

app.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) throw error;
    return res.redirect("/login");
  });
});

app.post("/logout_from_all_devices", async (req, res) => {
  console.log(req.session.user.userId);
  const username = req.session.user.username;
  //create session schema
  const Schema = mongoose.Schema;
  const sessionSchema = new Schema({ _id: String }, { strict: false });
  const sessionModel = mongoose.model("session", sessionSchema);

  try {
    const deleteDb = await sessionModel.deleteMany({
      "session.user.username": username,
    });
    console.log(deleteDb);
    return res.redirect("/login");
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }

  return res.send(true);
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
