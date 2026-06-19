const express = require("express");
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getGenres,
} = require("../controllers/bookController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/genres/list", getGenres);

router.route("/")
  .get(getBooks)
  .post(protect, adminOnly, createBook);

router.route("/:id")
  .get(getBookById)
  .put(protect, adminOnly, updateBook)
  .delete(protect, adminOnly, deleteBook);

module.exports = router;
