class AppError extends Error {
    constructor(ErrorCode, Message, StatusCode) {
        super(Message);
        this.ErrorCode = ErrorCode
        this.StatusCode = StatusCode
    }
}



module.exports = AppError