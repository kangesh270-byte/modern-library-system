import api from "./axios";

export const borrowBook = (bookId) => api.post(`/borrow/${bookId}`);
export const returnBook = (borrowId) => api.put(`/borrow/${borrowId}/return`);
export const fetchMyBorrows = () => api.get("/borrow/my");
export const fetchAllBorrows = (params) => api.get("/borrow", { params });
