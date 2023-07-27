const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");

const pool = require("../config/db.config");

const createCustomer = async (user) => {
  const { id: customerId } = await stripe.customers.create({
    email: user.email,
    metadata: {
      userId: user.id,
      fullName: user.full_name,
      address: user.address,
    },
  });

  return customerId;
};

const getCustomerId = async (userId) => {
  const [[{ customer_id }]] = await pool.query(
    `SELECT customer_id from users WHERE id = ?`,
    [userId]
  );

  return customer_id;
};

const updatePaymentMethodOfCustomer = async (customerId, paymentMethodId) => {
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
};

const getSupportedCreators = async (userId) => {
  const [supportedCreators] = await pool.query(
    `SELECT users.id, users.stripe_id FROM users
            JOIN user_support ON users.id = user_support.supported_user_id
            WHERE user_support.supporting_user_id = ?`,
    [userId]
  );

  return supportedCreators;
};

const createPaymentIntent = async (amount, userId, customerId) => {
  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount,
      currency: "usd",
      customer: customerId,
      setup_future_usage: "off_session",
      metadata: { userId },
    },
    {
      idempotencyKey: uuidv4(),
    }
  );

  return paymentIntent;
};

const transferPayment = async (amount, to, chargeId) => {
  // console.log(typeof Number.isInteger(amount) ? amount : amount.toFixed(2));

  await stripe.transfers.create({
    amount: Number.isInteger(amount) ? amount : amount.toFixed(2),
    currency: "usd",
    destination: to,
    source_transaction: chargeId,
  });
};

module.exports = {
  createCustomer,
  getCustomerId,
  updatePaymentMethodOfCustomer,
  getSupportedCreators,
  createPaymentIntent,
  transferPayment,
};
