import api from "./axios";

export const fetchBooks = (params) => api.get("/books", { params });
export const fetchBookById = (id) => api.get(`/books/${id}`);
export const fetchGenres = () => api.get("/books/genres/list");
export const createBook = (data) => api.post("/books", data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);
