const pool = require("../config/db.config");
const views = new Map();
const clearViews = () => {
  views.clear();
};
setInterval(clearViews, 60 * 60 * 1000);
const verifyView = async (req, res, next) => {
  const ip = req.ip;
  const bookId = req?.params?.bookId;
  if (!bookId || bookId === "undefined" || bookId === "") {
    return next();
  }
  if (views.has(ip)) {
    const bookIds = views.get(ip);
    if (bookIds[bookId]) {
      next();
    } else {
      const [result] = await pool.query(
        `UPDATE
                    books
                SET
                    views = views + 1
                WHERE
                    id = ${bookId}`
      );
      views.set(ip, { ...bookIds, [bookId]: Date.now() });
      next();
    }
  } else {
    views.set(ip, { [bookId]: Date.now() });
    const [result] = await pool.query(
      `UPDATE
                books
            SET
                views = views + 1
            WHERE
                id = ${bookId}`
    );
    next();
  }
};
module.exports = verifyView;
