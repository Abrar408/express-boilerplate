const pool = require("../../config/db.config");

const { isToday } = require("../../utility/dateUtils");

const handleCancellations = async () => {
  try {
    const [cancellationSchedules] = await pool.query(
      `SELECT * FROM payments_schedule WHERE will_cancel_on IS NOT NULL`
    );

    for (const cancellationSchedule of cancellationSchedules) {
      if (isToday(cancellationSchedule.will_cancel_on)) {
        await pool.query(
          `UPDATE users SET subscription_status = ? WHERE id = ?`,
          ["inactive", cancellationSchedule.user_id]
        );

        await pool.query(`DELETE FROM payments_schedule WHERE user_id = ?`, [
          cancellationSchedule.user_id,
        ]);
      }
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

module.exports = handleCancellations;
