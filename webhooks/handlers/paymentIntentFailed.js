const pool = require("../../config/db.config");

const handlePaymentIntentFailed = async (data) => {
  // const { id: subscriptionId, metadata: { userId } } = data;
  // try {
  //     await pool.query(
  //         `UPDATE
  //             users
  //         SET
  //             subscription_id = ?,
  //             subscription_status = 'active'
  //         WHERE
  //             id = ?`,
  //         [subscriptionId, userId]
  //     );
  // } catch (error) {
  //     throw new Error(error.message);
  // }
};

module.exports = handlePaymentIntentFailed;
