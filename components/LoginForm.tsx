"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid username or password");
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="container" style={{ padding: "50px 0" }}>
      <div className="card" style={{ maxWidth: 460, margin: "0 auto" }}>
        <h1 className="page-title">Creator Login</h1>
        <p className="muted">Only creator or boss can access dashboard.</p>

        <form onSubmit={handleSubmit} className="grid" style={{ marginTop: 20 }}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error ? <p style={{ color: "crimson", margin: 0 }}>{error}</p> : null}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
