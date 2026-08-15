import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const API_URL = "https://finpilotai-2s9v.onrender.com";

function Dashboard() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // ================= DATABASE STATES =================

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState("");

  // ================= FETCH TICKETS =================

  useEffect(() => {
    fetchDashboardTickets();
  }, []);

  const fetchDashboardTickets = async () => {
    setTicketsLoading(true);
    setTicketsError("");

    const { data, error } = await supabase
      .from("tickets")
      .select(`
        id,
        created_at,
        customer_id,
        subject,
        status,
        priority,
        category,
        sentiment,
        ai_summary,
        ai_suggested_reply,
        assigned_to,
        customers (
          id,
          name,
          email
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Dashboard ticket error:",
        error
      );

      setTicketsError(
        "Unable to load tickets."
      );

      setTickets([]);
      setTicketsLoading(false);

      return;
    }

    const formattedTickets = (data || []).map(
      (ticket) => ({
        id: ticket.id,

        customer_id:
          ticket.customer_id,

        customer:
          ticket.customers?.name ||
          "Unknown Customer",

        email:
          ticket.customers?.email ||
          "",

        subject:
          ticket.subject ||
          "No subject",

        category:
          formatText(
            ticket.category ||
              "General"
          ),

        priority:
          formatText(
            ticket.priority ||
              "Medium"
          ),

        status:
          formatStatus(
            ticket.status ||
              "open"
          ),

        sentiment:
          formatText(
            ticket.sentiment ||
              ""
          ),

        ai_summary:
          ticket.ai_summary ||
          "",

        ai_suggested_reply:
          ticket.ai_suggested_reply ||
          "",

        assigned_to:
          ticket.assigned_to,

        created_at:
          ticket.created_at,
      })
    );

    setTickets(formattedTickets);
    setTicketsLoading(false);
  };

  // ================= FORMAT HELPERS =================

  const formatText = (value) => {
    if (!value) return "";

    return value
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const formatStatus = (value) => {
    if (!value) return "Open";

    return value
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // ================= DASHBOARD STATS =================

  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status.toLowerCase() ===
        "open"
    ).length;

  const highPriority =
    tickets.filter((ticket) => {
      const priority =
        ticket.priority.toLowerCase();

      return (
        priority === "high" ||
        priority === "critical"
      );
    }).length;

  const resolvedToday =
    tickets.filter((ticket) => {
      const today =
        new Date().toDateString();

      const ticketDate =
        new Date(
          ticket.created_at
        ).toDateString();

      return (
        ticket.status.toLowerCase() ===
          "resolved" &&
        ticketDate === today
      );
    }).length;

  const negativeSentiment =
    tickets.filter(
      (ticket) =>
        ticket.sentiment.toLowerCase() ===
        "negative"
    ).length;

  // ================= AI ANALYZER =================

  const analyzeTicket = async () => {
    if (!message.trim()) {
      alert(
        "Please enter a customer message."
      );
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `${API_URL}/support/analyze`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: message,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          "Failed to analyze ticket."
        );
      }

      let analysis =
        data.analysis;

      if (
        typeof analysis ===
        "string"
      ) {
        analysis =
          JSON.parse(analysis);
      }

      setResult(analysis);
    } catch (error) {
      console.error(error);

      alert(
        "Unable to analyze ticket. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= COPY REPLY =================

  const copyReply = async () => {
    if (
      !result?.suggested_reply
    ) {
      return;
    }

    await navigator.clipboard.writeText(
      result.suggested_reply
    );

    alert("AI reply copied!");
  };

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}

      <header className="topbar">

        <div>
          <h1>
            Dashboard
          </h1>

          <p>
            AI-powered customer
            support management
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

            <span>
              Open Tickets
            </span>

            <h2>
              {ticketsLoading
                ? "..."
                : openTickets}
            </h2>

            <small>
              Currently open
            </small>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon red">
            🚨
          </div>

          <div>

            <span>
              High Priority
            </span>

            <h2>
              {ticketsLoading
                ? "..."
                : highPriority}
            </h2>

            <small>
              Needs attention
            </small>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon green">
            ✓
          </div>

          <div>

            <span>
              Resolved Today
            </span>

            <h2>
              {ticketsLoading
                ? "..."
                : resolvedToday}
            </h2>

            <small>
              Resolved today
            </small>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon orange">
            ☹
          </div>

          <div>

            <span>
              Negative Sentiment
            </span>

            <h2>
              {ticketsLoading
                ? "..."
                : negativeSentiment}
            </h2>

            <small>
              Needs follow-up
            </small>

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
              Analyze customer messages
              with SupportFlow AI
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
              AI will detect category,
              priority, sentiment and
              suggest a reply.
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
                SupportFlow AI analysis
                result
              </p>

            </div>

          </div>


          <div className="result-grid">

            <div className="result-card">

              <span>
                Category
              </span>

              <strong>
                {result.category ||
                  "Unknown"}
              </strong>

            </div>


            <div className="result-card">

              <span>
                Priority
              </span>

              <strong>
                {result.priority ||
                  "Unknown"}
              </strong>

            </div>


            <div className="result-card">

              <span>
                Sentiment
              </span>

              <strong>
                {result.sentiment ||
                  "Unknown"}
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
              Latest customer support
              activity
            </p>

          </div>

        </div>


        <div className="table-card">

          {ticketsError && (

            <div className="empty-state">
              {ticketsError}
            </div>

          )}


          {!ticketsError &&
            ticketsLoading && (

              <div className="empty-state">
                Loading tickets...
              </div>

            )}


          {!ticketsError &&
            !ticketsLoading &&
            tickets.length === 0 && (

              <div className="empty-state">
                No tickets found.
              </div>

            )}


          {!ticketsError &&
            !ticketsLoading &&
            tickets.length > 0 && (

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

                  {tickets
                    .slice(0, 5)
                    .map(
                      (ticket) => (

                        <tr
                          key={ticket.id}
                        >

                          <td>

                            <div className="customer">

                              <div className="avatar small">

                                {ticket.customer
                                  .split(" ")
                                  .map(
                                    (name) =>
                                      name[0]
                                  )
                                  .join("")
                                  .slice(
                                    0,
                                    2
                                  )}

                              </div>

                              <div>

                                <strong>
                                  {ticket.customer}
                                </strong>

                                <span>
                                  {ticket.email}
                                </span>

                              </div>

                            </div>

                          </td>


                          <td>
                            {ticket.subject}
                          </td>


                          <td>
                            {ticket.category}
                          </td>


                          <td>

                            <span
                              className={`badge ${ticket.priority.toLowerCase()}`}
                            >
                              {ticket.priority}
                            </span>

                          </td>


                          <td>

                            <span
                              className={`badge ${
                                ticket.status ===
                                "In Progress"
                                  ? "progress"
                                  : "open"
                              }`}
                            >
                              {ticket.status}
                            </span>

                          </td>

                        </tr>

                      )
                    )}

                </tbody>

              </table>

            )}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;
