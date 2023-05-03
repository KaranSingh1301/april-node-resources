const userSchema = require("../Schemas/userSchema");
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;

let User = class {
  username;
  name;
  email;
  password;

  constructor({ email, password, name, username }) {
    this.email = email;
    this.name = name;
    this.username = username;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT)
      );

      const user = new userSchema({
        name: this.name,
        email: this.email,
        username: this.username,
        password: hashedPassword,
      });

      try {
        const userDb = await user.save();
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyUsernameAndEmailExits({ email, username }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await userSchema.findOne({
          $or: [{ email }, { username }],
        });

        if (userDb && userDb.email === email) {
          reject("Email already exist");
        }

        if (userDb && userDb.username === username) {
          reject("Username already exist");
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  static loginUser({ loginId, password }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await userSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });

        if (!userDb) {
          reject("Please register before login");
        }

        //match the password
        const isMatch = await bcrypt.compare(password, userDb.password);
        if (!isMatch) {
          reject("Password Does not matched");
        }
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyUserId({ userId }) {
    return new Promise(async (resolve, reject) => {
      if (!ObjectId.isValid(userId)) {
        reject("Invalid userId format");
      }

      try {
        const userDb = await userSchema.findOne({ _id: userId });
        if (!userDb) {
          reject("User not found");
        }
        console.log(userDb);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;
