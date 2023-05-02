const express = require("express");
const { cleanUpAndValidate } = require("../utils/AuthUtils");
const userSchema = require("../Schemas/userSchema");
const AuthRouter = express.Router();

// /auth/register
AuthRouter.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, username, password } = req.body;
  await cleanUpAndValidate({ name, email, password, username })
    .then(async () => {
      //Db save
      const userObj = new userSchema({
        name: name,
        email: email,
        username: username,
        password: password,
      });

      try {
        const userDb = await userObj.save();
        console.log(userDb);
        return res.send({
          status: 201,
          message: "User registered successfully",
          data: userDb,
        });
      } catch (error) {
        return res.send({
          status: 500,
          message: "Database error",
          error: error,
        });
      }
    })
    .catch((error) => {
      return res.send({
        status: 400,
        message: "Data Error",
        error: error,
      });
    });
});

// /auth/login
AuthRouter.post("/login", (req, res) => {
  console.log("all good");
  return res.send(true);
});

module.exports = AuthRouter;
