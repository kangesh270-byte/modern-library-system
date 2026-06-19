import { useEffect, useState, useCallback } from "react";
import { fetchBooks, fetchGenres } from "../api/books";
import BookCard from "../components/BookCard";

const CatalogPage = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await fetchBooks({ search, genre, page, limit: 9 });
      setBooks(data.books);
      setPages(data.pages);
    } catch (err) {
      setError("Could not load the catalog. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  }, [search, genre, page]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    fetchGenres()
      .then(({ data }) => setGenres(data))
      .catch(() => setGenres([]));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadBooks();
  };

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
      <div style={styles.hero}>
        <p style={styles.eyebrow}>The Athenaeum Library</p>
        <h1 style={styles.heroTitle}>Find your next book.</h1>
        <p style={styles.heroSub}>
          Browse the full catalog, check availability, and borrow with a click.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by title, author, or ISBN…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            setPage(1);
          }}
          style={styles.genreSelect}
        >
          <option value="all">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="spinner" />
      ) : books.length === 0 ? (
        <div style={styles.empty}>
          <p>No books match your search. Try a different title, author, or genre.</p>
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          {pages > 1 && (
            <div style={styles.pagination}>
              <button
                className="btn btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span style={styles.pageInfo}>Page {page} of {pages}</span>
              <button
                className="btn btn-secondary"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  hero: {
    maxWidth: 640,
    marginBottom: 36,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--color-spine)",
    margin: "0 0 10px",
  },
  heroTitle: {
    fontSize: 44,
    lineHeight: 1.1,
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 16,
    color: "var(--color-ink-soft)",
    margin: 0,
  },
  searchBar: {
    display: "flex",
    gap: 12,
    marginBottom: 36,
    flexWrap: "wrap",
  },
  searchInput: {
    flex: "2 1 280px",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-border)",
    backgroundColor: "var(--color-card)",
    fontSize: 14,
  },
  genreSelect: {
    flex: "1 1 160px",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-border)",
    backgroundColor: "var(--color-card)",
    fontSize: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20,
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    color: "var(--color-ink-soft)",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 40,
  },
  pageInfo: {
    fontSize: 14,
    color: "var(--color-ink-soft)",
  },
};

export default CatalogPage;
