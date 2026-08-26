import { useEffect, useMemo, useState } from "react"
import type { Session } from "@supabase/supabase-js"

import { supabase } from "./lib/supabase"
import Login from "./components/Login"
import ExecutiveHome from "./components/ExecutiveHome/ExecutiveHome"

import { loadExecutiveRepositoryData } from "./repositories/executiveRepository"
import { runMichaelOSKernel } from "./kernel/kernel"

import type { ExecutiveState } from "./types/executiveState"

import "./App.css"

function App() {
  const [session, setSession] = useState<Session | null>(null)

  const [authLoading, setAuthLoading] = useState(true)

  const [executiveState, setExecutiveState] =
    useState<ExecutiveState | null>(null)

  const [stateLoading, setStateLoading] = useState(false)

  const [stateError, setStateError] =
    useState<string | null>(null)

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession()

      setSession(data.session)
      setAuthLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setExecutiveState(null)
      return
    }

    async function loadExecutiveState() {
      setStateLoading(true)
      setStateError(null)

      try {
        const repositoryData =
          await loadExecutiveRepositoryData()

        const nextState = runMichaelOSKernel({
          projects: repositoryData.projects,
          actions: repositoryData.actions,
          decisions: repositoryData.decisions,
          waitingOn: repositoryData.waitingOn,
          relationships: repositoryData.relationships,
          dailyBrief: repositoryData.dailyBrief,
          health: repositoryData.health,
        })

        setExecutiveState(nextState)
      } catch (error) {
        console.error(
          "Failed to load MichaelOS ExecutiveState:",
          error
        )

        setStateError(
          "MichaelOS could not assemble the executive state."
        )
      } finally {
        setStateLoading(false)
      }
    }

    loadExecutiveState()
  }, [session])

  const dateLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
      .format(new Date())
      .toUpperCase()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  if (authLoading) {
    return (
      <div className="loading-screen">
        Opening MichaelOS…
      </div>
    )
  }

  if (!session) {
    return <Login />
  }

  if (stateLoading && !executiveState) {
    return (
      <div className="loading-screen">
        Atlas is assembling your executive state…
      </div>
    )
  }

  if (stateError) {
    return (
      <div className="loading-screen">
        <div>
          <strong>MichaelOS connection error</strong>
          <p>{stateError}</p>
        </div>
      </div>
    )
  }

  if (!executiveState) {
    return (
      <div className="loading-screen">
        No executive state available.
      </div>
    )
  }

  const {
    projects,
    dashboard,
    metrics,
  } = executiveState

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
          <button className="nav-item active">
            Today
          </button>

          <button className="nav-item">
            Projects
          </button>

          <button className="nav-item">
            Actions
            <span>{metrics.openActions}</span>
          </button>

          <button className="nav-item">
            Relationships
          </button>

          <button className="nav-item">
            Waiting On
            <span>{metrics.waitingOn}</span>
          </button>

          <button className="nav-item">
            Decisions
            <span>{metrics.openDecisions}</span>
          </button>

          <button className="nav-item">
            Weekly Review
          </button>

          <button className="nav-item">
            Health
          </button>
        </nav>

        <div
          style={{
            marginTop: "auto",
            padding: "12px 0",
            fontSize: "12px",
            opacity: 0.65,
          }}
        >
          Kernel LIVE
        </div>

        <button
          className="sign-out"
          onClick={signOut}
        >
          Sign out
        </button>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">
              {dateLabel}
            </p>

            <h1>Good morning, Michael.</h1>

            <p className="subtitle">
              Here&apos;s what deserves your
              attention today.
            </p>
          </div>

          <div className="focus-score">
            <span>Focus Score</span>

            <strong>
              {dashboard.metrics.focusScore}
            </strong>
          </div>
        </header>

        <section className="metric-grid">
          <div className="metric-card">
            <span>Active Projects</span>
            <strong>
              {metrics.activeProjects}
            </strong>
          </div>

          <div className="metric-card">
            <span>Critical</span>
            <strong>
              {metrics.criticalProjects}
            </strong>
          </div>

          <div className="metric-card">
            <span>Needs Attention</span>
            <strong>
              {metrics.needsAttention}
            </strong>
          </div>

          <div className="metric-card">
            <span>Open Decisions</span>
            <strong>
              {metrics.openDecisions}
            </strong>
          </div>

          <div className="metric-card">
            <span>Waiting On</span>
            <strong>
              {metrics.waitingOn}
            </strong>
          </div>

          <div className="metric-card">
            <span>Open Actions</span>
            <strong>
              {metrics.openActions}
            </strong>
          </div>

          <div className="metric-card">
            <span>System</span>
            <strong className="live">
              LIVE
            </strong>
          </div>
        </section>

        <ExecutiveHome
          dashboard={dashboard}
          projects={projects}
        />

        <section className="portfolio-section">
          <div className="portfolio-header">
            <div>
              <p className="section-label">
                MICHAEL OS EXECUTIVE STATE
              </p>

              <h2>Live Domain Summary</h2>
            </div>

            <span>
              Generated{" "}
              {new Date(
                executiveState.generatedAt
              ).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="metric-grid">
            <div className="metric-card">
              <span>Projects</span>
              <strong>
                {executiveState.projects.length}
              </strong>
            </div>

            <div className="metric-card">
              <span>Actions</span>
              <strong>
                {executiveState.actions.length}
              </strong>
            </div>

            <div className="metric-card">
              <span>Decisions</span>
              <strong>
                {executiveState.decisions.length}
              </strong>
            </div>

            <div className="metric-card">
              <span>Waiting On</span>
              <strong>
                {executiveState.waitingOn.length}
              </strong>
            </div>

            <div className="metric-card">
              <span>Relationships</span>
              <strong>
                {executiveState.relationships.length}
              </strong>
            </div>

            <div className="metric-card">
              <span>Signals</span>
              <strong>
                {executiveState.signals.length}
              </strong>
            </div>

            <div className="metric-card">
              <span>Health</span>
              <strong>
                {executiveState.health
                  ? "CONNECTED"
                  : "—"}
              </strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App