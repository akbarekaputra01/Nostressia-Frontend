import { useMemo, useState } from "react";

const STORAGE_KEY = "nostressia_preview_auth";

const getEnvConfig = () => {
  const enabledFlag = import.meta.env.VITE_PREVIEW_AUTH_ENABLED;
  const password = import.meta.env.VITE_PREVIEW_AUTH_PASSWORD;

  return {
    isEnabled: String(enabledFlag).toLowerCase() === "true",
    password: password ?? "",
  };
};

const getStoredAuth = () => sessionStorage.getItem(STORAGE_KEY) === "true";

function PreviewGate({ children }) {
  const { isEnabled, password } = useMemo(getEnvConfig, []);
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    isEnabled ? getStoredAuth() : true,
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  if (!isEnabled) {
    return children;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!password) {
      setError("Preview password belum dikonfigurasi.");
      return;
    }

    if (input === password) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setIsAuthenticated(true);
      setError("");
      return;
    }

    setError("Password salah. Coba lagi.");
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        padding: "24px",
        color: "#f8fafc",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#111827",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
          Preview terbatas
        </h1>
        <p style={{ fontSize: "14px", color: "#cbd5f5", marginBottom: "20px" }}>
          Masukkan password untuk mengakses preview aplikasi.
        </p>
        <label
          htmlFor="preview-password"
          style={{ display: "block", fontSize: "14px", marginBottom: "8px" }}
        >
          Password
        </label>
        <input
          id="preview-password"
          type="password"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Masukkan password"
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid #1f2937",
            background: "#0b1120",
            color: "#f8fafc",
            marginBottom: "12px",
          }}
        />
        {error ? (
          <p style={{ fontSize: "13px", color: "#fca5a5" }}>{error}</p>
        ) : null}
        <button
          type="submit"
          style={{
            marginTop: "16px",
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Masuk
        </button>
      </form>
    </div>
  );
}

export default PreviewGate;
