const express = require("express");

const validateRequestBody = require("../../middleware/validateRequestBody.middleware");
const authRequired = require("../../middleware/authRequired.middleware");
const guestAccess = require("../../middleware/guestAccess.middleware");
const verifyView = require("../../middleware/verifyView.middleware");
const validateRequest = require("../../middleware/validateRequest.middleware");

const bookCreateSchema = require("../../validations/books/create.validation");
const bookUpdateSchema = require("../../validations/books/update.validation");
const commentCreateSchema = require("../../validations/comments/comments.validation");
const chapterCreateSchema = require("../../validations/chapters/create.validation");
const chapterUpdateSchema = require("../../validations/chapters/update.validation");
const reportBookSchema = require("../../validations/report/reportBook.validation");
const getBooksSchema = require("../../validations/books/getBooks.validation");

const { reportBook } = require("../../controllers/report/report.controllers");

const {
  getBooks,
  getRecommendedBooks,
  getBooksYouMayAlsoLike,
  getSingleBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../../controllers/books/books.controllers");

const {
  getAllChapters,
  getSingleChapter,
  createChapter,
  updateChapter,
  deleteChapter,
} = require("../../controllers/chapters/chapter.controllers");

const {
  getComments,
  createComment,
} = require("../../controllers/comments/comment.controllers");
const getBooksYouMayAlsoLikeSchema = require("../../validations/books/getBooksYouMayAlsoLike.validation");
const getSingleBookSchema = require("../../validations/books/getSingleBook.validation");

const router = express.Router();

//book routes
router.get("/", guestAccess, validateRequest(getBooksSchema), getBooks);
router.get("/recommendations", authRequired, getRecommendedBooks);
router.get(
  "/recommendations/:bookId",
  validateRequest(getBooksYouMayAlsoLikeSchema),
  getBooksYouMayAlsoLike
);
router.get(
  "/:bookId",
  guestAccess,
  validateRequest(getSingleBookSchema),
  verifyView,
  getSingleBook
);
router.post("/", authRequired, validateRequest(bookCreateSchema), createBook);
router.patch(
  "/:bookId",
  authRequired,
  validateRequestBody(bookUpdateSchema),
  updateBook
);
router.delete("/:bookId", authRequired, deleteBook);

//chapters routes
router.get("/:bookId/chapters", getAllChapters);
router.get("/:bookId/chapters/:chapterId", guestAccess, getSingleChapter);

router.post(
  "/chapters/:bookId",
  authRequired,
  validateRequestBody(chapterCreateSchema),
  createChapter
);
router.patch(
  "/chapters/:chapterId",
  authRequired,
  validateRequestBody(chapterUpdateSchema),
  updateChapter
);

router.delete("/chapters/:chapterId", authRequired, deleteChapter);

//reviews routes
router.get("/reviews/:bookId", getComments);
router.post(
  "/reviews/:bookId",
  authRequired,
  validateRequestBody(commentCreateSchema),
  createComment
);

//report book
router.post(
  "/report/:bookId",
  authRequired,
  validateRequestBody(reportBookSchema),
  reportBook
);

module.exports = router;
