const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const pool = require("../../config/db.config");

const {
  getCustomerId,
  createPaymentIntent,
} = require("../../utility/stripeUtils");
const { hasPassedThirtyDays } = require("../../utility/dateUtils");

const handleMonthlyPayments = async () => {
  try {
    const [paymentSchedules] = await pool.query(
      `SELECT * FROM payments_schedule WHERE will_cancel_on IS NULL`
    );

    for (const paymentSchedule of paymentSchedules) {
      if (hasPassedThirtyDays(paymentSchedule.last_charged_date)) {
        const customerId = await getCustomerId(paymentSchedule.user_id);
        const customer = await stripe.customers.retrieve(customerId);
        const defaultPaymentMethodId =
          customer.invoice_settings.default_payment_method;

        const paymentIntent = await createPaymentIntent(
          799,
          paymentSchedule.user_id,
          customerId
        );

        await stripe.paymentIntents.confirm(paymentIntent.id, {
          payment_method: defaultPaymentMethodId,
        });

        if (confirmedPaymentIntent.status !== "succeeded") {
          await pool.query(
            `UPDATE users SET subscription_status = ? WHERE id = ?`,
            ["inactive", paymentSchedule.user_id]
          );

          await pool.query(`DELETE FROM payments_schedule WHERE user_id = ?`, [
            paymentSchedule.user_id,
          ]);
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

module.exports = handleMonthlyPayments;
