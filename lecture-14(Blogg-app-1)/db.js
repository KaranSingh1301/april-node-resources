const mongoose = require("mongoose");
const clc = require("cli-color");

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    console.log(clc.yellow("mongoDB Connected"));
  })
  .catch((err) => {
    console.log(clc.red(err));
  });
