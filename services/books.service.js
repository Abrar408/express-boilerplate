const axios = require("axios");
const pool = require("../../config/db.config");
const { BOOK_RESPONSES, USER_RESPONSES } = require("../../constants/responses");
const convertStringToArray = require("../../utility/convertStringToArray.");
const buildDynamicUpdateQuery = require("../../utility/buildDynamicUpdateQuery");

const getBooks = async (request) => {
  const { userId = null } = request.user;
  const unPublished = request.query?.unpublished;
  let {
    search,
    hashTags,
    authorName,
    bookTitle,
    trending,
    newArrivals,
    category,
    genreId,
    novelType,
    isCompleted,
  } = request.query;

  const page = request.query.page || 1;
  const limit = request.query.limit || 10;
  const offset = (page - 1) * limit;

  try {
    const params = [];
    // let c = `
    // SELECT COUNT(*) AS total_count FROM books
    // JOIN users ON books.author_id = users.id
    // JOIN genres ON books.genre_id = genres.id
    // LEFT JOIN book_chapters ON books.id = book_chapters.book_id
    // LEFT JOIN book_ratings ON books.id = book_ratings.book_id`;

    let q = `
   
SELECT
          books.*,
          COUNT(*) OVER() AS total_count,
          users.full_name AS author_name,
          genres.name AS genre_name,
          IFNULL(chapter_counts.number_of_chapters, 0) AS number_of_chapters,
          IFNULL(chapter_counts.word_count, 0) AS word_count,
          IFNULL(AVG(book_ratings.rating),0) AS average_rating
      FROM
          books
      JOIN users ON books.author_id = users.id
      JOIN genres ON books.genre_id = genres.id
      LEFT JOIN (
          SELECT
              book_id,
              status,
              COUNT(id) AS number_of_chapters,
              SUM(LENGTH(chapter_content) - LENGTH(REPLACE(chapter_content, ' ', '')) + 1) AS word_count
          FROM
              book_chapters
          WHERE
              status = 1
          GROUP BY
              book_id
      ) AS chapter_counts ON chapter_counts.book_id = books.id
      LEFT JOIN book_ratings ON books.id = book_ratings.book_id   
         
   
    `;

    // let q = "";
    if (!unPublished) {
      q += ` WHERE chapter_counts.status = 1`;
    }
    // if (search) {
    //   q += q.includes("WHERE") ? ` AND` : ` WHERE`;
    //   q += ` (books.title LIKE ? OR users.username LIKE ? OR books.tags LIKE ?)`;
    //   params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    // }

    if (category) {
      q += q.includes("WHERE") ? ` AND` : ` WHERE`;
      q += ` books.category = ?`;
      params.push(category);
    }

    if (novelType) {
      q += q.includes("WHERE") ? ` AND` : ` WHERE`;
      q += ` books.novel_type = ?`;
      params.push(novelType);
    }

    // if (hashTags) {
    //   q += q.includes("WHERE") ? ` AND` : ` WHERE`;
    //   q += ` JSON_CONTAINS(tags, ?)`;

    //   hashTags = JSON.stringify(convertStringToArray(hashTags));
    //   params.push(hashTags);
    // }

    // if (authorName) {
    //   q += q.includes("WHERE") ? ` AND` : ` WHERE`;
    //   q += ` users.username LIKE ?`;

    //   params.push(`%${authorName}%`);
    // }

    // if (bookTitle) {
    //   q += q.includes("WHERE") ? ` AND` : ` WHERE`;
    //   q += ` books.title LIKE ?`;

    //   params.push(`%${bookTitle}%`);
    // }

    if (genreId) {
      q += q.includes("WHERE") ? ` AND` : ` WHERE`;
      q += ` books.genre_id = ?`;
      params.push(genreId);
    }

    if (isCompleted === "true") {
      q += q.includes("WHERE") ? ` AND` : ` WHERE`;
      q += ` books.is_completed = 1`;
    }

    if (isCompleted === "false") {
      q += q.includes("WHERE") ? ` AND` : ` WHERE`;
      q += ` books.is_completed = 0`;
    }

    q += ` GROUP BY books.id`;

    if (trending === "true") {
      q += ` ORDER BY books.views DESC`;
    }

    if (newArrivals === "true") {
      q += ` ORDER BY books.created_at DESC`;
    }

    if (limit) {
      q += ` LIMIT ? OFFSET ?`;
      params.push(+limit, offset);
    }

    let [books] = await pool.query(q, params);
    // let [[result]] = await pool.query(c + q.slice(0, -17), params);

    //checking if user has bookmarked the book
    let bookIds = [];

    if (userId) {
      const [userBookmarks] = await pool.query(
        `SELECT book_id FROM users_bookmark WHERE user_id = ?`,
        [userId]
      );
      userBookmarks.forEach((bookmark) => {
        bookIds.push(bookmark.book_id);
      });
    }

    books.forEach((book) => {
      book.tags = JSON.parse(book.tags);
      // book.total_count = result.total_count;
      if (bookIds.includes(book.id)) {
        book.isBookmarked = true;
      } else {
        book.isBookmarked = false;
      }
    });
    return books;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getRecommendedBooks = async (userId) => {
  try {
    const [books] = await pool.query(
      `SELECT 
      books.id,
      books.cover_page,
      books.title,
      books.views,
      IFNULL(book_ratings.average_rating,0) AS average_rating,
      users.username, 
      users.id AS user_id
  FROM 
      books 
  LEFT JOIN users ON users.id = books.author_id    
  LEFT JOIN (
      SELECT 
          book_id,
          AVG(rating) AS average_rating
      FROM
          book_ratings
      GROUP BY 
          book_id        
  ) AS book_ratings ON book_ratings.book_id = books.id
  WHERE 
      books.genre_id IN (
          SELECT genre_id 
          FROM books 
          WHERE id IN (
              SELECT DISTINCT JSON_EXTRACT(additional_data, '$.book_id') AS book_id
              FROM users_activity
              WHERE user_id = ?
          )
      )
  ORDER BY RAND()`,
      [userId]
    );

    return books;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getBooksYouMayAlsoLike = async (bookId) => {
  try {
    const [youMayAlsoLike] = await pool.query(
      `
      SELECT
          books.id,
          books.cover_page,
          books.title,
          IFNULL(book_ratings.average_rating, 0) AS average_rating
      FROM
          books
      LEFT JOIN(
          SELECT book_id,
              AVG(rating) AS average_rating
          FROM
              book_ratings
          GROUP BY
              book_id
      ) AS book_ratings
      ON
          book_ratings.book_id = books.id
      WHERE
          books.genre_id =(
            SELECT genre_id FROM books WHERE id = ?
      )
      ORDER BY average_rating DESC, RAND()
      LIMIT 5
      `,
      [bookId]
    );
    return youMayAlsoLike;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getSingleBook = async (request) => {
  const recommendations = request?.query?.recommendations;
  const bookId = request?.params?.bookId;
  const { userId = null } = request.user;

  if (!bookId) {
    return BOOK_RESPONSES.NOT_FOUND;
  }
  try {
    // getting book details
    const [book] = await pool.query(
      `SELECT
          books.*,
          users.full_name AS author_name,
          genres.name AS genre, 
          IFNULL(users_bookmark.bookmark_count, 0) AS bookmarks_count,
          IFNULL(chapter_counts.number_of_chapters, 0) AS number_of_chapters,
          IFNULL(chapter_counts.word_count, 0) AS word_count,
          IFNULL(book_ratings.average_rating, 0) AS average_rating
      FROM
          books
      LEFT JOIN genres ON genres.id = books.genre_id
      LEFT JOIN (
          SELECT
              book_id,
              COUNT(id) AS number_of_chapters,
              SUM(LENGTH(chapter_content) - LENGTH(REPLACE(chapter_content, ' ', '')) + 1) AS word_count
          FROM
              book_chapters
          WHERE
              status = 1
          GROUP BY
              book_id
      ) AS chapter_counts ON chapter_counts.book_id = books.id
      LEFT JOIN (
          SELECT
              book_id,
              AVG(rating) AS average_rating
          FROM
              book_ratings
          GROUP BY
              book_id
      ) AS book_ratings ON book_ratings.book_id = books.id
      LEFT JOIN (
            SELECT              
              book_id,
              COUNT(*) AS bookmark_count
            FROM
              users_bookmark
            GROUP BY book_id
      ) AS users_bookmark ON books.id = users_bookmark.book_id
      LEFT JOIN users ON books.author_id = users.id
      WHERE
          books.id = ?`,
      [bookId]
    );
    if (
      book.length === 0
      // || book[0].number_of_chapters === null
    ) {
      return BOOK_RESPONSES.NOT_FOUND;
    }

    book[0].tags = JSON.parse(book[0].tags);

    let youMayAlsoLike;
    let isBookmarked = false;

    if (recommendations === "true") {
      youMayAlsoLike = await axios.get(
        `${process.env.BACKEND_DOMAIN}/api/books/recommendations/${book[0].id}`
      );
    }

    if (userId) {
      // adding book in user's history
      await pool.query(
        `DELETE FROM users_history WHERE user_id = ? AND book_id = ?`,
        [userId, bookId]
      );
      await pool.query(
        `INSERT INTO users_history(user_id, book_id) VALUES(?, ?)`,
        [userId, bookId]
      );
      // tracking user's activity
      await pool.query(
        `INSERT INTO users_activity (user_id, action, additional_data)
        VALUES (?, ?, ?)`,
        [userId, "book_view", JSON.stringify({ book_id: bookId })]
      );
      const [[bookmarked]] = await pool.query(
        `SELECT * FROM users_bookmark WHERE book_id = ? AND user_id = ?`,
        [bookId, userId]
      );
      isBookmarked = bookmarked ? true : false;

      var [[result]] = await pool.query(
        `
      SELECT * FROM user_support WHERE supporting_user_id = ? AND supported_user_id = ?
      `,
        [userId, book[0].author_id]
      );
    }
    if (!recommendations || recommendations === "false") {
      return { ...book[0], is_supporting: result ? true : false, isBookmarked };
    }

    return {
      ...book[0],
      is_supporting: result ? true : false,
      isBookmarked,
      youMayAlsoLike: youMayAlsoLike.data.data,
    };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const createBook = async (request) => {
  const authorId = request.user.userId;
  const {
    category,
    genreId,
    title,
    synopsis,
    contentRating,
    novelType,
    canonSource,
    tags,
    contestId,
    coverPage,
  } = request.body;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [book] = await pool.query(
      `INSERT INTO books(
        category,
        genre_id,
        cover_page,
        title,
        synopsis,
        content_rating,
        novel_type,
        canon_source,
        tags,
        author_id,
        contest_id
      )
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category,
        genreId,
        coverPage,
        title,
        synopsis,
        contentRating,
        novelType,
        canonSource,
        JSON.stringify(tags),
        authorId,
        contestId,
      ]
    );

    await conn.commit();
    return book.insertId;
  } catch (error) {
    await conn.rollback();
    throw new Error(error.message);
  } finally {
    conn.release();
  }
};

const updateBook = async (request) => {
  const bookId = request.params.bookId;
  const userId = request.user.userId;
  const {
    category,
    genreId,
    title,
    synopsis,
    contentRating,
    novelType,
    tags,
    status,
    coverPage,
  } = request.body;

  const data = {
    category: category,
    genre_id: genreId,
    cover_page: coverPage,
    title: title,
    synopsis: synopsis,
    content_rating: contentRating,
    novel_type: novelType,
    tags: tags,
    is_completed: `${Math.floor(status)}`,
  };
  const dynamicQuery = buildDynamicUpdateQuery("books", data);
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [[result]] = await pool.query(
      `SELECT author_id FROM books WHERE id = ?`,
      [bookId]
    );

    if (!result.author_id) {
      return;
    }

    if (result.author_id != userId) {
      return USER_RESPONSES.UNAUTHORIZED;
    }

    const [updatedBook] = await pool.query(`${dynamicQuery.query}`, [
      ...dynamicQuery.values,
      +bookId,
    ]);

    await conn.commit();

    return updatedBook.affectedRows;
  } catch (error) {
    await conn.rollback();
    throw new Error(error.message);
  } finally {
    conn.release();
  }
};

const deleteBook = async (request) => {
  const bookId = request.params.bookId;
  const authorId = request.user.userId;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [results] = await pool.query(
      `DELETE
      FROM
          books
      WHERE
          id = ? AND author_id = ?`,
      [bookId, authorId]
    );
    await conn.commit();

    return results.affectedRows;
  } catch (error) {
    await conn.rollback();
    throw new Error(error.message);
  } finally {
    conn.release();
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
