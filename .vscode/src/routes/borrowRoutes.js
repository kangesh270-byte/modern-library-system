const express = require("express");
const {
  borrowBook,
  returnBook,
  getMyBorrows,
  getAllBorrows,
} = require("../controllers/borrowController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/my", protect, getMyBorrows);
router.get("/", protect, adminOnly, getAllBorrows);
router.post("/:bookId", protect, borrowBook);
router.put("/:borrowId/return", protect, returnBook);

module.exports = router;
