const pool = require("../../config/db.config");

const {
  getCustomerId,
  getSupportedCreators,
  transferPayment,
  updatePaymentMethodOfCustomer,
} = require("../../utility/stripeUtils");

const handlePaymentIntentSucceeded = async (data) => {
  try {
    const {
      payment_method: paymentMethodId,
      metadata: { userId },
    } = data;

    const customerId = await getCustomerId(userId);

    await updatePaymentMethodOfCustomer(customerId, paymentMethodId);

    const supportedCreators = await getSupportedCreators(userId);

    if (supportedCreators.length > 0) {
      const amountPerRecipient = 500 / supportedCreators.length;

      for (const supportedCreator of supportedCreators) {
        await transferPayment(
          amountPerRecipient,
          supportedCreator.stripe_id,
          data.latest_charge
        );

        await pool.query(
          `INSERT INTO earnings (user_id, amount) VALUES(?, ?)`,
          [supportedCreator.id, amountPerRecipient / 100]
        );
      }
    }

    await pool.query(`INSERT INTO payments (user_id, amount) VALUES(?, ?)`, [
      userId,
      7.99,
    ]);

    await pool.query(
      `UPDATE users SET subscription_status = 'active'
            WHERE id = ?`,
      [userId]
    );

    const [[alreadyExists]] = await pool.query(
      `SELECT * FROM payments_schedule WHERE user_id = ?`,
      [userId]
    );

    if (!alreadyExists) {
      await pool.query(
        `INSERT INTO payments_schedule (user_id, last_charged_date)
                VALUES(?, ?)`,
        [userId, new Date()]
      );
    } else {
      await pool.query(
        `UPDATE payments_schedule SET last_charged_date = ?
                WHERE user_id = ?`,
        [new Date(), userId]
      );
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

module.exports = handlePaymentIntentSucceeded;
