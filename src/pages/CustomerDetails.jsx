import { useState } from "react";

function CustomerDetails({ customer, onBack, onEdit }) {
  const [showTickets, setShowTickets] = useState(true);

  if (!customer) {
    return (
      <div className="page-placeholder">
        <h1>Customer not found</h1>

        <button
          className="new-ticket"
          onClick={onBack}
        >
          ← Back to Customers
        </button>
      </div>
    );
  }

  const initials = customer.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  const tickets = [
    {
      id: "TKT-2041",
      subject: "Duplicate subscription charge",
      category: "Billing",
      priority: "High",
      status: "Open",
    },
    {
      id: "TKT-1987",
      subject: "Payment confirmation issue",
      category: "Billing",
      priority: "Medium",
      status: "Resolved",
    },
    {
      id: "TKT-1874",
      subject: "Unable to update payment method",
      category: "Account",
      priority: "Low",
      status: "Resolved",
    },
  ];

  return (
    <div className="customer-details-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <button
            className="back-btn"
            onClick={onBack}
          >
            ← Back to Customers
          </button>

          <h1>Customer Details</h1>

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


      {/* ================= CUSTOMER PROFILE ================= */}

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

          <span>Customer ID</span>

          <strong>
            {customer.id}
          </strong>

        </div>

      </section>


      {/* ================= CUSTOMER STATS ================= */}

      <section className="stats">

        <div className="stat-card">

          <div className="stat-icon blue">
            🎫
          </div>

          <div>
            <span>Total Tickets</span>

            <h2>
              {customer.tickets}
            </h2>

            <small>
              All support requests
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon red">
            🚨
          </div>

          <div>
            <span>Open Tickets</span>

            <h2>
              {customer.openTickets}
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
            <span>Resolved</span>

            <h2>
              {customer.tickets - customer.openTickets}
            </h2>

            <small>
              Successfully resolved
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon orange">
            👤
          </div>

          <div>
            <span>Account Status</span>

            <h2>
              {customer.status}
            </h2>

            <small>
              Current status
            </small>
          </div>

        </div>

      </section>


      {/* ================= TICKETS ================= */}

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


        {showTickets && (

          <div className="table-card">

            <table>

              <thead>

                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {tickets.map((ticket) => (

                  <tr key={ticket.id}>

                    <td>
                      <strong>
                        {ticket.id}
                      </strong>
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
                          ticket.priority === "High"
                            ? "high"
                            : ticket.priority === "Medium"
                            ? "medium"
                            : "open"
                        }`}
                      >
                        {ticket.priority}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`badge ${
                          ticket.status === "Open"
                            ? "open"
                            : "progress"
                        }`}
                      >
                        {ticket.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default CustomerDetails;
