const Borrow = require("../models/Borrow");
const Book = require("../models/Book");

const BORROW_PERIOD_DAYS = 14;

// @desc    Borrow a book
// @route   POST /api/borrow/:bookId
// @access  Private
const borrowBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    // Prevent a user from borrowing the same book twice without returning it
    const existing = await Borrow.findOne({
      user: req.user._id,
      book: bookId,
      status: { $in: ["borrowed", "overdue"] },
    });
    if (existing) {
      return res.status(400).json({ message: "You already have this book borrowed" });
    }

    // Atomically decrement availableCopies only if stock is available.
    // This avoids race conditions where two users borrow the last copy simultaneously.
    const book = await Book.findOneAndUpdate(
      { _id: bookId, availableCopies: { $gt: 0 } },
      { $inc: { availableCopies: -1 } },
      { new: true }
    );

    if (!book) {
      const exists = await Book.findById(bookId);
      if (!exists) {
        return res.status(404).json({ message: "Book not found" });
      }
      return res.status(400).json({ message: "No copies available for this book" });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + BORROW_PERIOD_DAYS);

    const borrowRecord = await Borrow.create({
      user: req.user._id,
      book: bookId,
      dueDate,
    });

    const populated = await borrowRecord.populate("book");

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Return a borrowed book
// @route   PUT /api/borrow/:borrowId/return
// @access  Private
const returnBook = async (req, res, next) => {
  try {
    const { borrowId } = req.params;

    const record = await Borrow.findById(borrowId);
    if (!record) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    // Members can only return their own books; admins can return any
    if (
      req.user.role !== "admin" &&
      record.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to return this record" });
    }

    if (record.status === "returned") {
      return res.status(400).json({ message: "This book has already been returned" });
    }

    record.status = "returned";
    record.returnedAt = new Date();
    await record.save();

    await Book.findByIdAndUpdate(record.book, { $inc: { availableCopies: 1 } });

    const populated = await record.populate("book");
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's borrow history
// @route   GET /api/borrow/my
// @access  Private
const getMyBorrows = async (req, res, next) => {
  try {
    const records = await Borrow.find({ user: req.user._id })
      .populate("book")
      .sort({ createdAt: -1 });

    // Mark overdue items dynamically for display
    const now = new Date();
    const withStatus = records.map((r) => {
      const obj = r.toObject();
      if (obj.status === "borrowed" && new Date(obj.dueDate) < now) {
        obj.status = "overdue";
      }
      return obj;
    });

    res.json(withStatus);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all borrow records (admin)
// @route   GET /api/borrow
// @access  Private/Admin
const getAllBorrows = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const records = await Borrow.find(query)
      .populate("book")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const now = new Date();
    const withStatus = records.map((r) => {
      const obj = r.toObject();
      if (obj.status === "borrowed" && new Date(obj.dueDate) < now) {
        obj.status = "overdue";
      }
      return obj;
    });

    res.json(withStatus);
  } catch (error) {
    next(error);
  }
};

module.exports = { borrowBook, returnBook, getMyBorrows, getAllBorrows };
