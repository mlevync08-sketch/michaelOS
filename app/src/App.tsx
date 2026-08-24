import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import type { Project } from "./types/project"
import './App.css'
import { runMichaelOSKernel } from "./kernel/kernel"
import ExecutiveBrief from "./components/ExecutiveBrief/ExecutiveBrief"

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)

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
      setProjects([])
      return
    }

    async function loadProjects() {
      setProjectsLoading(true)

      const { data, error } = await supabase
        .from('projects')
        .select(
          'id,name,status,health,priority,next_milestone,blocker,next_action,owner'
        )
        .order('name')

      if (error) {
        console.error('Project query failed:', error)
      } else {
        setProjects(data ?? [])
      }

      setProjectsLoading(false)
    }

    loadProjects()
  }, [session])

  async function signOut() {
    await supabase.auth.signOut()
  }

  if (authLoading) {
    return <div className="loading-screen">Opening MichaelOS…</div>
  }

  if (!session) {
    return <Login />
  }

  const criticalCount = projects.filter(
    (project) => project.priority === 'critical'
  ).length

  const attentionCount = projects.filter(
    (project) => project.health === 'amber' || project.health === 'red'
  ).length

  const dashboard = runMichaelOSKernel({
  projects,
})
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

        <button className="sign-out" onClick={signOut}>
          Sign out
        </button>
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
   <strong>{dashboard.metrics.focusScore}</strong>
          </div>
        </header>

        <section className="metric-grid">
          <div className="metric-card">
            <span>Active Projects</span>
<strong>{projectsLoading ? '—' : projects.length}</strong>
          </div>

          <div className="metric-card">
            <span>Critical</span>
            <strong>{projectsLoading ? '—' : criticalCount}</strong>
          </div>

          <div className="metric-card">
            <span>Needs Attention</span>
            <strong>{projectsLoading ? '—' : attentionCount}</strong>
          </div>

          <div className="metric-card">
            <span>System</span>
            <strong className="live">LIVE</strong>
          </div>
        </section>

<ExecutiveBrief
  dashboard={dashboard}
/>

        <section className="portfolio-section">
          <div className="portfolio-header">
            <div>
              <p className="section-label">ACTIVE PORTFOLIO</p>
              <h2>Projects</h2>
            </div>

            <span>{projects.length} active</span>
          </div>

          {projectsLoading ? (
            <div className="portfolio-loading">Loading portfolio…</div>
          ) : (
            <div className="project-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.id}>
                  <div className="project-card-top">
                    <div className="project-health">
                      <span
                        className={`health-dot ${project.health}`}
                      />
                      <span>{project.health}</span>
                    </div>

                    <span className={`priority-badge ${project.priority}`}>
                      {project.priority}
                    </span>
                  </div>

                  <h3>{project.name}</h3>

                  <div className="project-detail">
                    <span>Next milestone</span>
                    <strong>{project.next_milestone || 'Not set'}</strong>
                  </div>

                  <div className="project-detail">
                    <span>Critical action</span>
                    <strong>{project.next_action || 'Not set'}</strong>
                  </div>

                  {project.blocker && project.blocker !== 'None' && (
                    <div className="project-blocker">
                      <span>Blocker</span>
                      <strong>{project.blocker}</strong>
                    </div>
                  )}

                  <div className="project-footer">
                    <span>{project.owner || 'Unassigned'}</span>
                    <span>{project.status}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App