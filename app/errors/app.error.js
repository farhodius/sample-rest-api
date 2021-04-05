class AppError extends Error {

  constructor(msg, httpCode, code) {
    super(msg);
    this.httpCode = httpCode;
    this.code = code;
  }

}

module.exports = AppError;