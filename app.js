const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");


const logger = require("./Util/winstonLogger")
const morganMiddleware = require("./Util/morganMiddleware");

const cookie = require("cookie-parser");
app.use(cookie());
app.use(bodyParser.json());
app.use(cors())
app.use(morganMiddleware)

const {tryCatch} = require("./Middleware/tryCatch")

// -----------------ENV---------------------
require("dotenv").config();

const port = process.env.PORT;
const key = process.env.SECRET_KEY;

// -----------------Database Connection---------------------
const mongoose = require("mongoose");
mongoose.connect(key).then(() => {logger.info("Mongo DB Connected")}).catch((error) => logger.error("Failed to connect DB", error.message))

// -----------------Routers---------------------


const userRouter = require("./Routers/user");
app.use("/api/users", userRouter);

const dealerRouter = require("./Routers/dealer");
app.use("/api/dealers", dealerRouter);

const adminRouter = require("./Routers/admin");
app.use("/admin", adminRouter);

const productsRouter = require("./Routers/products")
app.use("/api", productsRouter)


const { ErrorHandler } = require("./Util/errorHandling");
app.use(ErrorHandler)



// -----------------Express server connect---------------------
app.listen(port, () => {
  logger.info(`Express Server Connected at ${port}`);
});
