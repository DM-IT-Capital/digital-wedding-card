import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div className="topbar">
        <div className="container">
          <strong>Digital Wedding Card Portal</strong>
        </div>
      </div>

      <section className="hero">
        <div className="container">
          <div className="card">
            <h1 className="page-title">Digital Wedding Card Website</h1>
            <p className="muted">
              Creator login portal, customer card management, and public wedding
              invitation pages.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 20,
                flexWrap: "wrap"
              }}
            >
              <Link href="/login" className="btn">
                Creator Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
