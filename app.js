const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");

const cookie = require("cookie-parser");

app.use(bodyParser.json());
app.use(cookie());
app.use(cors());

// -----------------ENV---------------------
require("dotenv").config();

const port = process.env.PORT;
const key = process.env.SECRET_KEY;

// -----------------Database Connection---------------------
const mongoose = require("mongoose");
mongoose.connect(key).then(() => console.log("Mongo Db connected"));

// -----------------Routers---------------------
const userRouter = require("./Routers/user");
app.use("/", userRouter);

const dealerRouter = require("./Routers/dealer");
app.use("/dealer", dealerRouter);

const adminRouter = require("./Routers/admin");
app.use("/admin", adminRouter);

// -----------------Express server connect---------------------
app.listen(port, () => {
  console.log(`Express Server Connected at ${port}`);
});
