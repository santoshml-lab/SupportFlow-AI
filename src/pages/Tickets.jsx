import { useState } from "react";
import TicketDetails from "./TicketDetails";
import ticketsData from "../data/ticketsData";


    
    

function Tickets() {
  const [search, setSearch] = useState("");
const [status, setStatus] = useState("All");
const [priority, setPriority] = useState("All");
const [selectedTicket, setSelectedTicket] = useState(null);
  
  
    

  const filteredTickets = ticketsData.filter((ticket) => {
    const matchesSearch =
      ticket.customer.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "All" || ticket.status === status;

    const matchesPriority =
      priority === "All" || ticket.priority === priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

    if (selectedTicket) {
  return (
    <TicketDetails
      ticket={selectedTicket}
      onBack={() => setSelectedTicket(null)}
      onViewCustomer={(customerId) => {
  onViewCustomer(customerId);
}}
        
      
    />
  );
    }

  return (
    <div className="tickets-page">

      <div className="page-header">
        <div>
          <h1>Tickets</h1>
          <p>Manage and monitor customer support tickets</p>
        </div>

        <button className="new-ticket">
          + New Ticket
        </button>
      </div>

      <div className="ticket-toolbar">

        <input
          type="text"
          placeholder="🔍 Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

      </div>

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
  onClick={() => setSelectedTicket(ticket)}
  className="ticket-row"
>

                <td>
                  <strong>{ticket.id}</strong>
                </td>

                <td>
                  <div className="customer">
                    <div className="avatar small">
                      {ticket.customer
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </div>

                    <div>
                      <strong>{ticket.customer}</strong>
                      <span>{ticket.email}</span>
                    </div>
                  </div>
                </td>

                <td>{ticket.subject}</td>

                <td>{ticket.category}</td>

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

        {filteredTickets.length === 0 && (
          <div className="empty-state">
            No tickets found.
          </div>
        )}

      </div>

    </div>
  );
}

export default Tickets;
