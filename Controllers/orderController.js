const Order = require("../Models/Order");
const Product = require("../Models/Product");
var fs = require("fs");

const create_order = async (req, res) => {
  try {
    const { user, products, total, payment_method, date, status } = req.body;
    const order = await Order.create({
      user,
      products,
      total,
      payment_method,
      date,
      status,
    });
    if (status == "Confirmée") {
      for (var i = 0; i < products.length; i++) {
        const updateProductOrder = await Product.updateOne(
          { _id: products[i].product._id },
          {
            $inc: {
              nb_Orders: parseInt(products[i].quantity),
            },
          }
        );
      }
    }
    return res.status(201).send(order);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const get_orders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    return res.status(200).send(orders);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const get_orders_stats = async (req, res) => {
  try {
    const countOrders = await Order.find().countDocuments();
    const countConfirmedOrders = await Order.find({
      status: "Confirmée",
    }).countDocuments();
    const countWaitingOrders = await Order.find({
      status: "En attente",
    }).countDocuments();
    const countCancledOrders = await Order.find({
      status: "Annulée",
    }).countDocuments();
    return res.status(200).send({
      countOrders,
      countConfirmedOrders,
      countWaitingOrders,
      countCancledOrders,
    });
  } catch (err) {
    return res.status(404).json(err.message);
  }
};
const get_orders_count = async (req, res) => {
  try {
    const countOrders = await Order.find().countDocuments();

    return res.status(200).send({
      countOrders,
    });
  } catch (err) {
    return res.status(404).json(err.message);
  }
};
const get_user_orders = async (req, res) => {
  try {
    const orders = await Order.find({ "user._id": req.params.id }).sort({
      date: -1,
    });

    return res.status(200).send(orders);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const get_order_by_id = async (req, res) => {
  try {
    const order = await Order.find({ _id: req.params.id });
    return res.status(200).send(order);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const get_user_order_by_date = async (req, res) => {
  try {
    var date = changeDateFormat(req.params.date.toString());
    const order = await Order.find({ "user._id": req.params.id, date: date });
    return res.status(200).send(order);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};
const get_order_by_date = async (req, res) => {
  try {
    var date = changeDateFormat(req.params.date.toString());
    const order = await Order.find({ date: date });
    return res.status(200).send(order);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const get_order_by_status = async (req, res) => {
  try {
    const order = await Order.find({ status: req.params.status }).sort({
      date: -1,
    });
    return res.status(200).send(order);
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const get_gains = async (req, res) => {
  try {
    var gains = 0;
    const orders = await Order.find({ status: "Confirmée" });
    for (var i = 0; i < orders.length; i++) {
      gains = gains + parseInt(orders[i].total);
    }
    return res.status(200).send({ gains });
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

const confirm_order = async (req, res) => {
  try {
    const order = await Order.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "Confirmée",
        },
      }
    );
    const orderFound = await Order.findOne({ _id: req.params.id });
    for (var i = 0; i < orderFound.products.length; i++) {
      const updateProductOrder = await Product.updateOne(
        { _id: orderFound.products[i].product._id },
        {
          $inc: {
            nb_Orders: parseInt(orderFound.products[i].quantity),
          },
        }
      );
    }
    return res.status(200).send({ order });
  } catch (err) {
    console.log("updateProductOrder err ",err); 
    return res.status(404).json(err.message);
  }
};
const cancel_order = async (req, res) => {
  try {
    const order = await Order.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "Annulée",
        },
      }
    );

    return res.status(200).send({ order });
  } catch (err) {
    return res.status(404).json(err.message);
  }
};

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
  create_order,
  get_orders,
  get_orders_stats,
  get_user_orders,
  get_order_by_id,
  get_user_order_by_date,
  get_order_by_date,
  get_order_by_status,
  get_orders_count,
  get_gains,
  confirm_order,
  cancel_order,
};
