const crypto = require("crypto");

const generateOTP = (length = 6) => {
  const size = Math.floor(length / 2);
  const otp = crypto.randomBytes(size).toString("hex");
  return otp;
};

const getTimeDifferenceInMinutes = (date) => {
  const differenceInMilliseconds = Date.now() - new Date(date);
  const minutes = differenceInMilliseconds / 60000;
  const utcTimeDifference = minutes + new Date().getTimezoneOffset();
  return utcTimeDifference;
};

module.exports = { generateOTP, getTimeDifferenceInMinutes };
