require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const User = require("../models/User");
const Book = require("../models/Book");

const sampleBooks = [
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    isbn: "9780135957059",
    genre: "Technology",
    description: "A guide to becoming a more effective and pragmatic software developer.",
    coverUrl: "",
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 2019,
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    genre: "Technology",
    description: "A handbook of agile software craftsmanship.",
    coverUrl: "",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2008,
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    genre: "Fiction",
    description: "A dystopian social science fiction novel.",
    coverUrl: "",
    totalCopies: 5,
    availableCopies: 5,
    publishedYear: 1949,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    genre: "Fiction",
    description: "A novel about racial injustice in the American South.",
    coverUrl: "",
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 1960,
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    genre: "Non-Fiction",
    description: "An exploration of how Homo sapiens came to dominate the world.",
    coverUrl: "",
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: 2011,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    genre: "Self-Help",
    description: "An easy and proven way to build good habits and break bad ones.",
    coverUrl: "",
    totalCopies: 6,
    availableCopies: 6,
    publishedYear: 2018,
  },
];

const seed = async () => {
  try {
    await connectDB();

    console.log("Clearing existing books and users...");
    await Book.deleteMany({});
    await User.deleteMany({ email: { $in: ["admin@library.com", "member@library.com"] } });

    console.log("Creating admin user...");
    await User.create({
      name: "Library Admin",
      email: "admin@library.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Creating sample member user...");
    await User.create({
      name: "Sample Member",
      email: "member@library.com",
      password: "member123",
      role: "member",
    });

    console.log("Inserting sample books...");
    await Book.insertMany(sampleBooks);

    console.log("\nSeed complete!");
    console.log("Admin login -> email: admin@library.com | password: admin123");
    console.log("Member login -> email: member@library.com | password: member123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();
