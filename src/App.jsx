import { useState } from "react";
import Tickets from "./pages/Tickets";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            S
          </div>

          <div>
            <h2>SupportFlow</h2>
            <span>AI Support Platform</span>
          </div>

        </div>


        <nav className="navigation">

          {/* DASHBOARD */}

          <button
            className={`nav-item ${
              page === "dashboard" ? "active" : ""
            }`}
            onClick={() => {
              setPage("dashboard");
              setSelectedCustomerId(null);
            }}
          >
            <span>📊</span>
            Dashboard
          </button>


          {/* TICKETS */}

          <button
            className={`nav-item ${
              page === "tickets" ? "active" : ""
            }`}
            onClick={() => {
              setPage("tickets");
              setSelectedCustomerId(null);
            }}
          >
            <span>🎫</span>
            Tickets
          </button>


          {/* CUSTOMERS */}

          <button
            className={`nav-item ${
              page === "customers" ? "active" : ""
            }`}
            onClick={() => {
              setPage("customers");
              setSelectedCustomerId(null);
            }}
          >
            <span>👥</span>
            Customers
          </button>


          {/* ANALYTICS */}

          <button
            className={`nav-item ${
              page === "analytics" ? "active" : ""
            }`}
            onClick={() => {
              setPage("analytics");
              setSelectedCustomerId(null);
            }}
          >
            <span>📈</span>
            Analytics
          </button>

        </nav>


        {/* ================= SIDEBAR BOTTOM ================= */}

        <div className="sidebar-bottom">

          <button
            className={`nav-item ${
              page === "settings" ? "active" : ""
            }`}
            onClick={() => {
              setPage("settings");
              setSelectedCustomerId(null);
            }}
          >
            <span>⚙️</span>
            Settings
          </button>


          <div className="profile-mini">

            <div className="avatar">
              SA
            </div>

            <div>
              <strong>Support Admin</strong>
              <span>Administrator</span>
            </div>

          </div>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="main">


        {/* ================= DASHBOARD ================= */}

        {page === "dashboard" && (

          <Dashboard
            onViewTickets={() => {
              setPage("tickets");
              setSelectedCustomerId(null);
            }}
          />

        )}


        {/* ================= TICKETS ================= */}

        {page === "tickets" && (

          <Tickets
            onViewCustomer={(customerId) => {
              setSelectedCustomerId(customerId);
              setPage("customers");
            }}
          />

        )}


        {/* ================= CUSTOMERS ================= */}

        {page === "customers" && (

          <Customers
            selectedCustomerId={selectedCustomerId}
            onCustomerSelected={() =>
              setSelectedCustomerId(null)
            }
          />

        )}


        {/* ================= ANALYTICS ================= */}

        {page === "analytics" && (

          <Analytics />

        )}


        {/* ================= SETTINGS ================= */}

        {page === "settings" && (

          <div className="page-placeholder">

            <h1>⚙️ Settings</h1>

            <p>
              Platform settings coming next.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default App;
