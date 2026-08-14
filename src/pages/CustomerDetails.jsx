import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function CustomerDetails({ customer, onBack, onEdit }) {
  const [showTickets, setShowTickets] = useState(true);

  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [ticketError, setTicketError] = useState("");

  /* =========================================================
     FETCH CUSTOMER TICKETS FROM SUPABASE
     ========================================================= */

  useEffect(() => {
    if (customer?.id) {
      fetchCustomerTickets();
    }
  }, [customer?.id]);

  const fetchCustomerTickets = async () => {
    setLoadingTickets(true);
    setTicketError("");

    const { data, error } = await supabase
      .from("tickets")
      .select(`
        id,
        subject,
        category,
        priority,
        status,
        sentiment,
        ai_summary,
        ai_suggested_reply,
        assigned_to,
        created_at
      `)
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customer tickets:", error);

      setTickets([]);
      setTicketError("Unable to load customer tickets.");
      setLoadingTickets(false);

      return;
    }

    setTickets(data || []);
    setLoadingTickets(false);
  };

  /* =========================================================
     CUSTOMER CHECK
     ========================================================= */

  if (!customer) {
    return (
      <div className="page-placeholder">

        <h1>
          Customer not found
        </h1>

        <button
          className="new-ticket"
          onClick={onBack}
        >
          ← Back to Customers
        </button>

      </div>
    );
  }

  /* =========================================================
     CUSTOMER INITIALS
     ========================================================= */

  const initials = customer.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2);

  /* =========================================================
     REAL DATABASE STATS
     ========================================================= */

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) =>
      ticket.status?.toLowerCase() === "open"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) =>
      ticket.status?.toLowerCase() === "resolved"
  ).length;

  /* =========================================================
     FORMAT HELPERS
     ========================================================= */

  const formatText = (value) => {
    if (!value) return "";

    return value
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "critical";

      case "high":
        return "high";

      case "medium":
        return "medium";

      case "low":
        return "low";

      default:
        return "low";
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "open";

      case "in_progress":
      case "in-progress":
        return "in-progress";

      case "resolved":
        return "resolved";

      default:
        return "open";
    }
  };

  return (
    <div className="customer-details-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="page-header">

        <div>

          <button
            className="back-btn"
            onClick={onBack}
          >
            ← Back to Customers
          </button>

          <h1>
            Customer Details
          </h1>

          <p>
            View customer information and support activity
          </p>

        </div>

        <button
          className="new-ticket"
          onClick={() => onEdit(customer)}
        >
          ✏️ Edit Customer
        </button>

      </div>


      {/* =====================================================
          CUSTOMER PROFILE
          ===================================================== */}

      <section className="customer-profile-card">

        <div className="customer-profile">

          <div className="profile-avatar">
            {initials}
          </div>

          <div>

            <h2>
              {customer.name}
            </h2>

            <p>
              {customer.email}
            </p>

            <span
              className={`badge ${
                customer.status === "Active"
                  ? "open"
                  : "progress"
              }`}
            >
              {customer.status}
            </span>

          </div>

        </div>


        <div className="customer-id">

          <span>
            Customer ID
          </span>

          <strong>
            {customer.id}
          </strong>

        </div>

      </section>


      {/* =====================================================
          CUSTOMER STATS
          ===================================================== */}

      <section className="stats">

        {/* TOTAL TICKETS */}

        <div className="stat-card">

          <div className="stat-icon blue">
            🎫
          </div>

          <div>

            <span>
              Total Tickets
            </span>

            <h2>
              {loadingTickets ? "..." : totalTickets}
            </h2>

            <small>
              All support requests
            </small>

          </div>

        </div>


        {/* OPEN TICKETS */}

        <div className="stat-card">

          <div className="stat-icon red">
            🚨
          </div>

          <div>

            <span>
              Open Tickets
            </span>

            <h2>
              {loadingTickets ? "..." : openTickets}
            </h2>

            <small>
              Needs attention
            </small>

          </div>

        </div>


        {/* RESOLVED */}

        <div className="stat-card">

          <div className="stat-icon green">
            ✓
          </div>

          <div>

            <span>
              Resolved
            </span>

            <h2>
              {loadingTickets ? "..." : resolvedTickets}
            </h2>

            <small>
              Successfully resolved
            </small>

          </div>

        </div>


        {/* ACCOUNT STATUS */}

        <div className="stat-card">

          <div className="stat-icon orange">
            👤
          </div>

          <div>

            <span>
              Account Status
            </span>

            <h2>
              {customer.status}
            </h2>

            <small>
              Current status
            </small>

          </div>

        </div>

      </section>


      {/* =====================================================
          CUSTOMER TICKETS
          ===================================================== */}

      <section className="customer-tickets-section">

        <div className="section-header">

          <div>

            <h2>
              Recent Support Tickets
            </h2>

            <p>
              Latest activity from this customer
            </p>

          </div>

          <button
            className="view-all"
            onClick={() =>
              setShowTickets(!showTickets)
            }
          >
            {showTickets
              ? "Hide Tickets"
              : "Show Tickets"}
          </button>

        </div>


        {/* ===================================================
            TICKETS CONTENT
            =================================================== */}

        {showTickets && (

          <div className="table-card">

            {loadingTickets ? (

              <div className="empty-state">
                Loading tickets...
              </div>

            ) : ticketError ? (

              <div className="empty-state">
                {ticketError}
              </div>

            ) : (

              <>

                <table>

                  <thead>

                    <tr>

                      <th>
                        Ticket ID
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

                    {tickets.map((ticket) => (

                      <tr
                        key={ticket.id}
                      >

                        {/* TICKET ID */}

                        <td>

                          <strong>
                            {ticket.id}
                          </strong>

                        </td>


                        {/* SUBJECT */}

                        <td>
                          {ticket.subject || "No subject"}
                        </td>


                        {/* CATEGORY */}

                        <td>
                          {formatText(
                            ticket.category || "General"
                          )}
                        </td>


                        {/* PRIORITY */}

                        <td>

                          <span
                            className={`priority-badge ${getPriorityClass(
                              ticket.priority
                            )}`}
                          >
                            {formatText(
                              ticket.priority || "Low"
                            )}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`status-badge ${getStatusClass(
                              ticket.status
                            )}`}
                          >
                            {formatText(
                              ticket.status || "Open"
                            )}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>


                {/* NO TICKETS */}

                {tickets.length === 0 && (

                  <div className="empty-state">
                    No tickets found for this customer.
                  </div>

                )}

              </>

            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default CustomerDetails;
