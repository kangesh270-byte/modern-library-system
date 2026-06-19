import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not log in. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Log in to borrow and manage your books.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link>
        </p>

        <div style={styles.demoBox}>
          <strong>Demo accounts</strong> (after running the seed script):
          <div>Admin — admin@library.com / admin123</div>
          <div>Member — member@library.com / member123</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 64,
    paddingBottom: 64,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    padding: "36px 32px",
    boxShadow: "var(--shadow-card)",
  },
  title: {
    fontSize: 28,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "var(--color-ink-soft)",
    margin: "0 0 24px",
  },
  footerText: {
    fontSize: 14,
    color: "var(--color-ink-soft)",
    textAlign: "center",
    marginTop: 20,
  },
  link: {
    color: "var(--color-spine)",
    fontWeight: 600,
    textDecoration: "underline",
  },
  demoBox: {
    marginTop: 24,
    padding: "12px 14px",
    backgroundColor: "var(--color-paper-dark)",
    borderRadius: "var(--radius-sm)",
    fontSize: 12.5,
    color: "var(--color-ink-soft)",
    lineHeight: 1.7,
  },
};

export default LoginPage;
