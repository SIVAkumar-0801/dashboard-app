import './App.css';

const summaryCards = [
  { label: 'Habits completed', value: '8/10' },
  { label: 'Focus hours', value: '5.4h' },
  { label: 'Tasks closed', value: '12' },
];

const todayItems = [
  'Morning routine',
  'Hydration check',
  'Deep work sprint',
  'Evening reflection',
];

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Personal dashboard</p>
        <h1>Track habits, routines, and work from one place.</h1>
        <p className="lede">
          This starter view restores the missing React entrypoints so the app
          can build again and gives the repo a working dashboard skeleton.
        </p>
      </section>

      <section className="card-grid" aria-label="Summary metrics">
        {summaryCards.map((card) => (
          <article className="metric-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </section>

      <section className="panel">
        <div>
          <p className="section-label">Today</p>
          <h2>Checklist</h2>
        </div>

        <ul className="task-list">
          {todayItems.map((item) => (
            <li key={item}>
              <span className="status-dot" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
