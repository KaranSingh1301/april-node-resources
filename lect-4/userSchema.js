const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name1: {
    type: String,
    require: true,
  },
  email1: {
    type: String,
    require: true,
    unique: true,
  },
  password1: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("user", userSchema);
