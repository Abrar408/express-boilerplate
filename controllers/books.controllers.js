const status = require("http-status");

const booksService = require("../../services/books/books.service");

const {
  genericResponse,
  BOOK_RESPONSES,
  USER_RESPONSES,
} = require("../../constants/responses");

const getBooks = async (req, res) => {
  try {
    const books = await booksService.getBooks(req);

    if (books.length === 0) {
      const response = genericResponse(
        status.OK,
        true,
        [],
        null,
        BOOK_RESPONSES.NOT_FOUND
      );
      return res.status(response.status.code).json(response);
    }

    const response = genericResponse(status.OK, true, books);
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(
      status.INTERNAL_SERVER_ERROR,
      false,
      null,
      error.message
    );
    return res.status(response.status.code).json(response);
  }
};

const getRecommendedBooks = async (req, res) => {
  try {
    const books = await booksService.getRecommendedBooks(req.user.userId);

    if (books.length === 0) {
      const response = genericResponse(
        status.OK,
        true,
        [],
        null,
        BOOK_RESPONSES.NOTING_TO_SUGGEST
      );
      return res.status(response.status.code).json(response);
    }

    const response = genericResponse(status.OK, true, books);
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(
      status.INTERNAL_SERVER_ERROR,
      false,
      null,
      error.message
    );
    return res.status(response.status.code).json(response);
  }
};

const getBooksYouMayAlsoLike = async (req, res) => {
  try {
    const books = await booksService.getBooksYouMayAlsoLike(req.params.bookId);

    if (books.length === 0) {
      const response = genericResponse(
        status.OK,
        true,
        [],
        null,
        BOOK_RESPONSES.NOTING_TO_SUGGEST
      );
      return res.status(response.status.code).json(response);
    }

    const response = genericResponse(status.OK, true, books);
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(
      status.INTERNAL_SERVER_ERROR,
      false,
      null,
      error.message
    );
    return res.status(response.status.code).json(response);
  }
};

const getSingleBook = async (req, res) => {
  try {
    const books = await booksService.getSingleBook(req);

    if (books == BOOK_RESPONSES.NOT_FOUND) {
      const response = genericResponse(
        status.BAD_REQUEST,
        false,
        null,
        BOOK_RESPONSES.NOT_FOUND
      );
      return res.status(response.status.code).json(response);
    }

    if (books.length === 0) {
      const response = genericResponse(
        status.OK,
        true,
        [],
        null,
        BOOK_RESPONSES.NOT_FOUND
      );
      return res.status(response.status.code).json(response);
    }

    const response = genericResponse(status.OK, true, books);
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(
      status.INTERNAL_SERVER_ERROR,
      false,
      null,
      error.message
    );
    return res.status(response.status.code).json(response);
  }
};

const createBook = async (req, res) => {
  try {
    const bookId = await booksService.createBook(req);

    const response = genericResponse(
      status.CREATED,
      true,
      { bookId },
      null,
      BOOK_RESPONSES.CREATE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(
      status.INTERNAL_SERVER_ERROR,
      false,
      null,
      error.message
    );
    return res.status(response.status.code).json(response);
  }
};

const updateBook = async (req, res) => {
  try {
    const updatedBook = await booksService.updateBook(req);

    if (!updatedBook) {
      const response = genericResponse(
        status.NOT_FOUND,
        false,
        null,
        BOOK_RESPONSES.NOT_FOUND
      );
      return res.status(response.status.code).json(response);
    }

    if (updatedBook === USER_RESPONSES.UNAUTHORIZED) {
      const response = genericResponse(
        status.BAD_REQUEST,
        false,
        null,
        USER_RESPONSES.UNAUTHORIZED
      );
      return res.status(response.status.code).json(response);
    }
    const response = genericResponse(
      status.CREATED,
      true,
      null,
      null,
      BOOK_RESPONSES.UPDATE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(
      status.INTERNAL_SERVER_ERROR,
      false,
      null,
      error.message
    );
    return res.status(response.status.code).json(response);
  }
};

const deleteBook = async (req, res) => {
  try {
    const deletedBook = await booksService.deleteBook(req);

    if (!deletedBook) {
      const response = genericResponse(
        status.NOT_FOUND,
        false,
        null,
        BOOK_RESPONSES.NOT_FOUND
      );
      return res.status(response.status.code).json(response);
    }

    const response = genericResponse(
      status.OK,
      true,
      null,
      null,
      BOOK_RESPONSES.DELETE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(
      status.INTERNAL_SERVER_ERROR,
      false,
      null,
      error.message
    );
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getBooks,
  getRecommendedBooks,
  getBooksYouMayAlsoLike,
  getSingleBook,
  createBook,
  updateBook,
  deleteBook,
};
