import { useEffect, useState } from "react";
import { fetchBooks, createBook, updateBook, deleteBook } from "../api/books";

const emptyForm = {
  title: "",
  author: "",
  isbn: "",
  genre: "",
  description: "",
  coverUrl: "",
  totalCopies: 1,
  publishedYear: "",
};

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await fetchBooks({ search, limit: 50 });
      setBooks(data.books);
    } catch (err) {
      setError("Could not load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadBooks();
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (book) => {
    setEditingId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre || "",
      description: book.description || "",
      coverUrl: book.coverUrl || "",
      totalCopies: book.totalCopies,
      publishedYear: book.publishedYear || "",
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      ...form,
      totalCopies: Number(form.totalCopies) || 1,
      publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
    };

    try {
      if (editingId) {
        await updateBook(editingId, payload);
      } else {
        await createBook(payload);
      }
      closeForm();
      loadBooks();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save this book.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    try {
      await deleteBook(book._id);
      loadBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete this book.");
    }
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Manage Books</h1>
          <p style={styles.subtitle}>Add, edit, and remove titles from the catalog.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateForm}>
          + Add a book
        </button>
      </div>

      <form onSubmit={handleSearch} style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by title, author, or ISBN…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" className="btn btn-secondary">Search</button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="spinner" />
      ) : (
        <div style={styles.table}>
          <div style={{ ...styles.tableRow, ...styles.tableHead }}>
            <span style={{ flex: 3 }}>Title</span>
            <span style={{ flex: 2 }}>Author</span>
            <span style={{ flex: 1.5 }}>Genre</span>
            <span style={{ flex: 1 }}>Copies</span>
            <span style={{ flex: 1.5 }}>Actions</span>
          </div>
          {books.map((book) => (
            <div key={book._id} style={styles.tableRow}>
              <span style={{ flex: 3, fontWeight: 600 }}>{book.title}</span>
              <span style={{ flex: 2, color: "var(--color-ink-soft)" }}>{book.author}</span>
              <span style={{ flex: 1.5 }}>
                <span className="badge badge-neutral">{book.genre || "General"}</span>
              </span>
              <span style={{ flex: 1 }}>{book.availableCopies}/{book.totalCopies}</span>
              <span style={{ flex: 1.5, display: "flex", gap: 8 }}>
                <button className="btn btn-secondary" onClick={() => openEditForm(book)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(book)}>
                  Delete
                </button>
              </span>
            </div>
          ))}
          {books.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "var(--color-ink-soft)" }}>
              No books found.
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div style={styles.modalOverlay} onClick={closeForm}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{editingId ? "Edit book" : "Add a new book"}</h2>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div className="field">
                  <label>Title</label>
                  <input value={form.title} onChange={handleChange("title")} required />
                </div>
                <div className="field">
                  <label>Author</label>
                  <input value={form.author} onChange={handleChange("author")} required />
                </div>
                <div className="field">
                  <label>ISBN</label>
                  <input value={form.isbn} onChange={handleChange("isbn")} required />
                </div>
                <div className="field">
                  <label>Genre</label>
                  <input value={form.genre} onChange={handleChange("genre")} placeholder="e.g. Fiction" />
                </div>
                <div className="field">
                  <label>Total copies</label>
                  <input
                    type="number"
                    min="0"
                    value={form.totalCopies}
                    onChange={handleChange("totalCopies")}
                    required
                  />
                </div>
                <div className="field">
                  <label>Published year</label>
                  <input
                    type="number"
                    value={form.publishedYear}
                    onChange={handleChange("publishedYear")}
                  />
                </div>
              </div>

              <div className="field">
                <label>Cover image URL (optional)</label>
                <input value={form.coverUrl} onChange={handleChange("coverUrl")} />
              </div>

              <div className="field">
                <label>Description</label>
                <textarea value={form.description} onChange={handleChange("description")} />
              </div>

              <div style={styles.modalActions}>
                <button type="button" className="btn btn-secondary" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : editingId ? "Save changes" : "Add book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14.5,
    color: "var(--color-ink-soft)",
    margin: 0,
  },
  searchBar: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    maxWidth: 400,
    padding: "10px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-border)",
    backgroundColor: "var(--color-card)",
    fontSize: 14,
  },
  table: {
    backgroundColor: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
  },
  tableRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 20px",
    borderBottom: "1px solid var(--color-border)",
    fontSize: 14,
    flexWrap: "wrap",
  },
  tableHead: {
    backgroundColor: "var(--color-paper-dark)",
    fontWeight: 700,
    fontSize: 12.5,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "var(--color-ink-soft)",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(43,36,32,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 100,
  },
  modal: {
    backgroundColor: "var(--color-card)",
    borderRadius: "var(--radius-md)",
    padding: "32px 32px 24px",
    width: "100%",
    maxWidth: 560,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "var(--shadow-lift)",
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 20,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 16px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
};

export default AdminBooksPage;
