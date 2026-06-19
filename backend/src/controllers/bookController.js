const Book = require("../models/Book");

// @desc    Get all books (with optional search & pagination)
// @route   GET /api/books?search=&genre=&page=&limit=
// @access  Public
const getBooks = async (req, res, next) => {
  try {
    const { search, genre, page = 1, limit = 12 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ];
    }

    if (genre && genre !== "all") {
      query.genre = { $regex: `^${genre}$`, $options: "i" };
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 12, 1);
    const skip = (pageNum - 1) * limitNum;

    const [books, total] = await Promise.all([
      Book.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Book.countDocuments(query),
    ]);

    res.json({
      books,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      isbn,
      genre,
      description,
      coverUrl,
      totalCopies,
      publishedYear,
    } = req.body;

    if (!title || !author || !isbn) {
      return res.status(400).json({ message: "Title, author, and ISBN are required" });
    }

    const copies = totalCopies !== undefined ? Number(totalCopies) : 1;

    const book = await Book.create({
      title,
      author,
      isbn,
      genre,
      description,
      coverUrl,
      totalCopies: copies,
      availableCopies: copies,
      publishedYear,
    });

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const {
      title,
      author,
      isbn,
      genre,
      description,
      coverUrl,
      totalCopies,
      publishedYear,
    } = req.body;

    // If totalCopies changes, adjust availableCopies proportionally
    if (totalCopies !== undefined && Number(totalCopies) !== book.totalCopies) {
      const diff = Number(totalCopies) - book.totalCopies;
      book.availableCopies = Math.max(0, book.availableCopies + diff);
      book.totalCopies = Number(totalCopies);
    }

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (isbn !== undefined) book.isbn = isbn;
    if (genre !== undefined) book.genre = genre;
    if (description !== undefined) book.description = description;
    if (coverUrl !== undefined) book.coverUrl = coverUrl;
    if (publishedYear !== undefined) book.publishedYear = publishedYear;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    await book.deleteOne();
    res.json({ message: "Book removed successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct genres (for filter dropdown)
// @route   GET /api/books/genres/list
// @access  Public
const getGenres = async (req, res, next) => {
  try {
    const genres = await Book.distinct("genre");
    res.json(genres.filter(Boolean));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getGenres,
};
