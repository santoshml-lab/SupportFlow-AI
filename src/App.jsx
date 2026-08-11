import { useState } from "react";
import Tickets from "./pages/Tickets";
import Customers from "./pages/Customers";
import "./App.css";
const API_URL = "https://finpilotai-2s9v.onrender.com";

function App() {
  const [page, setPage] = useState("dashboard");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeTicket = async () => {
    if (!message.trim()) {
      alert("Please enter a customer message.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/support/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to analyze ticket.");
      }

      let analysis = data.analysis;

      if (typeof analysis === "string") {
        analysis = JSON.parse(analysis);
      }

      setResult(analysis);
    } catch (error) {
      console.error(error);
      alert("Unable to analyze ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyReply = async () => {
    if (!result?.suggested_reply) return;

    await navigator.clipboard.writeText(result.suggested_reply);

    alert("AI reply copied!");
  };

  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            S
          </div>

          <div>
            <h2>SupportFlow</h2>
            <span>AI Support Platform</span>
          </div>

        </div>


        <nav className="navigation">

          <button
            className={`nav-item ${
              page === "dashboard" ? "active" : ""
            }`}
            onClick={() => setPage("dashboard")}
          >
            <span>📊</span>
            Dashboard
          </button>


          <button
            className={`nav-item ${
              page === "tickets" ? "active" : ""
            }`}
            onClick={() => setPage("tickets")}
          >
            <span>🎫</span>
            Tickets
          </button>


          <button
            className={`nav-item ${
              page === "customers" ? "active" : ""
            }`}
            onClick={() => setPage("customers")}
          >
            <span>👥</span>
            Customers
          </button>


          <button
            className={`nav-item ${
              page === "analytics" ? "active" : ""
            }`}
            onClick={() => setPage("analytics")}
          >
            <span>📈</span>
            Analytics
          </button>

        </nav>


        <div className="sidebar-bottom">

          <button
            className={`nav-item ${
              page === "settings" ? "active" : ""
            }`}
            onClick={() => setPage("settings")}
          >
            <span>⚙️</span>
            Settings
          </button>


          <div className="profile-mini">

            <div className="avatar">
              SA
            </div>

            <div>
              <strong>Support Admin</strong>
              <span>Administrator</span>
            </div>

          </div>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="main">

        {/* ================= TICKETS PAGE ================= */}

        {page === "tickets" && (
          <Tickets />
        )}


        {/* ================= DASHBOARD ================= */}

        {page === "dashboard" && (

          <>

            <header className="topbar">

              <div>

                <h1>
                  Dashboard
                </h1>

                <p>
                  AI-powered customer support management
                </p>

              </div>


              <div className="topbar-actions">

                <button className="notification">
                  🔔
                  <span></span>
                </button>


                <button className="new-ticket">
                  + New Ticket
                </button>

              </div>

            </header>


            {/* ================= STATS ================= */}

            <section className="stats">

              <div className="stat-card">

                <div className="stat-icon blue">
                  🎫
                </div>

                <div>
                  <span>Open Tickets</span>
                  <h2>24</h2>
                  <small>+8.2% this week</small>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon red">
                  🚨
                </div>

                <div>
                  <span>High Priority</span>
                  <h2>7</h2>
                  <small>Needs attention</small>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon green">
                  ✓
                </div>

                <div>
                  <span>Resolved Today</span>
                  <h2>18</h2>
                  <small>+12.4% today</small>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon orange">
                  ☹
                </div>

                <div>
                  <span>Negative Sentiment</span>
                  <h2>9</h2>
                  <small>Needs follow-up</small>
                </div>

              </div>

            </section>


            {/* ================= AI ANALYZER ================= */}

            <section className="analyzer-section">

              <div className="section-header">

                <div>

                  <h2>
                    🤖 AI Ticket Analyzer
                  </h2>

                  <p>
                    Analyze customer messages with SupportFlow AI
                  </p>

                </div>

              </div>


              <div className="analyzer-card">

                <label htmlFor="customerMessage">
                  Customer Message
                </label>


                <textarea
                  id="customerMessage"
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  placeholder="Example: I was charged twice for my subscription and need help..."
                />


                <div className="analyzer-footer">

                  <span>
                    AI will detect category, priority,
                    sentiment and suggest a reply.
                  </span>


                  <button
                    id="analyzeBtn"
                    onClick={analyzeTicket}
                    disabled={loading}
                  >
                    {loading
                      ? "Analyzing..."
                      : "✨ Analyze with AI"}
                  </button>

                </div>

              </div>

            </section>


            {/* ================= AI RESULT ================= */}

            {result && (

              <section className="result-section">

                <div className="section-header">

                  <div>

                    <h2>
                      AI Analysis
                    </h2>

                    <p>
                      SupportFlow AI analysis result
                    </p>

                  </div>

                </div>


                <div className="result-grid">

                  <div className="result-card">

                    <span>
                      Category
                    </span>

                    <strong>
                      {result.category || "Unknown"}
                    </strong>

                  </div>


                  <div className="result-card">

                    <span>
                      Priority
                    </span>

                    <strong>
                      {result.priority || "Unknown"}
                    </strong>

                  </div>


                  <div className="result-card">

                    <span>
                      Sentiment
                    </span>

                    <strong>
                      {result.sentiment || "Unknown"}
                    </strong>

                  </div>

                </div>


                <div className="analysis-details">

                  <div className="detail-card">

                    <h3>
                      Summary
                    </h3>

                    <p>
                      {result.summary ||
                        "No summary available."}
                    </p>

                  </div>


                  <div className="detail-card">

                    <h3>
                      ✨ AI Suggested Reply
                    </h3>

                    <p>
                      {result.suggested_reply ||
                        "No reply generated."}
                    </p>


                    <button
                      className="copy-btn"
                      onClick={copyReply}
                    >
                      Copy Reply
                    </button>

                  </div>

                </div>

              </section>

            )}


            {/* ================= RECENT TICKETS ================= */}

            <section className="tickets-section">

              <div className="section-header">

                <div>

                  <h2>
                    Recent Tickets
                  </h2>

                  <p>
                    Latest customer support activity
                  </p>

                </div>


                <button
                  className="view-all"
                  onClick={() => setPage("tickets")}
                >
                  View All →
                </button>

              </div>


              <div className="table-card">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Customer
                      </th>

                      <th>
                        Subject
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Priority
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    <tr>

                      <td>

                        <div className="customer">

                          <div className="avatar small">
                            JD
                          </div>

                          <div>

                            <strong>
                              John Doe
                            </strong>

                            <span>
                              john@example.com
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>
                        Duplicate subscription charge
                      </td>


                      <td>
                        Billing
                      </td>


                      <td>

                        <span className="badge high">
                          High
                        </span>

                      </td>


                      <td>

                        <span className="badge open">
                          Open
                        </span>

                      </td>

                    </tr>


                    <tr>

                      <td>

                        <div className="customer">

                          <div className="avatar small">
                            AS
                          </div>

                          <div>

                            <strong>
                              Alex Smith
                            </strong>

                            <span>
                              alex@example.com
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>
                        Unable to login
                      </td>


                      <td>
                        Account
                      </td>


                      <td>

                        <span className="badge medium">
                          Medium
                        </span>

                      </td>


                      <td>

                        <span className="badge progress">
                          In Progress
                        </span>

                      </td>

                    </tr>


                    <tr>

                      <td>

                        <div className="customer">

                          <div className="avatar small">
                            MK
                          </div>

                          <div>

                            <strong>
                              Maria Khan
                            </strong>

                            <span>
                              maria@example.com
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>
                        Payment failed
                      </td>


                      <td>
                        Billing
                      </td>


                      <td>

                        <span className="badge critical">
                          Critical
                        </span>

                      </td>


                      <td>

                        <span className="badge open">
                          Open
                        </span>

                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </section>

          </>

        )}


        {/* ================= PLACEHOLDER PAGES ================= */}

        {page === "customers" && (

          <div className="page-placeholder">

            <h1>👥 Customers</h1>

            <p>
              Customer management module coming next.
            </p>

          </div>

        )}


        {page === "analytics" && (

          <div className="page-placeholder">

            <h1>📈 Analytics</h1>

            <p>
              Support analytics dashboard coming next.
            </p>

          </div>

        )}


        {page === "settings" && (

          <div className="page-placeholder">

            <h1>⚙️ Settings</h1>

            <p>
              Platform settings coming next.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default App;
