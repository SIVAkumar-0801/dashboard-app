import './App.css';

const navItems = ['Billing', 'Inventory', 'Suppliers', 'Reports'];
const stats = [
  { label: 'Active Suppliers', value: '24' },
  { label: 'Monthly Spend', value: '₹42.8k' },
  { label: 'Pending Deliveries', value: '08' },
  { label: 'Overdue Invoices', value: '02' },
];
const entries = [
  {
    date: 'Oct 24, 2023',
    supplier: 'Vardhman Textiles Ltd',
    invoice: 'VT-99212',
    qty: '1,200 m',
    amount: '₹1,44,000',
    status: 'COMPLETED',
  },
  {
    date: 'Oct 22, 2023',
    supplier: 'Raymond Fabrics',
    invoice: 'RF-INV-88',
    qty: '850 m',
    amount: '₹2,12,500',
    status: 'PENDING',
  },
  {
    date: 'Oct 21, 2023',
    supplier: "Siyaram's Silk Mills",
    invoice: 'SIY-00441',
    qty: '2,400 m',
    amount: '₹3,84,000',
    status: 'DISPUTED',
  },
  {
    date: 'Oct 19, 2023',
    supplier: 'Bombay Dyeing',
    invoice: 'BD-2023-X',
    qty: '500 m',
    amount: '₹62,000',
    status: 'COMPLETED',
  },
];

function App() {
  return (
    <main className="layout">
      <aside className="sidebar">
        <div>
          <div className="brand">Siva Textiles</div>
          <p className="brand-subtitle">Modern ERP System</p>
          <nav className="sidebar-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item}
                className={`nav-button ${item === 'Suppliers' ? 'active' : ''}`}
                type="button"
              >
                <span className="nav-icon" aria-hidden="true">
                  □
                </span>
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar-footer">
          <button type="button" className="nav-button">
            <span className="nav-icon" aria-hidden="true">
              ⚙
            </span>
            Settings
          </button>
          <button type="button" className="nav-button">
            <span className="nav-icon" aria-hidden="true">
              ?
            </span>
            Help
          </button>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <h1>Siva Textiles ERP</h1>
          <input
            type="search"
            className="search"
            placeholder="Search supplier or invoice..."
            aria-label="Search supplier or invoice"
          />
          <div className="top-icons">
            <span>◴</span>
            <span>◌</span>
            <span className="avatar">⦿</span>
          </div>
        </header>

        <section className="page-head">
          <h2>Supplier Management</h2>
          <p>Overview of procurement and supplier history.</p>
        </section>

        <section className="card form-card">
          <div className="card-head">
            <h3>Record Stock Receipt</h3>
            <span>New Entry</span>
          </div>

          <div className="form-grid">
            <label>
              Supplier Name
              <select defaultValue="">
                <option value="" disabled>
                  Select Supplier
                </option>
              </select>
            </label>
            <label>
              Bill/Invoice Number
              <input type="text" placeholder="e.g. INV-2023-001" />
            </label>
            <label>
              Receipt Date
              <input type="date" />
            </label>
            <label>
              Total Quantity (Meters/Pcs)
              <input type="text" value="0.00 UNIT" readOnly />
            </label>
            <label>
              Total Amount
              <input type="text" value="₹ 0.00" readOnly />
            </label>
            <button type="button" className="primary-button">
              Record Transaction
            </button>
          </div>
        </section>

        <section className="stats-grid" aria-label="Supplier stats">
          {stats.map((card) => (
            <article key={card.label} className="card stat-card">
              <p>{card.label}</p>
              <strong>{card.value}</strong>
            </article>
          ))}
        </section>

        <section className="card table-card">
          <div className="card-head">
            <h3>Recent Supplier Entries</h3>
            <button type="button" className="text-button">
              Export CSV
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Supplier</th>
                <th>Invoice #</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.invoice}>
                  <td>{entry.date}</td>
                  <td>{entry.supplier}</td>
                  <td>{entry.invoice}</td>
                  <td>{entry.qty}</td>
                  <td className="amount">{entry.amount}</td>
                  <td>
                    <span className={`tag ${entry.status.toLowerCase()}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td>⋮</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            <span>Showing 4 of 128 entries</span>
            <div className="pager">
              <button type="button">Previous</button>
              <button type="button" className="active-page">
                1
              </button>
              <button type="button">Next</button>
            </div>
          </div>
        </section>

        <section className="bottom-grid">
          <article className="card chart-card">
            <h3>Supplier Performance</h3>
            <div className="bars" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span className="highlight" />
              <span />
            </div>
            <p>Average delivery time has improved by 12% this month.</p>
          </article>

          <article className="card info-card">
            <h3>Need New Suppliers?</h3>
            <p>
              Explore verified textile manufacturers and fabric wholesalers in
              our curated directory.
            </p>
            <button type="button" className="secondary-button">
              Open Directory
            </button>
          </article>
        </section>
        <button type="button" className="fab" aria-label="Add new entry">
          +
        </button>
      </section>
    </main>
  );
}

export default App;
