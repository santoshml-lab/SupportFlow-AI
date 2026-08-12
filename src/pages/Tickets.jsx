import { useEffect, useState } from "react";
import TicketDetails from "./TicketDetails";
import { supabase } from "../lib/supabase";

function Tickets({ onViewCustomer }) {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH TICKETS FROM SUPABASE
     ========================================================= */

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("tickets")
      .select(`
        *,
        customers (
          id,
          name,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tickets:", error);
      setError("Unable to load tickets.");
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
        ticket.category || "General",

      priority:
        formatText(ticket.priority || "medium"),

      status:
        formatStatus(ticket.status || "open"),

      sentiment:
        ticket.sentiment || "",

      ai_summary:
        ticket.ai_summary || "",

      ai_suggested_rep:
        ticket.ai_suggested_rep || "",

      assigned_to:
        ticket.assigned_to,

      created_at:
        ticket.created_at,
    }));

    setTickets(formattedTickets);
    setLoading(false);
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
     FILTER TICKETS
     ========================================================= */

  const filteredTickets = tickets.filter((ticket) => {
    const query = search.toLowerCase();

    const matchesSearch =
      ticket.customer.toLowerCase().includes(query) ||
      ticket.subject.toLowerCase().includes(query) ||
      ticket.id.toLowerCase().includes(query);

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
     TICKET DETAILS
     ========================================================= */

  if (selectedTicket) {
    return (
      <TicketDetails
        ticket={selectedTicket}

        onBack={() =>
          setSelectedTicket(null)
        }

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

        <button className="new-ticket">
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

                {/* ================= TICKET ================= */}

                <td>

                  <strong>
                    {ticket.id}
                  </strong>

                </td>


                {/* ================= CUSTOMER ================= */}

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


                {/* ================= SUBJECT ================= */}

                <td>
                  {ticket.subject}
                </td>


                {/* ================= CATEGORY ================= */}

                <td>
                  {ticket.category}
                </td>


                {/* ================= PRIORITY ================= */}

                <td>

                  <span
                    className={`badge ${ticket.priority.toLowerCase()}`}
                  >
                    {ticket.priority}
                  </span>

                </td>


                {/* ================= STATUS ================= */}

                <td>

                  <span
                    className={`badge ${
                      ticket.status === "In Progress"
                        ? "progress"
                        : ticket.status === "Resolved"
                        ? "open"
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


        {/* ================= EMPTY ================= */}

        {filteredTickets.length === 0 && !error && (

          <div className="empty-state">
            No tickets found.
          </div>

        )}

      </div>

    </div>
  );
}

export default Tickets;
