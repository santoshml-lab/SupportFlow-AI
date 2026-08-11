import { useState } from "react";



function TicketDetails({ ticket, onBack, onViewCustomer }) {
  const [loading, setLoading] = useState(false);
const [aiResult, setAiResult] = useState(null);

  const analyzeTicket = async () => {
  setLoading(true);
  setAiResult(null);

  try {
    const response = await fetch(
      "https://finpilotai-2s9v.onrender.com/support/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `${ticket.subject}. Customer: ${ticket.customer}`,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error("AI analysis failed");
    }

    let analysis = data.analysis;

    if (typeof analysis === "string") {
      analysis = JSON.parse(analysis);
    }

    setAiResult(analysis);
  } catch (error) {
    console.error(error);
    alert("Unable to analyze ticket.");
  } finally {
    setLoading(false);
  }
};
  if (!ticket) {
    return (
      <div className="page-placeholder">
        <h1>Ticket not found</h1>

        <button className="new-ticket" onClick={onBack}>
          ← Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-details-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>

          <button
            className="back-btn"
            onClick={onBack}
          >
            ← Back to Tickets
          </button>

          <h1>Ticket Details</h1>

          <p>
            View ticket information and customer support activity
          </p>

        </div>

        <span
          className={`badge ${
            ticket.status === "Open"
              ? "open"
              : ticket.status === "In Progress"
              ? "progress"
              : "open"
          }`}
        >
          {ticket.status}
        </span>

      </div>


      {/* ================= TICKET OVERVIEW ================= */}

      <section className="ticket-overview-card">

        <div>

          <span className="ticket-id">
            {ticket.id}
          </span>

          <h2>
            {ticket.subject}
          </h2>

          <p>
            Customer support request
          </p>

        </div>


        <div className="ticket-meta">

          <div>
            <span>Category</span>
            <strong>{ticket.category}</strong>
          </div>

          <div>
            <span>Priority</span>

            <strong>
              <span
                className={`badge ${
                  ticket.priority.toLowerCase()
                }`}
              >
                {ticket.priority}
              </span>
            </strong>

          </div>

        </div>

      </section>


      {/* ================= CUSTOMER ================= */}

      <section className="detail-card">

        <div className="section-header">

          <div>
            <h2>Customer</h2>
            <p>Customer associated with this ticket</p>
          </div>

          <button
            className="view-all"
            onClick={() => onViewCustomer(ticket.customerId)}
          >
            View Customer →
          </button>

        </div>


        <div className="customer">

          <div className="avatar">
            {ticket.customer
              .split(" ")
              .map((name) => name[0])
              .join("")}
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

      </section>


      {/* ================= TICKET INFORMATION ================= */}

      <section className="analysis-details">

        <div className="detail-card">

          <h3>
            📝 Ticket Information
          </h3>

          <p>
            This ticket was created for:
          </p>

          <strong>
            {ticket.subject}
          </strong>

          <div className="ticket-info-list">

            <div>
              <span>Ticket ID</span>
              <strong>{ticket.id}</strong>
            </div>

            <div>
              <span>Category</span>
              <strong>{ticket.category}</strong>
            </div>

            <div>
              <span>Priority</span>
              <strong>{ticket.priority}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{ticket.status}</strong>
            </div>

          </div>

        </div>


        {/* ================= AI SECTION ================= */}

        <div className="detail-card ai-ticket-card">

          <h3>
            🤖 SupportFlow AI
          </h3>

          <p>
            AI-powered ticket analysis and response assistance.
          </p>

          <div className="ai-status">
            ✨ AI Analysis Ready
          </div>

          <button
  className="new-ticket"
  onClick={analyzeTicket}
  disabled={loading}
>
  {loading
    ? "Analyzing..."
    : "✨ Analyze Ticket with AI"}
</button>
          {aiResult && (
  <div className="ai-result">

    <div className="ai-result-header">
      <div>
        <h3>✨ AI Analysis</h3>
        <p>SupportFlow AI recommendation</p>
      </div>

      <span className="ai-ready-badge">
        ● Ready
      </span>
    </div>

    <div className="ai-result-grid">

      <div className="ai-result-item">
        <span>Category</span>
        <strong>
          {aiResult.category || "Unknown"}
        </strong>
      </div>

      <div className="ai-result-item">
        <span>Priority</span>
        <strong>
          {aiResult.priority || "Unknown"}
        </strong>
      </div>

      <div className="ai-result-item">
        <span>Sentiment</span>
        <strong>
          {aiResult.sentiment || "Unknown"}
        </strong>
      </div>

    </div>

    <div className="ai-summary">

      <h4>📝 Summary</h4>

      <p>
        {aiResult.summary ||
          "No summary available."}
      </p>

    </div>

    <div className="ai-reply">

      <div>
        <h4>💬 Suggested Reply</h4>

        <p>
          {aiResult.suggested_reply ||
            "No reply generated."}
        </p>
      </div>

      <button
        className="copy-btn"
        onClick={() => {
          navigator.clipboard.writeText(
            aiResult.suggested_reply || ""
          );

          alert("AI reply copied!");
        }}
      >
        📋 Copy Reply
      </button>

    </div>

  </div>
)}
  

    
    
            
          

        </div>

      </section>

    </div>
  );
}

export default TicketDetails;
