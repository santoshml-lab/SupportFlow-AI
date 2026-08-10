import { useState } from "react";

const customersData = [
  {
    id: "CUS-1001",
    name: "John Doe",
    email: "john@example.com",
    tickets: 8,
    openTickets: 2,
    status: "Active",
  },
  {
    id: "CUS-1002",
    name: "Alex Smith",
    email: "alex@example.com",
    tickets: 5,
    openTickets: 1,
    status: "Active",
  },
  {
    id: "CUS-1003",
    name: "Maria Khan",
    email: "maria@example.com",
    tickets: 12,
    openTickets: 4,
    status: "Active",
  },
  {
    id: "CUS-1004",
    name: "David Lee",
    email: "david@example.com",
    tickets: 3,
    openTickets: 0,
    status: "Inactive",
  },
  {
    id: "CUS-1005",
    name: "Emma Wilson",
    email: "emma@example.com",
    tickets: 7,
    openTickets: 2,
    status: "Active",
  },
  {
    id: "CUS-1006",
    name: "Ryan Brown",
    email: "ryan@example.com",
    tickets: 4,
    openTickets: 0,
    status: "Active",
  },
];

function Customers() {
  const [search, setSearch] = useState("");

  const filteredCustomers = customersData.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.id.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalCustomers = customersData.length;

  const activeCustomers = customersData.filter(
    (customer) => customer.status === "Active"
  ).length;

  const totalTickets = customersData.reduce(
    (total, customer) => total + customer.tickets,
    0
  );

  const openTickets = customersData.reduce(
    (total, customer) => total + customer.openTickets,
    0
  );

  return (
    <div className="customers-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <h1>Customers</h1>
          <p>
            Manage and monitor your customer relationships
          </p>
        </div>

        <button className="new-ticket">
          + Add Customer
        </button>

      </div>


      {/* ================= CUSTOMER STATS ================= */}

      <section className="stats">

        <div className="stat-card">

          <div className="stat-icon blue">
            👥
          </div>

          <div>
            <span>Total Customers</span>
            <h2>{totalCustomers}</h2>
            <small>Registered customers</small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon green">
            ✓
          </div>

          <div>
            <span>Active Customers</span>
            <h2>{activeCustomers}</h2>
            <small>Currently active</small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon orange">
            🎫
          </div>

          <div>
            <span>Total Tickets</span>
            <h2>{totalTickets}</h2>
            <small>Customer support tickets</small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon red">
            🚨
          </div>

          <div>
            <span>Open Tickets</span>
            <h2>{openTickets}</h2>
            <small>Needs attention</small>
          </div>

        </div>

      </section>


      {/* ================= SEARCH ================= */}

      <div className="customer-toolbar">

        <input
          type="text"
          placeholder="🔍 Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {/* ================= CUSTOMER TABLE ================= */}

      <div className="table-card">

        <table>

          <thead>

            <tr>

              <th>Customer</th>

              <th>Customer ID</th>

              <th>Total Tickets</th>

              <th>Open Tickets</th>

              <th>Status</th>

            </tr>

          </thead>


          <tbody>

            {filteredCustomers.map((customer) => (

              <tr key={customer.id}>

                <td>

                  <div className="customer">

                    <div className="avatar small">

                      {customer.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}

                    </div>

                    <div>

                      <strong>
                        {customer.name}
                      </strong>

                      <span>
                        {customer.email}
                      </span>

                    </div>

                  </div>

                </td>


                <td>

                  <strong>
                    {customer.id}
                  </strong>

                </td>


                <td>
                  {customer.tickets}
                </td>


                <td>
                  {customer.openTickets}
                </td>


                <td>

                  <span
                    className={`badge ${
                      customer.status === "Active"
                        ? "open"
                        : "progress"
                    }`}
                  >
                    {customer.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>


        {filteredCustomers.length === 0 && (

          <div className="empty-state">
            No customers found.
          </div>

        )}

      </div>

    </div>
  );
}

export default Customers;
