const cron = require("node-cron");

const handleMonthlyPayments = require("./handlers/handleMonthlyPayments");
const handleCancellations = require("./handlers/handleCancellations");

cron.schedule("0 0 * * *", handleCancellations);
cron.schedule("0 0 * * *", handleMonthlyPayments);
