import { useState } from "react";

const API_BASE = "https://finpilotai-2s9v.onrender.com";

function TicketDetails({ ticket, onBack, onViewCustomer }) {
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  const [aiResult, setAiResult] = useState(null);
  const [aiReply, setAiReply] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  // =========================
  // AI TICKET ANALYSIS
  // =========================

  const analyzeTicket = async () => {
    setLoading(true);
    setAiResult(null);

    try {
      const response = await fetch(
        `${API_BASE}/support/analyze`,
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
        throw new Error(
          data.detail || "AI analysis failed"
        );
      }

      let analysis = data.analysis;

      if (typeof analysis === "string") {
        try {
          analysis = JSON.parse(analysis);
        } catch {
          throw new Error(
            "AI returned an invalid analysis format."
          );
        }
      }

      setAiResult(analysis);

      // If analysis already contains a suggested reply,
      // show it in the auto-reply box as well.
      if (analysis.suggested_reply) {
        setAiReply(analysis.suggested_reply);
      }

    } catch (error) {
      console.error("AI analysis error:", error);

      alert(
        error.message ||
        "Unable to analyze ticket."
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // AI AUTO REPLY
  // =========================

  const generateAutoReply = async () => {
    setReplyLoading(true);
    setAiReply("");

    try {
      const response = await fetch(
        `${API_BASE}/support/auto-reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name:
              ticket.customer || "Customer",

            ticket_message:
              ticket.subject || "Customer support request",

            category:
              ticket.category || "General",

            priority:
              ticket.priority || "Medium",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Auto reply generation failed"
        );
      }

      if (!data.success) {
        throw new Error(
          "AI could not generate a reply."
        );
      }

      setAiReply(data.reply || "");

    } catch (error) {
      console.error(
        "AI auto reply error:",
        error
      );

      alert(
        error.message ||
        "Unable to generate AI reply."
      );
    } finally {
      setReplyLoading(false);
    }
  };
  const saveAIReply = async () => {
  if (!aiReply.trim()) {
    alert("Please generate or write a reply first.");
    return;
  }

  setSaveLoading(true);

  try {
    const { error } = await supabase
      .from("tickets")
      .update({
        ai_suggested_reply: aiReply.trim(),
      })
      .eq("id", ticket.id);

    if (error) {
      throw new Error(error.message);
    }

    alert("AI reply saved successfully! ✅");
  } catch (error) {
    console.error("Save AI reply error:", error);
    alert(`Unable to save reply: ${error.message}`);
  } finally {
    setSaveLoading(false);
  }
};


  // =========================
  // COPY REPLY
  // =========================

  const copyReply = async () => {
    if (!aiReply) return;

    try {
      await navigator.clipboard.writeText(
        aiReply
      );

      alert("AI reply copied!");

    } catch (error) {
      console.error(
        "Copy reply error:",
        error
      );

      alert("Unable to copy reply.");
    }
  };


  // =========================
  // TICKET NOT FOUND
  // =========================

  if (!ticket) {
    return (
      <div className="page-placeholder">

        <h1>
          Ticket not found
        </h1>

        <button
          className="new-ticket"
          onClick={onBack}
        >
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

          <h1>
            Ticket Details
          </h1>

          <p>
            View ticket information and
            customer support activity
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
            <span>
              Category
            </span>

            <strong>
              {ticket.category}
            </strong>
          </div>


          <div>

            <span>
              Priority
            </span>

            <strong>

              <span
                className={`badge ${
                  ticket.priority?.toLowerCase()
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

            <h2>
              Customer
            </h2>

            <p>
              Customer associated with this ticket
            </p>

          </div>


          <button
            className="view-all"
            onClick={() =>
              onViewCustomer(
                ticket.customerId
              )
            }
          >
            View Customer →
          </button>

        </div>


        <div className="customer">

          <div className="avatar">

            {ticket.customer
              ?.split(" ")
              .map(
                (name) => name[0]
              )
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
              <span>
                Ticket ID
              </span>

              <strong>
                {ticket.id}
              </strong>
            </div>


            <div>
              <span>
                Category
              </span>

              <strong>
                {ticket.category}
              </strong>
            </div>


            <div>
              <span>
                Priority
              </span>

              <strong>
                {ticket.priority}
              </strong>
            </div>


            <div>
              <span>
                Status
              </span>

              <strong>
                {ticket.status}
              </strong>
            </div>

          </div>

        </div>


        {/* ================= AI SECTION ================= */}

        <div className="detail-card ai-ticket-card">

          <h3>
            🤖 SupportFlow AI
          </h3>

          <p>
            AI-powered ticket analysis
            and response assistance.
          </p>


          <div className="ai-status">
            ✨ AI Assistant Ready
          </div>


          {/* ANALYZE BUTTON */}

          <button
            className="new-ticket"
            onClick={analyzeTicket}
            disabled={loading}
          >
            {loading
              ? "Analyzing..."
              : "✨ Analyze Ticket with AI"}
          </button>


          {/* ================= AI ANALYSIS ================= */}

          {aiResult && (

            <div className="ai-result">

              <div className="ai-result-header">

                <div>

                  <h3>
                    ✨ AI Analysis
                  </h3>

                  <p>
                    SupportFlow AI recommendation
                  </p>

                </div>


                <span className="ai-ready-badge">
                  ● Ready
                </span>

              </div>


              <div className="ai-result-grid">

                <div className="ai-result-item">

                  <span>
                    Category
                  </span>

                  <strong>
                    {aiResult.category ||
                      "Unknown"}
                  </strong>

                </div>


                <div className="ai-result-item">

                  <span>
                    Priority
                  </span>

                  <strong>
                    {aiResult.priority ||
                      "Unknown"}
                  </strong>

                </div>


                <div className="ai-result-item">

                  <span>
                    Sentiment
                  </span>

                  <strong>
                    {aiResult.sentiment ||
                      "Unknown"}
                  </strong>

                </div>

              </div>


              {/* SUMMARY */}

              <div className="ai-summary">

                <h4>
                  📝 Summary
                </h4>

                <p>
                  {aiResult.summary ||
                    "No summary available."}
                </p>

              </div>

            </div>

          )}


          {/* ================= AUTO REPLY ================= */}

          <div className="ai-auto-reply">

            <div className="ai-result-header">

              <div>

                <h3>
                  💬 AI Auto Reply
                </h3>

                <p>
                  Generate a professional
                  response for this customer.
                </p>

              </div>

              <span className="ai-ready-badge">
                ✨ AI
              </span>

            </div>


            <button
              className="new-ticket"
              onClick={generateAutoReply}
              disabled={replyLoading}
            >
              {replyLoading
                ? "Generating Reply..."
                : "🤖 Generate Auto Reply"}
            </button>


            {aiReply && (

              <div className="ai-reply">

                <div>

                  <h4>
                    ✨ Suggested Reply
                  </h4>

                  <textarea
                    value={aiReply}
                    onChange={(event) =>
                      setAiReply(
                        event.target.value
                      )
                    }
                    rows={8}
                    placeholder="AI generated reply will appear here..."
                  />

                </div>


                <div
                  className="ai-reply-actions"
                >

                  <button
  className="copy-btn"
  onClick={copyReply}
>
  📋 Copy Reply
</button>

<button
  className="new-ticket"
  onClick={saveAIReply}
  disabled={saveLoading}
>
  {saveLoading
    ? "Saving..."
    : "💾 Save Reply"}
</button>
                    
                    
                  
                    
                  

                </div>

              </div>

            )}

          </div>

        </div>

      </section>

    </div>
  );
}

export default TicketDetails;
