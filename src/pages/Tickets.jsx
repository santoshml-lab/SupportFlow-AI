import { useEffect, useState } from "react";
import TicketDetails from "./TicketDetails";
import { supabase } from "../lib/supabase";

function Tickets({ onViewCustomer }) {
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");

  const [selectedTicket, setSelectedTicket] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showNewTicket, setShowNewTicket] = useState(false);
  const [savingTicket, setSavingTicket] = useState(false);

  const [form, setForm] = useState({
    customer_id: "",
    subject: "",
    status: "open",
    priority: "medium",
    category: "Billing",
    sentiment: "neutral",
    ai_summary: "",
    ai_suggested_reply: "",
  });

  /* =========================================================
     FETCH TICKETS
     ========================================================= */

  useEffect(() => {
    fetchTickets();
    fetchCustomers();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");

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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tickets:", error);
      setError(error.message);
      setTickets([]);
      setLoading(false);
      return;
    }

    const formattedTickets = (data || []).map((ticket) => ({
      id: ticket.id,
      customer_id: ticket.customer_id,

      customer:
        ticket.customers?.name || "Unknown Customer",

      email:
        ticket.customers?.email || "",

      subject:
        ticket.subject || "No subject",

      category:
        formatText(ticket.category || "General"),

      priority:
        formatText(ticket.priority || "medium"),

      status:
        formatStatus(ticket.status || "open"),

      sentiment:
        ticket.sentiment || "",

      ai_summary:
        ticket.ai_summary || "",

      ai_suggested_reply:
        ticket.ai_suggested_reply || "",

      assigned_to:
        ticket.assigned_to,

      created_at:
        ticket.created_at,
    }));

    setTickets(formattedTickets);
    setLoading(false);
  };

  /* =========================================================
     FETCH CUSTOMERS
     ========================================================= */

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("id, name, email")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching customers:", error);
      return;
    }

    setCustomers(data || []);
  };

  /* =========================================================
     FORMAT HELPERS
     ========================================================= */

  const formatText = (value) => {
    if (!value) return "";

    return value
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatStatus = (value) => {
    if (!value) return "Open";

    return value
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  /* =========================================================
     FILTER
     ========================================================= */

  const filteredTickets = tickets.filter((ticket) => {
    const query = search.toLowerCase();

    const matchesSearch =
      ticket.customer.toLowerCase().includes(query) ||
      ticket.subject.toLowerCase().includes(query) ||
      ticket.id.toString().toLowerCase().includes(query);

    const matchesStatus =
      status === "All" ||
      ticket.status === status;

    const matchesPriority =
      priority === "All" ||
      ticket.priority === priority;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  /* =========================================================
     OPEN NEW TICKET
     ========================================================= */

  const openNewTicket = () => {
    setError("");

    setForm({
      customer_id: "",
      subject: "",
      status: "open",
      priority: "medium",
      category: "Billing",
      sentiment: "neutral",
      ai_summary: "",
      ai_suggested_reply: "",
    });

    setShowNewTicket(true);
  };

  /* =========================================================
     CLOSE NEW TICKET
     ========================================================= */

  const closeNewTicket = () => {
    if (savingTicket) return;

    setShowNewTicket(false);
  };

  /* =========================================================
     SAVE NEW TICKET TO SUPABASE
     ========================================================= */

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.customer_id) {
      setError("Please select a customer.");
      return;
    }

    if (!form.subject.trim()) {
      setError("Please enter a ticket subject.");
      return;
    }

    setSavingTicket(true);

    const { error } = await supabase
      .from("tickets")
      .insert({
        customer_id: form.customer_id,

        subject: form.subject.trim(),

        status: form.status,

        priority: form.priority,

        category: form.category,

        sentiment: form.sentiment,

        ai_summary:
          form.ai_summary.trim() || null,

        ai_suggested_reply:
          form.ai_suggested_reply.trim() || null,

        assigned_to: null,
      });

    if (error) {
      console.error("Error creating ticket:", error);

      setError(
        `Could not save ticket: ${error.message}`
      );

      setSavingTicket(false);
      return;
    }

    /* Refresh tickets from database */
    await fetchTickets();

    setSavingTicket(false);
    setShowNewTicket(false);

    /* Reset form */
    setForm({
      customer_id: "",
      subject: "",
      status: "open",
      priority: "medium",
      category: "Billing",
      sentiment: "neutral",
      ai_summary: "",
      ai_suggested_reply: "",
    });
  };

  /* =========================================================
     TICKET DETAILS
     ========================================================= */

  if (selectedTicket) {
    return (
      <TicketDetails
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
        onViewCustomer={(customerId) => {
          if (onViewCustomer) {
            onViewCustomer(customerId);
          }
        }}
      />
    );
  }

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="tickets-page">

        <div className="page-header">
          <div>
            <h1>Tickets</h1>
            <p>
              Manage and monitor customer support tickets
            </p>
          </div>
        </div>

        <div className="tickets-page-card">
          <div className="empty-state">
            Loading tickets...
          </div>
        </div>

      </div>
    );
  }

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <div className="tickets-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <h1>Tickets</h1>

          <p>
            Manage and monitor customer support tickets
          </p>
        </div>

        <button
          className="new-ticket"
          onClick={openNewTicket}
        >
          + New Ticket
        </button>

      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <div className="empty-state">
          {error}
        </div>
      )}


      {/* ================= TOOLBAR ================= */}

      <div className="ticket-toolbar">

        <input
          type="text"
          placeholder="🔍 Search tickets..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Open">
            Open
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Resolved">
            Resolved
          </option>
        </select>

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option value="All">
            All Priority
          </option>

          <option value="Critical">
            Critical
          </option>

          <option value="High">
            High
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Low">
            Low
          </option>
        </select>

      </div>


      {/* ================= TICKETS TABLE ================= */}

      <div className="tickets-page-card">

        <table>

          <thead>

            <tr>
              <th>Ticket</th>
              <th>Customer</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {filteredTickets.map((ticket) => (

              <tr
                key={ticket.id}
                onClick={() =>
                  setSelectedTicket(ticket)
                }
                className="ticket-row"
              >

                <td>
                  <strong title={ticket.id}>
  {ticket.id.slice(0, 8)}...
</strong>
                    
                  
                </td>

                <td>

                  <div className="customer">

                    <div className="avatar small">

                      {ticket.customer
                        .split(" ")
                        .map(
                          (name) => name[0]
                        )
                        .join("")
                        .slice(0, 2)}

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
                    className={`badge ${
                      ticket.priority.toLowerCase()
                    }`}
                  >
                    {ticket.priority}
                  </span>

                </td>

                <td>

                  <span
                    className={`badge ${
                      ticket.status === "In Progress"
                        ? "progress"
                        : "open"
                    }`}
                  >
                    {ticket.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {filteredTickets.length === 0 && !error && (

          <div className="empty-state">
            No tickets found.
          </div>

        )}

      </div>


      {/* =====================================================
          NEW TICKET MODAL
         ===================================================== */}

      {showNewTicket && (

        <div className="modal-overlay">

          <div className="customer-modal">

            <div className="modal-header">

              <div>

                <h2>
                  New Ticket
                </h2>

                <p>
                  Create a new support ticket
                </p>

              </div>

              <button
                className="modal-close"
                onClick={closeNewTicket}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleCreateTicket}>

              {/* CUSTOMER */}

              <div className="form-group">

                <label>
                  Customer
                </label>

                <select
                  value={form.customer_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customer_id: e.target.value,
                    })
                  }
                  required
                >

                  <option value="">
                    Select customer
                  </option>

                  {customers.map((customer) => (

                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.name} — {customer.email}
                    </option>

                  ))}

                </select>

              </div>


              {/* SUBJECT */}

              <div className="form-group">

                <label>
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="e.g. Duplicate subscription charge"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  required
                />

              </div>


              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                >

                  <option value="Billing">
                    Billing
                  </option>

                  <option value="Technical">
                    Technical
                  </option>

                  <option value="Account">
                    Account
                  </option>

                  <option value="Subscription">
                    Subscription
                  </option>

                  <option value="General">
                    General
                  </option>

                </select>

              </div>


              {/* PRIORITY */}

              <div className="form-group">

                <label>
                  Priority
                </label>

                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value,
                    })
                  }
                >

                  <option value="critical">
                    Critical
                  </option>

                  <option value="high">
                    High
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="low">
                    Low
                  </option>

                </select>

              </div>


              {/* STATUS */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                >

                  <option value="open">
                    Open
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="resolved">
                    Resolved
                  </option>

                </select>

              </div>


              {/* SENTIMENT */}

              <div className="form-group">

                <label>
                  Sentiment
                </label>

                <select
                  value={form.sentiment}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sentiment: e.target.value,
                    })
                  }
                >

                  <option value="neutral">
                    Neutral
                  </option>

                  <option value="positive">
                    Positive
                  </option>

                  <option value="negative">
                    Negative
                  </option>

                </select>

              </div>


              {/* AI SUMMARY */}

              <div className="form-group">

                <label>
                  AI Summary
                </label>

                <textarea
                  placeholder="Optional AI summary"
                  value={form.ai_summary}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ai_summary: e.target.value,
                    })
                  }
                />

              </div>


              {/* AI SUGGESTED REPLY */}

              <div className="form-group">

                <label>
                  AI Suggested Reply
                </label>

                <textarea
                  placeholder="Optional suggested reply"
                  value={form.ai_suggested_reply}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ai_suggested_reply:
                        e.target.value,
                    })
                  }
                />

              </div>


              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeNewTicket}
                  disabled={savingTicket}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="new-ticket"
                  disabled={savingTicket}
                >
                  {savingTicket
                    ? "Saving..."
                    : "Create Ticket"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Tickets;
