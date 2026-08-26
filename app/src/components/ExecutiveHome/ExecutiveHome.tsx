import { useMemo, useState } from "react"
import type { ExecutiveState } from "../../types/executiveState"
import DetailDrawer from "./DetailDrawer"
import "./ExecutiveHome.css"

type Props = { state: ExecutiveState }
type DrawerContent = { eyebrow: string; title: string; body: string }

const priorityLabel = (p:string) => p.toUpperCase()
const ageLabel = (date:string|null) => {
  if (!date) return "Open"
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000))
  return days === 0 ? "Today" : `${days} day${days === 1 ? "" : "s"}`
}

export default function ExecutiveHome({ state }: Props) {
  const [drawer,setDrawer] = useState<DrawerContent|null>(null)
  const { dashboard, projects, actions, decisions, waitingOn, metrics } = state

  const rankedProjects = useMemo(() => {
    const order: Record<string,number> = {critical:4,high:3,medium:2,low:1}
    return [...projects].sort((a,b)=>(order[b.priority]||0)-(order[a.priority]||0)).slice(0,3)
  }, [projects])

  const agendaItems = useMemo(() => {
    if (actions.length) {
      return actions.slice(0,4).map((a,i)=>({
        label:`FOCUS ${i+1}`,
        title:a.project_id ? (projects.find(p=>p.id===a.project_id)?.name ?? a.title) : a.title,
        subtitle:a.title
      }))
    }
    return projects.slice(0,4).map((p,i)=>({
      label:`FOCUS ${i+1}`,
      title:p.name,
      subtitle:p.next_action ?? p.next_milestone ?? "Advance next meaningful milestone"
    }))
  }, [actions,projects])

  return (
    <>
      <div className="atlas-shell">
        <section className="atlas-hero-grid">
          <article className="atlas-card atlas-mission">
            <div className="atlas-card-inner">
              <div className="atlas-label-row">
                <span className="atlas-section-label">TODAY'S MISSION</span>
                <span className="atlas-confidence">CONFIDENCE <strong>{dashboard.metrics.confidence}%</strong></span>
              </div>
              <h2>{dashboard.mission.title}</h2>
              <p className="atlas-lead">{dashboard.mission.detail}</p>

              <div className="atlas-reason-grid">
                {[
                  ["WHY TODAY",dashboard.context.whyToday],
                  ["IF IGNORED",dashboard.context.ifIgnored],
                  ["SUCCESS LOOKS LIKE",dashboard.context.successLooksLike],
                ].map(([label,body])=>(
                  <button className="atlas-reason-box" key={label}
                    onClick={()=>setDrawer({eyebrow:label,title:dashboard.mission.title,body})}>
                    <small>{label}</small><p>{body}</p>
                  </button>
                ))}
              </div>

              <div className="atlas-action-row">
                <button className="atlas-primary-btn">Mark mission complete</button>
                <button className="atlas-secondary-btn"
                  onClick={()=>setDrawer({eyebrow:"ATLAS EVIDENCE",title:"Why Atlas chose this",
                    body:`${dashboard.context.whyToday} ${dashboard.context.nextMove}`})}>
                  Show evidence
                </button>
                <span className="atlas-action-note">Estimated focus block: {dashboard.mission.estimatedFocusMinutes} min</span>
              </div>
            </div>
          </article>

          <aside className="atlas-card atlas-focus-card">
            <span className="atlas-section-label">EXECUTIVE FOCUS</span>
            <div className="atlas-score-ring" style={{background:`conic-gradient(#0aa6a6 0 ${dashboard.metrics.focusScore}%, #e7eff0 ${dashboard.metrics.focusScore}% 100%)`}}>
              <div className="atlas-score-inner">
                <strong>{dashboard.metrics.focusScore}</strong><span>FOCUS SCORE</span>
              </div>
            </div>
            <h3>High-leverage day</h3>
            <p>Your highest-value work is concentrated in a small number of decisions. Protect the first deep-work block.</p>
            <div className="atlas-metric-row">
              <div className="atlas-mini-metric"><strong>{metrics.criticalProjects}</strong><small>critical moves</small></div>
              <div className="atlas-mini-metric"><strong>{metrics.openDecisions}</strong><small>open decisions</small></div>
              <div className="atlas-mini-metric"><strong>{metrics.waitingOn}</strong><small>waiting on</small></div>
            </div>
          </aside>
        </section>

        <div className="atlas-section-head">
          <div><h3>Highest leverage after the mission</h3><p>Ranked by urgency, strategic value, actionability, and dependency relief.</p></div>
          <button className="atlas-text-btn">VIEW ALL PROJECTS →</button>
        </div>

        <section className="atlas-leverage-grid">
          {rankedProjects.map((p,i)=>(
            <article className="atlas-card atlas-leverage-card" key={p.id}>
              <div className="atlas-rank">{String(i+1).padStart(2,"0")}</div>
              <span className={`atlas-project-tag ${p.priority}`}>● {priorityLabel(p.priority)}</span>
              <h4>{p.name}</h4>
              <p>{p.next_milestone ?? "Advance the next meaningful milestone."}</p>
              <div className="atlas-nextline"><strong>Next move:</strong> {p.next_action ?? "Define the next concrete execution step."}</div>
            </article>
          ))}
        </section>

        <section className="atlas-bottom-grid">
          <article className="atlas-card atlas-compact-card">
            <div className="atlas-section-head compact">
              <div><h3>Executive agenda</h3><p>Where Atlas recommends your time goes.</p></div>
              <button className="atlas-text-btn">CALENDAR →</button>
            </div>
            {agendaItems.map(item=>(
              <div className="atlas-agenda-item" key={`${item.label}-${item.title}`}>
                <div className="atlas-agenda-time">{item.label}</div>
                <div><div className="atlas-agenda-title">{item.title}</div><div className="atlas-agenda-sub">{item.subtitle}</div></div>
                <span className="atlas-agenda-pill">FOCUS</span>
              </div>
            ))}
          </article>

          <article className="atlas-card atlas-compact-card">
            <div className="atlas-section-head compact">
              <div><h3>Waiting on</h3><p>Dependencies with growing execution cost.</p></div>
              <button className="atlas-text-btn">VIEW ALL →</button>
            </div>
            {waitingOn.length ? waitingOn.slice(0,4).map(item=>(
              <div className="atlas-waiting-item" key={item.id}>
                <div className="atlas-waiting-top"><strong>{item.person}</strong><span>{ageLabel(item.requested_on)}</span></div>
                <p>{item.item}</p>
              </div>
            )) : <div className="atlas-empty">No external dependencies are currently waiting.</div>}
          </article>
        </section>

        <section className="atlas-live-domain-strip">
          <div><span>Projects</span><strong>{projects.length}</strong></div>
          <div><span>Actions</span><strong>{actions.length}</strong></div>
          <div><span>Decisions</span><strong>{decisions.length}</strong></div>
          <div><span>Waiting On</span><strong>{waitingOn.length}</strong></div>
          <div><span>Relationships</span><strong>{state.relationships.length}</strong></div>
          <div><span>Signals</span><strong>{state.signals.length}</strong></div>
        </section>
      </div>

      <DetailDrawer open={drawer !== null} eyebrow={drawer?.eyebrow ?? ""} title={drawer?.title ?? ""} onClose={()=>setDrawer(null)}>
        <p>{drawer?.body}</p>
      </DetailDrawer>
    </>
  )
}
