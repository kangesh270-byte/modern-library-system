import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <span style={styles.brandMark}>&#9776;</span>
          <span style={styles.brandText}>The Athenaeum</span>
        </Link>

        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Catalog</Link>

          {user && (
            <Link to="/my-books" style={styles.navLink}>My Books</Link>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/books" style={styles.navLink}>Manage Books</Link>
              <Link to="/admin/borrows" style={styles.navLink}>Borrow Records</Link>
            </>
          )}

          {user ? (
            <div style={styles.userArea}>
              <span style={styles.userName}>{user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Log out
              </button>
            </div>
          ) : (
            <div style={styles.userArea}>
              <Link to="/login" className="btn btn-secondary">Log in</Link>
              <Link to="/register" className="btn btn-primary">Sign up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "var(--color-card)",
    borderBottom: "1px solid var(--color-border)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 72,
    flexWrap: "wrap",
    gap: 12,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  brandMark: {
    fontSize: 22,
    color: "var(--color-spine)",
  },
  brandText: {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
  },
  navLink: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--color-ink-soft)",
  },
  userArea: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginLeft: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--color-ink)",
  },
};

export default Navbar;
