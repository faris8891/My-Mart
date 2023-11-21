module.exports = {
    tryCatch: (controller) => async (req, res, next) => {
        try {
            const keys = Object.keys(controller);
            return await controller[keys](req, res, next)
        } catch (error) {
            return next(error)
        }
    }
}