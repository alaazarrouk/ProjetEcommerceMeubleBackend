const { update } = require("../Models/User");
const User = require("../Models/User");
const Order = require("../Models/Order");

//register_user:method
const get_users = async (req, res) => {
  try {
    const ArrayUsers = [];
    const users = await User.find({ type: "User" });
    for (var i = 0; i < users.length; i++) {
      var countUserOrders = await Order.find({
        "user._id": users[i]._id.toString(),
      }).countDocuments();
      ArrayUsers.push({
        _id: users[i]._id,
        firstName: users[i].firstName,
        lastName: users[i].lastName,
        phone: users[i].phone,
        email: users[i].email,
        address: users[i].address,
        state: users[i].state,
        nb_orders: countUserOrders,
      });
    }
    ArrayUsers.sort(compare);

    return res.status(200).send(ArrayUsers);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};
const get_user_by_id = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};
const get_user_by_email = async (req, res) => {
  try {
    const ArrayUsers = [];
    var user = await User.findOne({ email: req.params.email });
    if (user) {
      var countUserOrders = await Order.find({
        "user._id": user._id.toString(),
      }).countDocuments();
      ArrayUsers.push({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        address: user.address,
        state: user.state,
        nb_orders: countUserOrders,
      });
      return res.status(200).send(ArrayUsers);
    }

    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
};

const get_count_Users = async (req, res) => {
  try {
    const countUsers = await User.find({
      type: "User",
    }).countDocuments();
    return res.status(200).send({ countUsers });
  } catch (err) {
    return res.status(404).send(err);
  }
};

const update_user = async (req, res) => {
  try {
    const {
      _id,
      firstName,
      lastName,
      phone,
      address,
      state,
      type,
      email,
      password,
    } = req.body;
    if (password == "") {
      var updatedUser = await User.updateOne(
        { _id: _id },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            address: address,
            state: state,
            email: email,
          },
        }
      );
    } else {
      var updatedUser = await User.updateOne(
        { _id: _id },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            address: address,
            state: state,
            email: email,
            password: password,
          },
        }
      );
    }
    if (updatedUser.nModified > 0) {
      var user = await User.findOne({ _id });
      return res.status(200).send({ updatedUser, user });
    } else {
      return res.status(200).send({ updatedUser });
    }
  } catch (err) {
    return res.status(404).send(err);
  }
};

//delete user
const delete_user = async (req, res) => {
  try {
    const userDeleted = await User.deleteOne({ _id: req.params.id });
    res.status(200).send({ userDeleted });
  } catch (err) {
    return res.status(404).send(err);
  }
};

function compare(a, b) {
  const nbr_Orders_A = a.nb_orders;
  const nbr_Orders_B = b.nb_orders;
  let comparisation = 0;
  if (nbr_Orders_A < nbr_Orders_B) {
    comparisation = 1;
  } else if (nbr_Orders_A > nbr_Orders_B) {
    comparisation = -1;
  }
  return comparisation;
}

module.exports = {
  get_users,
  get_user_by_id,
  get_user_by_email,
  get_count_Users,
  update_user,
  delete_user,
};
