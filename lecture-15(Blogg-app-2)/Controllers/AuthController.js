const express = require("express");
const { cleanUpAndValidate } = require("../utils/AuthUtils");
const userSchema = require("../Schemas/userSchema");
const User = require("../Models/userModels");
const { isAuth } = require("../Middlewares/isAuthMiddleware");
const AuthRouter = express.Router();

// auth/register
AuthRouter.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, username, password } = req.body;
  await cleanUpAndValidate({ name, email, password, username })
    .then(async () => {
      //verify username and email exist
      try {
        await User.verifyUsernameAndEmailExits({ email, username });
      } catch (error) {
        console.log(error);
        return res.send({
          status: 400,
          message: "Error Occurred",
          error: error,
        });
      }

      //save in Db
      const userObj = new User({ name, username, email, password });
      try {
        const userDb = await userObj.registerUser();
        console.log(userDb);
        return res.send({
          status: 201,
          message: "User registered successfully",
          data: userDb,
        });
      } catch (error) {
        console.log(error);
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
AuthRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "Credentials missing",
    });
  }

  try {
    const userDb = await User.loginUser({ loginId, password });

    //session base auth
    console.log(req.session);
    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      username: userDb.username,
      email: userDb.email,
    };

    return res.send({
      status: 200,
      message: "Login Successfull",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Login Failed",
      error: error,
    });
  }

  return res.send(true);
});

AuthRouter.post("/logout", isAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({
        status: 400,
        message: "Logout failed",
      });
    }

    return res.send({
      status: 200,
      message: "Logout Successfull",
    });
  });
});

module.exports = AuthRouter;
