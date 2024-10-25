const winston = require("winston");

const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log" }),
    new winston.transports.Console(),
  ],
});

module.exports = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("서버 내부 오류가 발생했습니다.");
};
