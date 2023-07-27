const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const handlePaymentIntentSucceeded = require("./handlers/paymentIntentSucceeded");
const handlePaymentIntentFailed = require("./handlers/paymentIntentFailed");

const webhookHandler = async (request, response) => {
  let event;

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    const signature = request.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentIntentSucceeded(event.data.object);
      break;

    case "payment_intent.payment_failed":
      await handlePaymentIntentFailed(event.data.object);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
};

module.exports = webhookHandler;
