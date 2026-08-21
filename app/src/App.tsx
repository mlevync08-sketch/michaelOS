import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import './App.css'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [projectCount, setProjectCount] = useState(0)

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
      setProjectCount(0)
      return
    }

    async function loadProjects() {
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Project query failed:', error)
        return
      }

      setProjectCount(count ?? 0)
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
            <strong>91</strong>
          </div>
        </header>

        <section className="metric-grid">
          <div className="metric-card">
            <span>Active Projects</span>
            <strong>{projectCount}</strong>
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
            MichaelOS is authenticated and connected to your private operating
            data. Next we'll turn the live project portfolio into the first
            actionable executive brief.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App