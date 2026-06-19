import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="container" style={styles.wrapper}>
    <h1 style={styles.code}>404</h1>
    <p style={styles.text}>This page doesn't exist in our catalog.</p>
    <Link to="/" className="btn btn-primary">Back to the library</Link>
  </div>
);

const styles = {
  wrapper: {
    textAlign: "center",
    padding: "100px 20px",
  },
  code: {
    fontSize: 64,
    marginBottom: 8,
    color: "var(--color-spine)",
  },
  text: {
    fontSize: 16,
    color: "var(--color-ink-soft)",
    marginBottom: 28,
  },
};

export default NotFoundPage;
