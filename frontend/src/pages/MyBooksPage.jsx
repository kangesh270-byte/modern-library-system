import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyBorrows, returnBook } from "../api/borrow";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const statusBadge = (status) => {
  if (status === "returned") return "badge-neutral";
  if (status === "overdue") return "badge-danger";
  return "badge-success";
};

const MyBooksPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returningId, setReturningId] = useState(null);

  const loadRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await fetchMyBorrows();
      setRecords(data);
    } catch (err) {
      setError("Could not load your borrowed books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleReturn = async (borrowId) => {
    setReturningId(borrowId);
    setError("");
    try {
      await returnBook(borrowId);
      loadRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Could not return this book.");
    } finally {
      setReturningId(null);
    }
  };

  const active = records.filter((r) => r.status !== "returned");
  const history = records.filter((r) => r.status === "returned");

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <h1 style={styles.title}>My Books</h1>
      <p style={styles.subtitle}>Track what you've borrowed and return books when you're done.</p>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          <h2 style={styles.sectionTitle}>Currently borrowed</h2>
          {active.length === 0 ? (
            <p style={styles.emptyText}>
              You don't have any books out right now. <Link to="/" style={styles.link}>Browse the catalog</Link>.
            </p>
          ) : (
            <div style={styles.list}>
              {active.map((record) => (
                <div key={record._id} style={styles.row}>
                  <div style={styles.rowInfo}>
                    <Link to={`/books/${record.book._id}`} style={styles.bookTitle}>
                      {record.book.title}
                    </Link>
                    <span style={styles.bookAuthor}>{record.book.author}</span>
                  </div>
                  <div style={styles.rowMeta}>
                    <span style={styles.dueText}>Due {formatDate(record.dueDate)}</span>
                    <span className={`badge ${statusBadge(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleReturn(record._id)}
                    disabled={returningId === record._id}
                  >
                    {returningId === record._id ? "Returning…" : "Return book"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {history.length > 0 && (
            <>
              <h2 style={{ ...styles.sectionTitle, marginTop: 48 }}>History</h2>
              <div style={styles.list}>
                {history.map((record) => (
                  <div key={record._id} style={styles.row}>
                    <div style={styles.rowInfo}>
                      <Link to={`/books/${record.book._id}`} style={styles.bookTitle}>
                        {record.book.title}
                      </Link>
                      <span style={styles.bookAuthor}>{record.book.author}</span>
                    </div>
                    <div style={styles.rowMeta}>
                      <span style={styles.dueText}>
                        Returned {formatDate(record.returnedAt)}
                      </span>
                      <span className="badge badge-neutral">returned</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  title: {
    fontSize: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "var(--color-ink-soft)",
    margin: "0 0 36px",
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  emptyText: {
    color: "var(--color-ink-soft)",
    fontSize: 14.5,
  },
  link: {
    color: "var(--color-spine)",
    fontWeight: 600,
    textDecoration: "underline",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "16px 20px",
    backgroundColor: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    flexWrap: "wrap",
  },
  rowInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: 200,
    flex: "2 1 200px",
  },
  bookTitle: {
    fontWeight: 600,
    fontSize: 15.5,
  },
  bookAuthor: {
    fontSize: 13,
    color: "var(--color-ink-soft)",
  },
  rowMeta: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: "1 1 160px",
  },
  dueText: {
    fontSize: 13.5,
    color: "var(--color-ink-soft)",
  },
};

export default MyBooksPage;
