import { useEffect, useState } from "react";
import { fetchAllBorrows, returnBook } from "../api/borrow";

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

const AdminBorrowsPage = () => {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returningId, setReturningId] = useState(null);

  const loadRecords = async (statusFilter = status) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await fetchAllBorrows({ status: statusFilter });
      setRecords(data);
    } catch (err) {
      setError("Could not load borrow records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    loadRecords(value);
  };

  const handleForceReturn = async (borrowId) => {
    setReturningId(borrowId);
    setError("");
    try {
      await returnBook(borrowId);
      loadRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Could not mark this as returned.");
    } finally {
      setReturningId(null);
    }
  };

  const counts = {
    borrowed: records.filter((r) => r.status === "borrowed").length,
    overdue: records.filter((r) => r.status === "overdue").length,
    returned: records.filter((r) => r.status === "returned").length,
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <h1 style={styles.title}>Borrow Records</h1>
      <p style={styles.subtitle}>See who has what, and process returns on a member's behalf.</p>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{counts.borrowed}</span>
          <span style={styles.statLabel}>Currently out</span>
        </div>
        <div style={styles.statCard}>
          <span style={{ ...styles.statValue, color: "var(--color-danger)" }}>{counts.overdue}</span>
          <span style={styles.statLabel}>Overdue</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{counts.returned}</span>
          <span style={styles.statLabel}>Returned</span>
        </div>
      </div>

      <select value={status} onChange={handleFilterChange} style={styles.filterSelect}>
        <option value="all">All records</option>
        <option value="borrowed">Borrowed</option>
        <option value="overdue">Overdue</option>
        <option value="returned">Returned</option>
      </select>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="spinner" />
      ) : (
        <div style={styles.table}>
          <div style={{ ...styles.tableRow, ...styles.tableHead }}>
            <span style={{ flex: 2.5 }}>Book</span>
            <span style={{ flex: 2 }}>Member</span>
            <span style={{ flex: 1.5 }}>Due date</span>
            <span style={{ flex: 1 }}>Status</span>
            <span style={{ flex: 1.5 }}>Action</span>
          </div>
          {records.map((record) => (
            <div key={record._id} style={styles.tableRow}>
              <span style={{ flex: 2.5, fontWeight: 600 }}>{record.book?.title || "—"}</span>
              <span style={{ flex: 2, color: "var(--color-ink-soft)" }}>
                {record.user?.name} <br />
                <span style={{ fontSize: 12 }}>{record.user?.email}</span>
              </span>
              <span style={{ flex: 1.5 }}>{formatDate(record.dueDate)}</span>
              <span style={{ flex: 1 }}>
                <span className={`badge ${statusBadge(record.status)}`}>{record.status}</span>
              </span>
              <span style={{ flex: 1.5 }}>
                {record.status !== "returned" ? (
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleForceReturn(record._id)}
                    disabled={returningId === record._id}
                  >
                    {returningId === record._id ? "Processing…" : "Mark returned"}
                  </button>
                ) : (
                  <span style={{ fontSize: 13, color: "var(--color-ink-soft)" }}>
                    Returned {formatDate(record.returnedAt)}
                  </span>
                )}
              </span>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "var(--color-ink-soft)" }}>
              No records match this filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  title: {
    fontSize: 32,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14.5,
    color: "var(--color-ink-soft)",
    margin: "0 0 28px",
  },
  statsRow: {
    display: "flex",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  statCard: {
    backgroundColor: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    padding: "16px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 140,
  },
  statValue: {
    fontFamily: "var(--font-display)",
    fontSize: 28,
    fontWeight: 700,
  },
  statLabel: {
    fontSize: 12.5,
    color: "var(--color-ink-soft)",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  filterSelect: {
    padding: "10px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-border)",
    backgroundColor: "var(--color-card)",
    fontSize: 14,
    marginBottom: 24,
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
};

export default AdminBorrowsPage;
