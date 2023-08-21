const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./Util/winstonLogger")

const cookie = require("cookie-parser");
app.use(cookie());
app.use(bodyParser.json());
app.use(cors())


// -----------------ENV---------------------
require("dotenv").config();

const port = process.env.PORT;
const key = process.env.SECRET_KEY;

// -----------------Database Connection---------------------
const mongoose = require("mongoose");
mongoose.connect(key).then(() => {logger.info("Mongo DB Connected")}).catch((error) => logger.error("Failed to connect DB", error.message))

// -----------------Routers---------------------
const userRouter = require("./Routers/user");
app.use("/", userRouter);

const dealerRouter = require("./Routers/dealer");
app.use("/dealers", dealerRouter);

const adminRouter = require("./Routers/admin");
const cookieParser = require("cookie-parser");
app.use("/admin", adminRouter);

// -----------------Express server connect---------------------
app.listen(port, () => {
  logger.info(`Express Server Connected at ${port}`);
});
