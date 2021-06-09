const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authUser = require("./Routes/authUser");
const userRoutes = require("./Routes/userRoutes");
const categorieRoutes = require("./Routes/categorieRoutes");
const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const PORT = process.env.PORT || 3001;
const stripe = require("stripe")(
  "sk_test_51HpdngGvHaENfAb1XmYRtIMhUHirG72pnjHHCQvMnLWluANGmJoLLzRwBwjZvM8BV33XEXTQHpO8KSbqcJjF8YCQ00sBtBeYJh"
);

//Middelwares
const app = express();
app.use(express.json());
app.use(express.static("."));
app.use(cors());
app.use("/images", express.static("images"));

//database connection
const dbURI =
  "mongodb+srv://alaa:8HWO4Rlvd3Tqgqhm@cluster0.nwzf4.mongodb.net/MeubleDb?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    //server
    app.listen(PORT);
    console.log("conncted to server at port :", PORT);
    console.log("connected to data base");
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/payments/create", async (request, response) => {
  const total = request.query.total;

  console.log("Payment Request Recieved BOOM!!! for this amount >>> ", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total * 100, // submits of the currency
    currency: "usd",
  });
  // OK - Created
  console.log("client secret", paymentIntent.client_secret);
  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.use(
  authUser,
  userRoutes,
  categorieRoutes,
  productRoutes,
  orderRoutes,
  messageRoutes
);
