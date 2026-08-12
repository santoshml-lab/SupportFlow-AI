import { useEffect, useState } from "react";
import CustomerDetails from "./CustomerDetails";
import { supabase } from "../lib/supabase";



    
    

function Customers({ selectedCustomerId, onCustomerSelected }) {
  const [customers, setCustomers] = useState([]);
const [search, setSearch] = useState("");
  useEffect(() => {
  const fetchCustomers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customers:", error);
      setLoading(false);
      return;
    }

    setCustomers(data || []);
    setLoading(false);
  };

  fetchCustomers();
}, []);
const [loading, setLoading] = useState(true);
  

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  useEffect(() => {
  if (selectedCustomerId) {
    const customer = customers.find(
      (customer) => customer.id === selectedCustomerId
    );

    if (customer) {
      setSelectedCustomer(customer);
    }
  }
}, [selectedCustomerId, customers]);
  const customerFromTicket = customers.find(
  (customer) => customer.id === selectedCustomerId
);

if (selectedCustomerId && customerFromTicket) {
  return (
    <CustomerDetails
      customer={customerFromTicket}
      onBack={() => {
        onCustomerSelected();
        setSelectedCustomer(null);
      }}
      onEdit={() => {
        setEditingCustomer(customerFromTicket);
        setForm({
          name: customerFromTicket.name,
          email: customerFromTicket.email,
          status: customerFromTicket.status,
        });
        setShowModal(true);
      }}
    />
  );
}

  const [form, setForm] = useState({
    name: "",
    email: "",
    status: "Active",
  });

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.id.toLowerCase().includes(query)
    );
  });

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const totalTickets = customers.reduce(
    (total, customer) => total + customer.tickets,
    0
  );

  const openTickets = customers.reduce(
    (total, customer) => total + customer.openTickets,
    0
  );

  const openAddModal = () => {
    setEditingCustomer(null);

    setForm({
      name: "",
      email: "",
      status: "Active",
    });

    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);

    setForm({
      name: customer.name,
      email: customer.email,
      status: customer.status,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Please enter customer name and email.");
      return;
    }

    if (editingCustomer) {
      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer.id === editingCustomer.id
            ? {
                ...customer,
                name: form.name,
                email: form.email,
                status: form.status,
              }
            : customer
        )
      );
    } else {
      const newCustomer = {
        id: `CUS-${1000 + customers.length + 1}`,
        name: form.name,
        email: form.email,
        tickets: 0,
        openTickets: 0,
        status: form.status,
      };

      setCustomers((currentCustomers) => [
        ...currentCustomers,
        newCustomer,
      ]);
    }

    closeModal();
  };
  if (selectedCustomer) {
  return (
    <CustomerDetails
      customer={selectedCustomer}
      onBack={() => setSelectedCustomer(null)}
      onEdit={() => {
        openEditModal(selectedCustomer);
      }}
    />
  );
  }

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

        <button
          className="new-ticket"
          onClick={openAddModal}
        >
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

            <h2>
              {totalCustomers}
            </h2>

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

            <h2>
              {activeCustomers}
            </h2>

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

            <h2>
              {totalTickets}
            </h2>

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

            <h2>
              {openTickets}
            </h2>

            <small>
              Needs attention
            </small>
          </div>

        </div>

      </section>


      {/* ================= SEARCH ================= */}

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

              <th>Action</th>

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


                <td>

  <button
    className="view-btn"
    onClick={() => setSelectedCustomer(customer)}
  >
    👁️ View
  </button>

  <button
    className="edit-btn"
    onClick={() => openEditModal(customer)}
  >
    ✏️ Edit
  </button>

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


      {/* ================= ADD / EDIT MODAL ================= */}

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
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

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
