import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Analytics tickets error:", error);
      alert(`Could not load analytics: ${error.message}`);
      setLoading(false);
      return;
    }

    setTickets(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="page-header">
          <div>
            <h1>Analytics</h1>
            <p>Loading support analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const criticalPriority = tickets.filter(
    (ticket) => ticket.priority === "Critical"
  ).length;

  const highPriority = tickets.filter(
    (ticket) => ticket.priority === "High"
  ).length;

  const mediumPriority = tickets.filter(
    (ticket) => ticket.priority === "Medium"
  ).length;

  const lowPriority = tickets.filter(
    (ticket) => ticket.priority === "Low"
  ).length;

  const billingTickets = tickets.filter(
    (ticket) => ticket.category === "Billing"
  ).length;

  const accountTickets = tickets.filter(
    (ticket) => ticket.category === "Account"
  ).length;

  const technicalTickets = tickets.filter(
    (ticket) => ticket.category === "Technical"
  ).length;

  const generalTickets = tickets.filter(
    (ticket) => ticket.category === "General"
  ).length;

  const getPercentage = (value) => {
    if (!totalTickets) return 0;

    return Math.round((value / totalTickets) * 100);
  };

  // ===============================
  // CHART DATA
  // ===============================

  const statusData = [
    {
      name: "Open",
      tickets: openTickets,
    },
    {
      name: "In Progress",
      tickets: inProgressTickets,
    },
    {
      name: "Resolved",
      tickets: resolvedTickets,
    },
  ];

  const priorityData = [
    {
      name: "Critical",
      tickets: criticalPriority,
    },
    {
      name: "High",
      tickets: highPriority,
    },
    {
      name: "Medium",
      tickets: mediumPriority,
    },
    {
      name: "Low",
      tickets: lowPriority,
    },
  ];

  const categoryData = [
    {
      name: "Billing",
      value: billingTickets,
    },
    {
      name: "Account",
      value: accountTickets,
    },
    {
      name: "Technical",
      value: technicalTickets,
    },
    {
      name: "General",
      value: generalTickets,
    },
  ].filter((item) => item.value > 0);

  const PIE_COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
  ];

  return (
    <div className="analytics-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">
        <div>
          <h1>Analytics</h1>

          <p>
            Support performance and ticket insights
          </p>
        </div>
      </div>


      {/* ================= OVERVIEW ================= */}

      <section className="stats">

        <div className="stat-card">

          <div className="stat-icon blue">
            🎫
          </div>

          <div>
            <span>Total Tickets</span>

            <h2>
              {totalTickets}
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
              {openTickets}
            </h2>

            <small>
              Needs attention
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon orange">
            ⏳
          </div>

          <div>
            <span>In Progress</span>

            <h2>
              {inProgressTickets}
            </h2>

            <small>
              Currently being handled
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
              {resolvedTickets}
            </h2>

            <small>
              Successfully resolved
            </small>
          </div>

        </div>

      </section>


      {/* ================= CHARTS ================= */}

      <div className="analytics-grid">

        {/* STATUS CHART */}

        <section className="analytics-card">

          <div className="section-header">

            <div>
              <h2>
                📊 Ticket Status
              </h2>

              <p>
                Current support workload
              </p>
            </div>

          </div>


          <div
            className="analytics-chart"
            style={{ width: "100%", height: 300 }}
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={statusData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                />

                <XAxis
                  dataKey="name"
                  stroke="#aaa"
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#aaa"
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="tickets"
                  name="Tickets"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>


        {/* PRIORITY CHART */}

        <section className="analytics-card">

          <div className="section-header">

            <div>
              <h2>
                🎯 Priority Breakdown
              </h2>

              <p>
                Ticket urgency distribution
              </p>
            </div>

          </div>


          <div
            className="analytics-chart"
            style={{ width: "100%", height: 300 }}
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={priorityData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                />

                <XAxis
                  dataKey="name"
                  stroke="#aaa"
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#aaa"
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="tickets"
                  name="Tickets"
                  fill="#f59e0b"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>


        {/* CATEGORY CHART */}

        <section className="analytics-card">

          <div className="section-header">

            <div>
              <h2>
                📁 Ticket Categories
              </h2>

              <p>
                Customer issue distribution
              </p>
            </div>

          </div>


          <div
            className="analytics-chart"
            style={{ width: "100%", height: 300 }}
          >

            {categoryData.length === 0 ? (

              <div className="empty-state">
                No category data available.
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >

                    {categoryData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            PIE_COLORS[
                              index %
                              PIE_COLORS.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            )}

          </div>

        </section>


        {/* PERFORMANCE */}

        <section className="analytics-card">

          <div className="section-header">

            <div>
              <h2>
                ⚡ Support Performance
              </h2>

              <p>
                Overall ticket resolution metrics
              </p>
            </div>

          </div>


          <div className="performance-box">

            <div>

              <span>
                Resolution Rate
              </span>

              <strong>
                {totalTickets
                  ? Math.round(
                      (resolvedTickets /
                        totalTickets) *
                        100
                    )
                  : 0}
                %
              </strong>

            </div>


            <div>

              <span>
                Active Workload
              </span>

              <strong>
                {openTickets +
                  inProgressTickets}
              </strong>

            </div>


            <div>

              <span>
                High Risk Tickets
              </span>

              <strong>
                {criticalPriority +
                  highPriority}
              </strong>

            </div>

          </div>


          {/* STATUS SUMMARY */}

          <div className="analytics-list">

            <div className="analytics-row">

              <div>
                <span>Open</span>
                <strong>
                  {openTickets}
                </strong>
              </div>

              <div className="progress-track">

                <div
                  className="progress-fill blue-fill"
                  style={{
                    width: `${getPercentage(
                      openTickets
                    )}%`,
                  }}
                />

              </div>

              <small>
                {getPercentage(
                  openTickets
                )}
                %
              </small>

            </div>


            <div className="analytics-row">

              <div>
                <span>In Progress</span>

                <strong>
                  {inProgressTickets}
                </strong>
              </div>

              <div className="progress-track">

                <div
                  className="progress-fill orange-fill"
                  style={{
                    width: `${getPercentage(
                      inProgressTickets
                    )}%`,
                  }}
                />

              </div>

              <small>
                {getPercentage(
                  inProgressTickets
                )}
                %
              </small>

            </div>


            <div className="analytics-row">

              <div>
                <span>Resolved</span>

                <strong>
                  {resolvedTickets}
                </strong>
              </div>

              <div className="progress-track">

                <div
                  className="progress-fill green-fill"
                  style={{
                    width: `${getPercentage(
                      resolvedTickets
                    )}%`,
                  }}
                />

              </div>

              <small>
                {getPercentage(
                  resolvedTickets
                )}
                %
              </small>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Analytics;
