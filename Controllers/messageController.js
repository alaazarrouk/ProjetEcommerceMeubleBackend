const Message = require("../Models/Message");
var nodemailer = require("nodemailer");

const create_message = async (req, res) => {
  const { message, email, date, status } = req.body;
  console.log("date", date);
  try {
    console.log("Im here");
    const messageCreated = await Message.create({
      message,
      email,
      date,
      status,
    });
    return res.status(201).send(messageCreated);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const get_messages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    return res.status(200).send(messages);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const get_messages_stats = async (req, res) => {
  try {
    const countMessages = await Message.find().countDocuments();
    const countRespondedMessages = await Message.find({
      status: "Répondu",
    }).countDocuments();
    const countWaitingMessages = await Message.find({
      status: "En attente",
    }).countDocuments();
    const countCancledMessages = await Message.find({
      status: "Ignoré",
    }).countDocuments();
    return res.status(200).send({
      countMessages,
      countRespondedMessages,
      countWaitingMessages,
      countCancledMessages,
    });
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const get_user_messages = async (req, res) => {
  try {
    const messages = await Message.find({ email: req.params.email }).sort({
      date: -1,
    });
    return res.status(200).send(messages);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const get_messages_by_date = async (req, res) => {
  try {
    var date = changeDateFormat(req.params.date.toString());
    const messages = await Message.find({ date: date });
    return res.status(200).send(messages);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const get_messages_by_status = async (req, res) => {
  try {
    const message = await Message.find({ status: req.params.status }).sort({
      date: -1,
    });
    return res.status(200).send(message);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const confirm_message = async (req, res) => {
  try {
    const message = await Message.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "Répondu",
        },
      }
    );

    return res.status(200).send({ message });
  } catch (err) {
    return res.status(404).json(err.message);
  }
};
const cancel_message = async (req, res) => {
  try {
    const message = await Message.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "Ignoré",
        },
      }
    );

    return res.status(200).send({ message });
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const send_mail = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("message", message);

    sendingResposeMail(req.params.email, message);
    const updatedMessage = await Message.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "Répondu",
        },
      }
    );

    return res.status(200).send({ updatedMessage });
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

function sendingResposeMail(email, message) {
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
    subject: "Reponse a votre message ",
    text: `${message} `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw Error(error);
    }
    console.log("Email sent: " + info.response);
  });
}

function changeDateFormat(date) {
  var newDate = "";
  for (var i = 0; i < date.length; i++) {
    if (date[i] == "-") {
      newDate = newDate + "/";
    } else {
      newDate = newDate + date[i];
    }
  }
  return newDate;
}

module.exports = {
  create_message,
  get_messages,
  get_messages_stats,
  get_user_messages,
  get_messages_by_date,
  get_messages_by_status,
  confirm_message,
  cancel_message,
  send_mail,
};
