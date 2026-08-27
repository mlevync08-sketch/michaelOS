import {
  useEffect,
  useMemo,
  useState,
} from "react"

import type {
  Session,
} from "@supabase/supabase-js"

import {
  supabase,
} from "./lib/supabase"

import Login from "./components/Login"

import ExecutiveHome from "./components/ExecutiveHome/ExecutiveHome"
import ProjectsView from "./components/domains/ProjectsView"
import ActionsView from "./components/domains/ActionsView"
import DecisionsView from "./components/domains/DecisionsView"
import WaitingOnView from "./components/domains/WaitingOnView"
import RelationshipsView from "./components/domains/RelationshipsView"
import WeeklyReviewView from "./components/domains/WeeklyReviewView"
import CapacityView from "./components/domains/CapacityView"
import MemoryView from "./components/domains/MemoryView"

import {
  loadExecutiveRepositoryData,
} from "./repositories/executiveRepository"

import {
  runMichaelOSKernel,
} from "./kernel/kernel"

import type {
  ExecutiveState,
} from "./types/executiveState"

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
  | "memory"

function App() {
  const [
    session,
    setSession,
  ] =
    useState<Session | null>(
      null
    )

  const [
    authLoading,
    setAuthLoading,
  ] =
    useState(true)

  const [
    executiveState,
    setExecutiveState,
  ] =
    useState<ExecutiveState | null>(
      null
    )

  const [
    stateLoading,
    setStateLoading,
  ] =
    useState(false)

  const [
    stateError,
    setStateError,
  ] =
    useState<string | null>(
      null
    )

  const [
    view,
    setView,
  ] =
    useState<ViewKey>(
      "today"
    )

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(
          data.session
        )

        setAuthLoading(
          false
        )
      })

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          _event,
          next
        ) =>
          setSession(
            next
          )
      )

    return () =>
      subscription.unsubscribe()
  }, [])

  async function refreshExecutiveState() {
    if (!session) return

    setStateLoading(true)
    setStateError(null)

    try {
      const d =
        await loadExecutiveRepositoryData()

      setExecutiveState(
        runMichaelOSKernel({
          projects:
            d.projects,

          actions:
            d.actions,

          decisions:
            d.decisions,

          waitingOn:
            d.waitingOn,

          relationships:
            d.relationships,

          memories:
            d.memories,

          dailyBrief:
            d.dailyBrief,

          health:
            d.health,
        })
      )
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

  useEffect(() => {
    if (!session) {
      setExecutiveState(
        null
      )
      return
    }

    refreshExecutiveState()
  }, [session])

  const dateLabel =
    useMemo(
      () =>
        new Intl.DateTimeFormat(
          "en-US",
          {
            weekday:
              "long",
            month: "long",
            day: "numeric",
          }
        )
          .format(
            new Date()
          )
          .toUpperCase(),
      []
    )

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

  if (
    stateLoading &&
    !executiveState
  ) {
    return (
      <div className="loading-screen">
        Atlas is assembling your
        executive state…
      </div>
    )
  }

  if (stateError) {
    return (
      <div className="loading-screen">
        <div>
          <strong>
            MichaelOS connection
            error
          </strong>

          <p>
            {stateError}
          </p>
        </div>
      </div>
    )
  }

  if (!executiveState) {
    return (
      <div className="loading-screen">
        No executive state
        available.
      </div>
    )
  }

  const m =
    executiveState.metrics

  return (
    <div className="atlas-app-shell">
      <aside className="atlas-sidebar">
        <div className="atlas-brand">
          <div className="atlas-brand-mark">
            A
          </div>

          <div>
            <div className="atlas-brand-name">
              ATLAS
            </div>

            <div className="atlas-brand-sub">
              Executive Brain
            </div>
          </div>
        </div>

        <nav className="atlas-nav">
          <Nav
            view={view}
            id="today"
            label="Today"
            icon="◉"
            onClick={setView}
          />

          <Nav
            view={view}
            id="weekly"
            label="Weekly Review"
            icon="◫"
            onClick={setView}
          />

          <div className="atlas-nav-label">
            EXECUTIVE DOMAINS
          </div>

          <Nav
            view={view}
            id="projects"
            label="Projects"
            icon="◇"
            count={
              m.activeProjects
            }
            onClick={setView}
          />

          <Nav
            view={view}
            id="decisions"
            label="Decisions"
            icon="◆"
            count={
              m.openDecisions
            }
            onClick={setView}
          />

          <Nav
            view={view}
            id="waiting"
            label="Waiting On"
            icon="⌛"
            count={
              m.waitingOn
            }
            onClick={setView}
          />

          <Nav
            view={view}
            id="relationships"
            label="Relationships"
            icon="◎"
            count={
              executiveState
                .relationships
                .length
            }
            onClick={setView}
          />

          <Nav
            view={view}
            id="actions"
            label="Actions"
            icon="▣"
            count={
              m.openActions
            }
            onClick={setView}
          />

          <Nav
            view={view}
            id="memory"
            label="Memory"
            icon="◈"
            count={
              m.memories
            }
            onClick={setView}
          />

          <Nav
            view={view}
            id="health"
            label="Capacity"
            icon="♡"
            onClick={setView}
          />
        </nav>

        <div className="atlas-sidebar-footer">
          <div className="atlas-system-status">
            <i />

            <div>
              <strong>
                MichaelOS Kernel online
              </strong>

              <small>
                ExecutiveState live
              </small>
            </div>
          </div>

          <button
            className="atlas-sign-out"
            onClick={signOut}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="atlas-main">
        <header className="atlas-topbar">
          <div>
            <div className="atlas-eyebrow">
              {dateLabel}
            </div>

            <h1>
              {view ===
              "today"
                ? "Good morning, Michael."
                : title(
                    view
                  )}
            </h1>
          </div>

          <div className="atlas-top-actions">
            <button className="atlas-search-btn">
              ⌕{" "}
              <span>
                Search Atlas
              </span>
            </button>

            <button
              className="atlas-refresh-btn"
              onClick={
                refreshExecutiveState
              }
            >
              ↻
            </button>

            <div className="atlas-avatar">
              ML
            </div>
          </div>
        </header>

        <section className="atlas-main-content">
          {view ===
            "today" && (
            <ExecutiveHome
              state={
                executiveState
              }
            />
          )}

          {view ===
            "projects" && (
            <ProjectsView
              state={
                executiveState
              }
            />
          )}

          {view ===
            "actions" && (
            <ActionsView
              state={
                executiveState
              }
            />
          )}

          {view ===
            "decisions" && (
            <DecisionsView
              state={
                executiveState
              }
            />
          )}

          {view ===
            "waiting" && (
            <WaitingOnView
              state={
                executiveState
              }
            />
          )}

          {view ===
            "relationships" && (
            <RelationshipsView
              state={
                executiveState
              }
            />
          )}

          {view ===
            "weekly" && (
            <WeeklyReviewView
              state={
                executiveState
              }
            />
          )}

          {view ===
            "health" && (
            <CapacityView
              state={
                executiveState
              }
            />
          )}

          {view ===
            "memory" && (
            <MemoryView
              state={
                executiveState
              }
            />
          )}
        </section>
      </main>
    </div>
  )
}

function Nav({
  view,
  id,
  label,
  icon,
  count,
  onClick,
}: {
  view: ViewKey
  id: ViewKey
  label: string
  icon: string
  count?: number
  onClick: (
    value: ViewKey
  ) => void
}) {
  return (
    <button
      className={`atlas-nav-item ${
        view === id
          ? "active"
          : ""
      }`}
      onClick={() =>
        onClick(id)
      }
    >
      <span>
        {icon}
      </span>

      <b>
        {label}
      </b>

      {count !==
        undefined && (
        <em>
          {count}
        </em>
      )}
    </button>
  )
}

function title(
  view: ViewKey
) {
  return {
    projects:
      "What deserves your attention?",

    actions:
      "What should move today?",

    decisions:
      "What must be decided?",

    waiting:
      "What are you waiting on?",

    relationships:
      "Who matters now?",

    weekly:
      "Your week, compressed into judgment.",

    health:
      "Do you have the capacity?",

    memory:
      "What should Atlas remember?",

    today:
      "Good morning, Michael.",
  }[view]
}

export default App
