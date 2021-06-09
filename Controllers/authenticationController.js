const User = require("../Models/User");
const express = require("express");
var nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const app = express();

//register_user:method
const create_user = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      address,
      state,
      type,
      email,
      password,
    } = req.body;
    var findUser = await User.findOne({ email });
    if (findUser) {
      throw Error("Utilisateur avec cet email existe deja ");
    }
    var user = await User.create({
      firstName,
      lastName,
      phone,
      address,
      state,
      type,
      email,
      password,
      status: "Confirmed",
    });
    const id = user.id;
    const token = jwt.sign({ id }, "jwtSecret");
    return res.status(201).send({ auth: true, token, result: user });
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};

//login_user :method
const login_user = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const id = user.id;
    const token = jwt.sign({ id }, "jwtSecret");
    return res.status(200).send({ auth: true, token, result: user });
  } catch (err) {
    if (err.message == "email") {
      return res.status(404).send({ auth: false, message: err.message });
    } else {
      return res.status(405).send({ auth: false, message: err.message });
    }
  }
};
const check_email_in_use = async (req, res) => {
  try {
    var result = false;
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      result = true;
    }
    return res.status(200).send(result);
  } catch (err) {
    return res.status(404).send(err);
  }
};

// verify email address
const verify_email_address = async (req, res) => {
  const { email, code } = req.body;
  try {
    sendingVerificationEmail(email, code);
    return res.status(200).send("successfully recived");
  } catch (err) {
    return res.status(404).json("error sending ");
  }
};

function sendingVerificationEmail(email, code) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "alaazarrouk7@gmail.com",
      pass: "aloulou556",
    },
  });
  var mailOptions = {
    from: "alaazarrouk7@gmail.com",
    to: email,
    subject: "Email Veification ",
    text:
      "This is a code to verify your Account type it in the verification zone : " +
      code,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw Error(error);
    }
    console.log("Email sent: " + info.response);
  });
}

module.exports = {
  login_user,
  create_user,
  verify_email_address,
  check_email_in_use,
};
