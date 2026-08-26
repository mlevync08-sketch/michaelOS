import { useEffect, useMemo, useState } from "react"
import type { Session } from "@supabase/supabase-js"

import { supabase } from "./lib/supabase"
import Login from "./components/Login"
import ExecutiveHome from "./components/ExecutiveHome/ExecutiveHome"
import { loadExecutiveRepositoryData } from "./repositories/executiveRepository"
import { runMichaelOSKernel } from "./kernel/kernel"
import type { ExecutiveState } from "./types/executiveState"

import "./App.css"

type ViewKey =
  | "today"
  | "projects"
  | "actions"
  | "relationships"
  | "waiting"
  | "decisions"
  | "weekly"
  | "health"

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [executiveState, setExecutiveState] = useState<ExecutiveState | null>(null)
  const [stateLoading, setStateLoading] = useState(false)
  const [stateError, setStateError] = useState<string | null>(null)
  const [view, setView] = useState<ViewKey>("today")

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setAuthLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

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
        const repositoryData = await loadExecutiveRepositoryData()

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
        console.error("Failed to load MichaelOS ExecutiveState:", error)
        setStateError("MichaelOS could not assemble the executive state.")
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
    return <div className="loading-screen">Opening MichaelOS…</div>
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
    return <div className="loading-screen">No executive state available.</div>
  }

  const { metrics } = executiveState

  return (
    <div className="atlas-app-shell">
      <aside className="atlas-sidebar">
        <div className="atlas-brand">
          <div className="atlas-brand-mark">A</div>

          <div>
            <div className="atlas-brand-name">ATLAS</div>
            <div className="atlas-brand-sub">Executive Brain</div>
          </div>
        </div>

        <nav className="atlas-nav">
          <button
            className={`atlas-nav-item ${view === "today" ? "active" : ""}`}
            onClick={() => setView("today")}
          >
            <span>◉</span>
            <b>Today</b>
          </button>

          <button
            className={`atlas-nav-item ${view === "weekly" ? "active" : ""}`}
            onClick={() => setView("weekly")}
          >
            <span>◫</span>
            <b>Weekly Review</b>
          </button>

          <div className="atlas-nav-label">EXECUTIVE DOMAINS</div>

          <button
            className={`atlas-nav-item ${view === "projects" ? "active" : ""}`}
            onClick={() => setView("projects")}
          >
            <span>◇</span>
            <b>Projects</b>
            <em>{metrics.activeProjects}</em>
          </button>

          <button
            className={`atlas-nav-item ${view === "decisions" ? "active" : ""}`}
            onClick={() => setView("decisions")}
          >
            <span>◆</span>
            <b>Decisions</b>
            <em>{metrics.openDecisions}</em>
          </button>

          <button
            className={`atlas-nav-item ${view === "waiting" ? "active" : ""}`}
            onClick={() => setView("waiting")}
          >
            <span>⌛</span>
            <b>Waiting On</b>
            <em>{metrics.waitingOn}</em>
          </button>

          <button
            className={`atlas-nav-item ${view === "relationships" ? "active" : ""}`}
            onClick={() => setView("relationships")}
          >
            <span>◎</span>
            <b>Relationships</b>
            <em>{executiveState.relationships.length}</em>
          </button>

          <button
            className={`atlas-nav-item ${view === "actions" ? "active" : ""}`}
            onClick={() => setView("actions")}
          >
            <span>▣</span>
            <b>Actions</b>
            <em>{metrics.openActions}</em>
          </button>

          <button
            className={`atlas-nav-item ${view === "health" ? "active" : ""}`}
            onClick={() => setView("health")}
          >
            <span>♡</span>
            <b>Capacity</b>
          </button>
        </nav>

        <div className="atlas-sidebar-footer">
          <div className="atlas-system-status">
            <i />
            <div>
              <strong>MichaelOS Kernel online</strong>
              <small>ExecutiveState live</small>
            </div>
          </div>

          <button className="atlas-sign-out" onClick={signOut}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="atlas-main">
        <header className="atlas-topbar">
          <div>
            <div className="atlas-eyebrow">{dateLabel}</div>
            <h1>Good morning, Michael.</h1>
          </div>

          <div className="atlas-top-actions">
            <button className="atlas-search-btn">
              ⌕ <span>Search Atlas</span>
            </button>

            <button
              className="atlas-refresh-btn"
              onClick={() => window.location.reload()}
              aria-label="Refresh Atlas"
            >
              ↻
            </button>

            <div className="atlas-avatar">ML</div>
          </div>
        </header>

        <section className="atlas-main-content">
          {view === "today" ? (
            <ExecutiveHome state={executiveState} />
          ) : (
            <div className="atlas-placeholder-card">
              <div className="atlas-section-label">
                {view.toUpperCase()}
              </div>

              <h2>
                {view === "projects" && "Project portfolio"}
                {view === "actions" && "Open actions"}
                {view === "relationships" && "Relationship intelligence"}
                {view === "waiting" && "Waiting on"}
                {view === "decisions" && "Decision queue"}
                {view === "weekly" && "Weekly Review"}
                {view === "health" && "Executive capacity"}
              </h2>

              <p>
                This domain is connected to MichaelOS and will be expanded into
                its full operating view next.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
