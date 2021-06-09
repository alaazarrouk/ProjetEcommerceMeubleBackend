const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  state: {
    type: String,
  },
  type: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  status: {
    type: String,
  },
});

//mongoose hook that fire before saving in the database
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
//mongoose hook that fires before updating in database
userSchema.pre("updateOne", async function (next) {
  var updatedPassword = this.getUpdate().$set.password;
  if (updatedPassword) {
    const salt = await bcrypt.genSalt();
    this.getUpdate().$set.password = await bcrypt.hash(updatedPassword, salt);
  }
  next();
});

//static method login : identification user//
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  console.log("user:", user);
  if (user !== null) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user;
    }
    throw Error("password");
  }
  throw Error("email");
};

userSchema.statics.check_current_Password = async function (newUser, oldUser) {
  const auth = await bcrypt.compare(newUser.password, oldUser.password);
  if (auth) {
    return newUser;
  }
  throw Error("not the current password");
};

const User = mongoose.model("user", userSchema);
module.exports = User;
