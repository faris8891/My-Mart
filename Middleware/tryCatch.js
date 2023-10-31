const logger = require("../Util/winstonLogger")

module.exports = {
    tryCatch: (controller) => async (req, res, next) => {
        try {
            return await controller(req, res)
        } catch (error) {
            logger.error(error)
            return next(error)
        }
    }
}