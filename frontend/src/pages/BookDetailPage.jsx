import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchBookById } from "../api/books";
import { borrowBook } from "../api/borrow";
import { useAuth } from "../context/AuthContext";

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [borrowing, setBorrowing] = useState(false);

  const loadBook = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await fetchBookById(id);
      setBook(data);
    } catch (err) {
      setError("This book could not be found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBorrow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setBorrowing(true);
    setError("");
    setMessage("");
    try {
      await borrowBook(id);
      setMessage("You've borrowed this book. It's due back in 14 days.");
      loadBook();
    } catch (err) {
      setError(err.response?.data?.message || "Could not borrow this book.");
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 48 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="container" style={{ paddingTop: 48 }}>
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="btn btn-secondary">Back to catalog</Link>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <Link to="/" style={styles.backLink}>&larr; Back to catalog</Link>

      <div style={styles.layout}>
        <div style={styles.spinePanel}>
          <span style={styles.spineGenre}>{book.genre || "General"}</span>
        </div>

        <div style={styles.info}>
          <h1 style={styles.title}>{book.title}</h1>
          <p style={styles.author}>by {book.author}</p>

          <div style={styles.metaRow}>
            <span className={`badge ${isAvailable ? "badge-success" : "badge-danger"}`}>
              {isAvailable ? `${book.availableCopies} of ${book.totalCopies} available` : "All copies checked out"}
            </span>
            {book.publishedYear && (
              <span className="badge badge-neutral">{book.publishedYear}</span>
            )}
            <span className="badge badge-neutral">ISBN {book.isbn}</span>
          </div>

          {book.description && (
            <p style={styles.description}>{book.description}</p>
          )}

          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <button
            className="btn btn-primary"
            disabled={!isAvailable || borrowing}
            onClick={handleBorrow}
            style={{ marginTop: 8 }}
          >
            {borrowing ? "Borrowing…" : isAvailable ? "Borrow this book" : "Not available"}
          </button>

          {!user && (
            <p style={styles.loginHint}>
              You'll need to <Link to="/login" style={styles.inlineLink}>log in</Link> to borrow.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  backLink: {
    display: "inline-block",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--color-ink-soft)",
    marginBottom: 28,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: 40,
  },
  spinePanel: {
    backgroundColor: "var(--color-spine)",
    borderRadius: "var(--radius-md)",
    minHeight: 280,
    display: "flex",
    alignItems: "flex-start",
    padding: 20,
  },
  spineGenre: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  info: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 36,
    lineHeight: 1.15,
    marginBottom: 8,
  },
  author: {
    fontSize: 17,
    color: "var(--color-ink-soft)",
    margin: "0 0 20px",
  },
  metaRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  description: {
    fontSize: 15.5,
    lineHeight: 1.65,
    color: "var(--color-ink)",
    maxWidth: 600,
    marginBottom: 8,
  },
  loginHint: {
    fontSize: 13.5,
    color: "var(--color-ink-soft)",
    marginTop: 12,
  },
  inlineLink: {
    color: "var(--color-spine)",
    fontWeight: 600,
    textDecoration: "underline",
  },
};

export default BookDetailPage;
