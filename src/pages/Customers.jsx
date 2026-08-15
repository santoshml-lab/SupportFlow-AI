import { useEffect, useState } from "react";
import CustomerDetails from "./CustomerDetails";
import { supabase } from "../lib/supabase";

function Customers({ selectedCustomerId, onCustomerSelected }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH CUSTOMERS + TICKETS FROM SUPABASE
  // ==========================================

  const fetchCustomers = async () => {
    setLoading(true);

    try {
      // -------------------------------
      // FETCH CUSTOMERS
      // -------------------------------

      const { data: customerData, error: customerError } =
        await supabase
          .from("customers")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (customerError) {
        throw customerError;
      }

      // -------------------------------
      // FETCH TICKETS
      // -------------------------------

      const { data: ticketData, error: ticketError } =
        await supabase
          .from("tickets")
          .select("id, customer_id, status");

      if (ticketError) {
        throw ticketError;
      }

      const tickets = ticketData || [];

      // ==========================================
      // CONNECT TICKETS WITH CUSTOMERS
      // ==========================================

      const formattedCustomers = (customerData || []).map(
        (customer) => {
          // All tickets belonging to this customer
          const customerTickets = tickets.filter(
            (ticket) =>
              ticket.customer_id === customer.id
          );

          // Open + In Progress tickets
          const customerOpenTickets =
            customerTickets.filter((ticket) => {
              const status =
                ticket.status?.toLowerCase();

              return (
                status === "open" ||
                status === "in progress"
              );
            });

          return {
            ...customer,

            // REAL DATABASE COUNTS
            tickets: customerTickets.length,

            openTickets:
              customerOpenTickets.length,

            status: "Active",
          };
        }
      );

      setCustomers(formattedCustomers);
    } catch (error) {
      console.error(
        "Supabase customer/ticket fetch error:",
        error
      );

      alert(
        `Could not load customer data:\n${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ==========================================
  // SELECT CUSTOMER FROM TICKET
  // ==========================================

  useEffect(() => {
    if (!selectedCustomerId) return;

    const customer = customers.find(
      (customer) =>
        customer.id === selectedCustomerId
    );

    if (customer) {
      setSelectedCustomer(customer);
    }
  }, [selectedCustomerId, customers]);

  // ==========================================
  // CUSTOMER DETAILS
  // ==========================================

  if (selectedCustomerId) {
    const customer = customers.find(
      (customer) =>
        customer.id === selectedCustomerId
    );

    if (customer) {
      return (
        <CustomerDetails
          customer={customer}
          onBack={() => {
            setSelectedCustomer(null);

            if (onCustomerSelected) {
              onCustomerSelected();
            }
          }}
          onEdit={() => {
            openEditModal(customer);
          }}
        />
      );
    }
  }

  if (selectedCustomer) {
    return (
      <CustomerDetails
        customer={selectedCustomer}
        onBack={() => setSelectedCustomer(null)}
        onEdit={() =>
          openEditModal(selectedCustomer)
        }
      />
    );
  }

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredCustomers = customers.filter(
    (customer) => {
      const query = search.toLowerCase();

      return (
        customer.name
          ?.toLowerCase()
          .includes(query) ||
        customer.email
          ?.toLowerCase()
          .includes(query) ||
        customer.id
          ?.toLowerCase()
          .includes(query)
      );
    }
  );

  // ==========================================
  // STATS
  // ==========================================

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) =>
      customer.status === "Active"
  ).length;

  const totalTickets = customers.reduce(
    (total, customer) =>
      total + (customer.tickets || 0),
    0
  );

  const openTickets = customers.reduce(
    (total, customer) =>
      total + (customer.openTickets || 0),
    0
  );

  // ==========================================
  // ADD CUSTOMER
  // ==========================================

  const openAddModal = () => {
    setEditingCustomer(null);

    setForm({
      name: "",
      email: "",
      phone: "",
    });

    setShowModal(true);
  };

  // ==========================================
  // EDIT CUSTOMER
  // ==========================================

  function openEditModal(customer) {
    setEditingCustomer(customer);

    setForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
    });

    setShowModal(true);
  }

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShowModal(false);
    setEditingCustomer(null);

    setForm({
      name: "",
      email: "",
      phone: "",
    });
  };

  // ==========================================
  // SAVE CUSTOMER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim()
    ) {
      alert(
        "Please enter customer name and email."
      );
      return;
    }

    try {
      // ======================================
      // EDIT CUSTOMER
      // ======================================

      if (editingCustomer) {
        const { data, error } = await supabase
          .from("customers")
          .update({
            name: form.name.trim(),
            email: form.email.trim(),
            phone:
              form.phone.trim() || null,
          })
          .eq("id", editingCustomer.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setCustomers((currentCustomers) =>
          currentCustomers.map((customer) =>
            customer.id === editingCustomer.id
              ? {
                  ...data,
                  tickets:
                    editingCustomer.tickets || 0,
                  openTickets:
                    editingCustomer.openTickets || 0,
                  status:
                    editingCustomer.status ||
                    "Active",
                }
              : customer
          )
        );

        alert(
          "Customer updated successfully!"
        );

        closeModal();
        return;
      }

      // ======================================
      // ADD CUSTOMER
      // ======================================

      const { data, error } = await supabase
        .from("customers")
        .insert([
          {
            name: form.name.trim(),
            email: form.email.trim(),
            phone:
              form.phone.trim() || null,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newCustomer = {
        ...data,
        tickets: 0,
        openTickets: 0,
        status: "Active",
      };

      setCustomers((currentCustomers) => [
        newCustomer,
        ...currentCustomers,
      ]);

      alert(
        "Customer saved successfully!"
      );

      closeModal();
    } catch (error) {
      console.error(
        "Customer database error:",
        error
      );

      alert(
        `Could not save customer database:\n${error.message}`
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="customers-page">
        <div className="page-header">
          <div>
            <h1>Customers</h1>
            <p>Loading customers...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="customers-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <h1>Customers</h1>

          <p>
            Manage and monitor your customer
            relationships
          </p>
        </div>

        <button
          className="new-ticket"
          onClick={openAddModal}
        >
          + Add Customer
        </button>

      </div>

      {/* STATS */}

      <section className="stats">

        <div className="stat-card">

          <div className="stat-icon blue">
            👥
          </div>

          <div>
            <span>Total Customers</span>
            <h2>{totalCustomers}</h2>

            <small>
              Registered customers
            </small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon green">
            ✓
          </div>

          <div>
            <span>Active Customers</span>
            <h2>{activeCustomers}</h2>

            <small>
              Currently active
            </small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon orange">
            🎫
          </div>

          <div>
            <span>Total Tickets</span>
            <h2>{totalTickets}</h2>

            <small>
              Customer support tickets
            </small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon red">
            🚨
          </div>

          <div>
            <span>Open Tickets</span>
            <h2>{openTickets}</h2>

            <small>
              Needs attention
            </small>
          </div>

        </div>

      </section>

      {/* SEARCH */}

      <div className="customer-toolbar">

        <input
          type="text"
          placeholder="🔍 Search customers..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* TABLE */}

      <div className="table-card">

        <table>

          <thead>
            <tr>
              <th>Customer</th>
              <th>Customer ID</th>
              <th>Total Tickets</th>
              <th>Open Tickets</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredCustomers.map(
              (customer) => (

                <tr key={customer.id}>

                  <td>

                    <div className="customer">

                      <div className="avatar small">

                        {customer.name
                          ?.split(" ")
                          .map(
                            (name) =>
                              name[0]
                          )
                          .join("")
                          .toUpperCase()}

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

                    <span className="badge open">
                      {customer.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        setSelectedCustomer(
                          customer
                        )
                      }
                    >
                      👁️ View
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditModal(
                          customer
                        )
                      }
                    >
                      ✏️ Edit
                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

        {filteredCustomers.length === 0 && (
          <div className="empty-state">
            No customers found.
          </div>
        )}

      </div>

      {/* ADD / EDIT MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="customer-modal">

            <div className="modal-header">

              <div>

                <h2>
                  {editingCustomer
                    ? "Edit Customer"
                    : "Add Customer"}
                </h2>

                <p>
                  {editingCustomer
                    ? "Update customer information"
                    : "Create a new customer"}
                </p>

              </div>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label>
                  Customer Name
                </label>

                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="customer@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                />

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="new-ticket"
                >
                  {editingCustomer
                    ? "Save Changes"
                    : "Add Customer"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Customers;
