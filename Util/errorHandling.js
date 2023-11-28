const AppError = require("./AppError");
const logger = require("./winstonLogger");

module.exports = {
  ErrorHandler: (error, req, res, next) => {
    if (error instanceof AppError) {
      logger.error(error.message);
      return res.status(error.StatusCode).json({
        status: "failure",
        message: error.errorCode,
        error_message: error.message,
      });
    }
    logger.error(error._message);
    return res.status(500).json({
      status: "failure",
      message: "Something went Wrong",
      error_message: error._message,
      error: error,
    });
  },
};
