const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AuthRoute = require("./routes/auth");
const UserRoute = require("./routes/user");
const ProductRoute = require("./routes/product");
const OrderRoute = require("./routes/order");
const CartRoute = require("./routes/cart");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB connection is successful"))
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());
app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/products", ProductRoute);
app.use("/api/cart", CartRoute);
app.use("/api/orders", OrderRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running!");
})