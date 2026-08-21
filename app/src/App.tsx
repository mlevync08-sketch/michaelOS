import './App.css'

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>

          <div>
            <strong>MichaelOS</strong>
            <span>Executive Operating System</span>
          </div>
        </div>

        <nav className="nav">
          <button className="nav-item active">Today</button>
          <button className="nav-item">Projects</button>
          <button className="nav-item">Actions</button>
          <button className="nav-item">Relationships</button>
          <button className="nav-item">Waiting On</button>
          <button className="nav-item">Decisions</button>
          <button className="nav-item">Weekly Review</button>
          <button className="nav-item">Health</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">FRIDAY · AUGUST 21</p>
            <h1>Good morning, Michael.</h1>
            <p className="subtitle">
              Here's what deserves your attention today.
            </p>
          </div>

          <div className="focus-score">
            <span>Focus Score</span>
            <strong>91</strong>
          </div>
        </header>

        <section className="metric-grid">
          <div className="metric-card">
            <span>Active Projects</span>
            <strong>6</strong>
          </div>

          <div className="metric-card">
            <span>Critical</span>
            <strong>3</strong>
          </div>

          <div className="metric-card">
            <span>Needs Attention</span>
            <strong>3</strong>
          </div>

          <div className="metric-card">
            <span>System</span>
            <strong className="live">LIVE</strong>
          </div>
        </section>

        <section className="brief-card">
          <p className="section-label">CHIEF OF STAFF BRIEF</p>

          <h2>Protect your highest-leverage work.</h2>

          <p>
            MichaelOS is now running on the production React foundation.
            Next we'll connect this shell to your live Supabase data.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
