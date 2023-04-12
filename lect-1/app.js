//ES6 import express from 'express'
//ES5
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  return res.send("This is your server");
});

app.listen(8001, () => {
  console.log("Server is running or port 8000");
});
