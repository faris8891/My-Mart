module.exports = {
    tryCatch: (controller) => async (req, res, next) => {
        try {
            return await controller(req, res, next)
        } catch (error) {
            return next(error)
        }
    }
}