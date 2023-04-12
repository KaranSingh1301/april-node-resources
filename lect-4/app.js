//ES5
const express = require("express");
const mongoose = require("mongoose");
const userSchema = require("./userSchema");

const app = express();

//mongodb connection
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.3ije6wh.mongodb.net/aprilTestDb`;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fun = (req, res, next) => {
  console.log("In Middleware");
  next();
};
// app.use(fun);

//route
app.get("/", (req, res) => {
  console.log(" `/` , GET");

  return res.send("This is your Nodejs Server");
});

app.get("/home", fun, (req, res) => {
  console.log(" `/home` , GET");

  return res.send("This is your Home Route");
});

app.post("/home", (req, res) => {
  return res.send(" /home, POST");
});

//query
// /api?key=100
// /api?key1=100&key2=200
// /api?key=100,200
app.get("/api", (req, res) => {
  console.log(req.query);
  return res.send("success: /api, GET");
});

//params
// /api/backend/node
// /api/backend/express
// /api/backend/mongodb
// /api/backend/rest

app.get("/api/backend/:id", (req, res) => {
  console.log("hey", req.params);
  const value = req.params.id;
  return res.send(`/api/backend/${value}, GET`);
});

app.get("/api/backend/name/:id", (req, res) => {
  const value = req.params.id;
  return res.send(`/api/backend/name/${value}, GET`);
});

app.get("/api1/:id/name", (req, res) => {
  return res.send(`/api1/${req.params.id}/name`);
});

app.get("/api/html", (req, res) => {
  return res.send(`
    <html>
    <body>
    <h1>This is your Form</h1>

    <form action="/form_submit" method="POST">
    <label for='name'>Name</label>
    <input type='text'name='name'></input>

    <label for='email'>Email</label>
    <input type='text'name='email'></input>

    <label for='username'>Username</label>
    <input type='text'name='username'></input>

    <label for='password'>Password</label>
    <input type='text'name='password'></input>

    <button type='submit'>Submit</button>
    </form>

    </body>
    <html>
    `);
});

app.post("/form_submit", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  const userObj = new userSchema({
    //schema : body
    name1: name,
    email1: email,
    password1: password,
  });

  console.log(userObj);
  try {
    const userDb = await userObj.save();
    return res.send("Form submitted successfully");
  } catch (error) {
    console.log(error);
    return res.send("Database error");
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
