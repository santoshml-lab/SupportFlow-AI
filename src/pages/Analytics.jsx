import ticketsData from "../data/ticketsData";

function Analytics() {
  const totalTickets = ticketsData.length;

  const openTickets = ticketsData.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = ticketsData.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = ticketsData.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const highPriority = ticketsData.filter(
    (ticket) => ticket.priority === "High"
  ).length;

  const criticalPriority = ticketsData.filter(
    (ticket) => ticket.priority === "Critical"
  ).length;

  const mediumPriority = ticketsData.filter(
    (ticket) => ticket.priority === "Medium"
  ).length;

  const lowPriority = ticketsData.filter(
    (ticket) => ticket.priority === "Low"
  ).length;

  const billingTickets = ticketsData.filter(
    (ticket) => ticket.category === "Billing"
  ).length;

  const accountTickets = ticketsData.filter(
    (ticket) => ticket.category === "Account"
  ).length;

  const technicalTickets = ticketsData.filter(
    (ticket) => ticket.category === "Technical"
  ).length;

  const generalTickets = ticketsData.filter(
    (ticket) => ticket.category === "General"
  ).length;

  const getPercentage = (value) => {
    if (!totalTickets) return 0;
    return Math.round((value / totalTickets) * 100);
  };

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>
            Support performance and ticket insights
          </p>
        </div>
      </div>


      {/* OVERVIEW */}

      <section className="stats">

        <div className="stat-card">
          <div className="stat-icon blue">
            🎫
          </div>

          <div>
            <span>Total Tickets</span>
            <h2>{totalTickets}</h2>
            <small>All support requests</small>
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


        <div className="stat-card">
          <div className="stat-icon orange">
            ⏳
          </div>

          <div>
            <span>In Progress</span>
            <h2>{inProgressTickets}</h2>
            <small>Currently being handled</small>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon green">
            ✓
          </div>

          <div>
            <span>Resolved</span>
            <h2>{resolvedTickets}</h2>
            <small>Successfully resolved</small>
          </div>
        </div>

      </section>


      {/* ANALYTICS GRID */}

      <div className="analytics-grid">

        {/* STATUS */}

        <section className="analytics-card">

          <div className="section-header">
            <div>
              <h2>Ticket Status</h2>
              <p>Current support workload</p>
            </div>
          </div>


          <div className="analytics-list">

            <div className="analytics-row">
              <div>
                <span>Open</span>
                <strong>{openTickets}</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill blue-fill"
                  style={{
                    width: `${getPercentage(openTickets)}%`,
                  }}
                />
              </div>

              <small>
                {getPercentage(openTickets)}%
              </small>
            </div>


            <div className="analytics-row">
              <div>
                <span>In Progress</span>
                <strong>{inProgressTickets}</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill orange-fill"
                  style={{
                    width: `${getPercentage(inProgressTickets)}%`,
                  }}
                />
              </div>

              <small>
                {getPercentage(inProgressTickets)}%
              </small>
            </div>


            <div className="analytics-row">
              <div>
                <span>Resolved</span>
                <strong>{resolvedTickets}</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill green-fill"
                  style={{
                    width: `${getPercentage(resolvedTickets)}%`,
                  }}
                />
              </div>

              <small>
                {getPercentage(resolvedTickets)}%
              </small>
            </div>

          </div>

        </section>


        {/* PRIORITY */}

        <section className="analytics-card">

          <div className="section-header">
            <div>
              <h2>Priority Breakdown</h2>
              <p>Ticket urgency distribution</p>
            </div>
          </div>


          <div className="analytics-list">

            <div className="analytics-row">
              <div>
                <span>Critical</span>
                <strong>{criticalPriority}</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill critical-fill"
                  style={{
                    width: `${getPercentage(
                      criticalPriority
                    )}%`,
                  }}
                />
              </div>

              <small>
                {getPercentage(criticalPriority)}%
              </small>
            </div>


            <div className="analytics-row">
              <div>
                <span>High</span>
                <strong>{highPriority}</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill red-fill"
                  style={{
                    width: `${getPercentage(
                      highPriority
                    )}%`,
                  }}
                />
              </div>

              <small>
                {getPercentage(highPriority)}%
              </small>
            </div>


            <div className="analytics-row">
              <div>
                <span>Medium</span>
                <strong>{mediumPriority}</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill orange-fill"
                  style={{
                    width: `${getPercentage(
                      mediumPriority
                    )}%`,
                  }}
                />
              </div>

              <small>
                {getPercentage(mediumPriority)}%
              </small>
            </div>


            <div className="analytics-row">
              <div>
                <span>Low</span>
                <strong>{lowPriority}</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill green-fill"
                  style={{
                    width: `${getPercentage(
                      lowPriority
                    )}%`,
                  }}
                />
              </div>

              <small>
                {getPercentage(lowPriority)}%
              </small>
            </div>

          </div>

        </section>


        {/* CATEGORY */}

        <section className="analytics-card">

          <div className="section-header">
            <div>
              <h2>Ticket Categories</h2>
              <p>Customer issue distribution</p>
            </div>
          </div>


          <div className="category-grid">

            <div className="category-box">
              <span>💳 Billing</span>
              <strong>{billingTickets}</strong>
            </div>

            <div className="category-box">
              <span>👤 Account</span>
              <strong>{accountTickets}</strong>
            </div>

            <div className="category-box">
              <span>🛠️ Technical</span>
              <strong>{technicalTickets}</strong>
            </div>

            <div className="category-box">
              <span>💬 General</span>
              <strong>{generalTickets}</strong>
            </div>

          </div>

        </section>


        {/* PERFORMANCE */}

        <section className="analytics-card">

          <div className="section-header">
            <div>
              <h2>Support Performance</h2>
              <p>Overall ticket resolution metrics</p>
            </div>
          </div>


          <div className="performance-box">

            <div>
              <span>Resolution Rate</span>

              <strong>
                {totalTickets
                  ? Math.round(
                      (resolvedTickets / totalTickets) * 100
                    )
                  : 0}
                %
              </strong>
            </div>


            <div>
              <span>Active Workload</span>

              <strong>
                {openTickets + inProgressTickets}
              </strong>
            </div>


            <div>
              <span>High Risk Tickets</span>

              <strong>
                {criticalPriority + highPriority}
              </strong>
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Analytics;
