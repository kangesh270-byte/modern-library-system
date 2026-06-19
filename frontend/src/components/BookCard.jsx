import { Link } from "react-router-dom";

const GENRE_COLORS = {
  Technology: "#5F7A61",
  Fiction: "#8B3A2F",
  "Non-Fiction": "#B08D57",
  "Self-Help": "#6E5B8A",
  History: "#3F5E72",
  Science: "#2F6E63",
  default: "#8B3A2F",
};

const getSpineColor = (genre) => GENRE_COLORS[genre] || GENRE_COLORS.default;

const BookCard = ({ book }) => {
  const isAvailable = book.availableCopies > 0;

  return (
    <Link to={`/books/${book._id}`} style={styles.card} className="book-card">
      <div
        style={{ ...styles.spine, backgroundColor: getSpineColor(book.genre) }}
      >
        <span style={styles.spineGenre}>{book.genre || "General"}</span>
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{book.title}</h3>
        <p style={styles.author}>{book.author}</p>
        <div style={styles.footer}>
          <span
            className={`badge ${isAvailable ? "badge-success" : "badge-danger"}`}
          >
            {isAvailable ? `${book.availableCopies} available` : "All checked out"}
          </span>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--color-card)",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
    border: "1px solid var(--color-border)",
    boxShadow: "var(--shadow-card)",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
  },
  spine: {
    height: 64,
    display: "flex",
    alignItems: "center",
    paddingLeft: 18,
  },
  spineGenre: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  content: {
    padding: "16px 18px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 1.3,
  },
  author: {
    margin: 0,
    fontSize: 13.5,
    color: "var(--color-ink-soft)",
  },
  footer: {
    marginTop: "auto",
    paddingTop: 12,
  },
};

export default BookCard;
