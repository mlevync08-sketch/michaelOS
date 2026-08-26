import { useState } from "react"
import type { ExecutiveState } from "../../types/executiveState"
import DetailDrawer from "./DetailDrawer"
import "./ExecutiveHome.css"

type Props = {
  state: ExecutiveState
}

type DrawerContent = {
  eyebrow: string
  title: string
  body: string
}

function priorityLabel(priority: string) {
  return priority.toUpperCase()
}

function ageLabel(date: string | null) {
  if (!date) return "Open"

  const days = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(date).getTime()) /
        86400000
    )
  )

  if (days === 0) return "Today"

  return `${days} day${days === 1 ? "" : "s"}`
}

export default function ExecutiveHome({
  state,
}: Props) {
  const [drawer, setDrawer] =
    useState<DrawerContent | null>(null)

  const {
    dashboard,
    mission,
    executiveAgenda,
    projects,
    actions,
    decisions,
    waitingOn,
    metrics,
  } = state

  const rankedProjects = [...projects]
    .sort((a, b) => {
      const order: Record<string, number> = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
      }

      return (
        (order[b.priority] ?? 0) -
        (order[a.priority] ?? 0)
      )
    })
    .slice(0, 3)

  return (
    <>
      <div className="atlas-shell">
        <section className="atlas-hero-grid">
          <article className="atlas-card atlas-mission">
            <div className="atlas-card-inner">
              <div className="atlas-label-row">
                <span className="atlas-section-label">
                  TODAY&apos;S MISSION
                </span>

                <span className="atlas-confidence">
                  CONFIDENCE{" "}
                  <strong>
                    {mission.confidence}%
                  </strong>
                </span>
              </div>

              <h2>{mission.title}</h2>

              <p className="atlas-lead">
                {mission.detail}
              </p>

              <div className="atlas-reason-grid">
                <button
                  className="atlas-reason-box"
                  onClick={() =>
                    setDrawer({
                      eyebrow: "WHY TODAY",
                      title: mission.title,
                      body: mission.whyToday,
                    })
                  }
                >
                  <small>WHY TODAY</small>
                  <p>{mission.whyToday}</p>
                </button>

                <button
                  className="atlas-reason-box"
                  onClick={() =>
                    setDrawer({
                      eyebrow: "IF IGNORED",
                      title: mission.title,
                      body: mission.ifIgnored,
                    })
                  }
                >
                  <small>IF IGNORED</small>
                  <p>{mission.ifIgnored}</p>
                </button>

                <button
                  className="atlas-reason-box"
                  onClick={() =>
                    setDrawer({
                      eyebrow:
                        "SUCCESS LOOKS LIKE",
                      title: mission.title,
                      body:
                        mission.successLooksLike,
                    })
                  }
                >
                  <small>
                    SUCCESS LOOKS LIKE
                  </small>

                  <p>
                    {mission.successLooksLike}
                  </p>
                </button>
              </div>

              <div className="atlas-action-row">
                <button className="atlas-primary-btn">
                  Mark mission complete
                </button>

                <button
                  className="atlas-secondary-btn"
                  onClick={() =>
                    setDrawer({
                      eyebrow:
                        "ATLAS EVIDENCE",
                      title:
                        "Why Atlas chose this",
                      body: `${mission.whyToday} ${mission.ifIgnored}`,
                    })
                  }
                >
                  Show evidence
                </button>

                <span className="atlas-action-note">
                  Estimated focus block:{" "}
                  {
                    mission.estimatedFocusMinutes
                  }{" "}
                  min
                </span>
              </div>
            </div>
          </article>

          <aside className="atlas-card atlas-focus-card">
            <span className="atlas-section-label">
              EXECUTIVE FOCUS
            </span>

            <div
              className="atlas-score-ring"
              style={{
                background: `conic-gradient(
                  #0aa6a6 0 ${dashboard.metrics.focusScore}%,
                  #e7eff0 ${dashboard.metrics.focusScore}% 100%
                )`,
              }}
            >
              <div className="atlas-score-inner">
                <strong>
                  {
                    dashboard.metrics
                      .focusScore
                  }
                </strong>

                <span>
                  FOCUS SCORE
                </span>
              </div>
            </div>

            <h3>
              High-leverage day
            </h3>

            <p>
              Your highest-value work is
              concentrated in a small number
              of decisions. Protect the first
              deep-work block.
            </p>

            <div className="atlas-metric-row">
              <div className="atlas-mini-metric">
                <strong>
                  {
                    metrics.criticalProjects
                  }
                </strong>

                <small>
                  critical moves
                </small>
              </div>

              <div className="atlas-mini-metric">
                <strong>
                  {
                    metrics.openDecisions
                  }
                </strong>

                <small>
                  open decisions
                </small>
              </div>

              <div className="atlas-mini-metric">
                <strong>
                  {metrics.waitingOn}
                </strong>

                <small>
                  waiting on
                </small>
              </div>
            </div>
          </aside>
        </section>

        <div className="atlas-section-head">
          <div>
            <h3>
              Highest leverage after the mission
            </h3>

            <p>
              Ranked by urgency, strategic
              value, actionability, and
              dependency relief.
            </p>
          </div>

          <button className="atlas-text-btn">
            VIEW ALL PROJECTS →
          </button>
        </div>

        <section className="atlas-leverage-grid">
          {rankedProjects.map(
            (project, index) => (
              <article
                className="atlas-card atlas-leverage-card"
                key={project.id}
              >
                <div className="atlas-rank">
                  {String(
                    index + 1
                  ).padStart(2, "0")}
                </div>

                <span
                  className={`atlas-project-tag ${project.priority}`}
                >
                  ●{" "}
                  {priorityLabel(
                    project.priority
                  )}
                </span>

                <h4>
                  {project.name}
                </h4>

                <p>
                  {project.next_milestone ??
                    "Advance the next meaningful milestone."}
                </p>

                <div className="atlas-nextline">
                  <strong>
                    Next move:
                  </strong>{" "}
                  {project.next_action ??
                    "Define the next concrete execution step."}
                </div>
              </article>
            )
          )}
        </section>

        <section className="atlas-bottom-grid">
          <article className="atlas-card atlas-compact-card">
            <div className="atlas-section-head compact">
              <div>
                <h3>
                  Executive agenda
                </h3>

                <p>
                  Where Atlas recommends
                  your time goes.
                </p>
              </div>

              <button className="atlas-text-btn">
                CALENDAR →
              </button>
            </div>

            {executiveAgenda.length >
            0 ? (
              executiveAgenda.map(
                (item) => (
                  <div
                    className="atlas-agenda-item"
                    key={item.id}
                  >
                    <div className="atlas-agenda-time">
                      {item.source.toUpperCase()}
                    </div>

                    <div>
                      <div className="atlas-agenda-title">
                        {item.title}
                      </div>

                      <div className="atlas-agenda-sub">
                        {item.subtitle}
                      </div>
                    </div>

                    <span className="atlas-agenda-pill">
                      {item.priority.toUpperCase()}
                    </span>
                  </div>
                )
              )
            ) : (
              <div className="atlas-empty">
                No priority agenda items
                detected.
              </div>
            )}
          </article>

          <article className="atlas-card atlas-compact-card">
            <div className="atlas-section-head compact">
              <div>
                <h3>
                  Waiting on
                </h3>

                <p>
                  Dependencies with growing
                  execution cost.
                </p>
              </div>

              <button className="atlas-text-btn">
                VIEW ALL →
              </button>
            </div>

            {waitingOn.length >
            0 ? (
              waitingOn
                .slice(0, 4)
                .map((item) => (
                  <div
                    className="atlas-waiting-item"
                    key={item.id}
                  >
                    <div className="atlas-waiting-top">
                      <strong>
                        {item.person}
                      </strong>

                      <span>
                        {ageLabel(
                          item.requested_on
                        )}
                      </span>
                    </div>

                    <p>
                      {item.item}
                    </p>
                  </div>
                ))
            ) : (
              <div className="atlas-empty">
                No external dependencies
                are currently waiting.
              </div>
            )}
          </article>
        </section>

        <section className="atlas-live-domain-strip">
          <div>
            <span>
              Projects
            </span>

            <strong>
              {projects.length}
            </strong>
          </div>

          <div>
            <span>
              Actions
            </span>

            <strong>
              {actions.length}
            </strong>
          </div>

          <div>
            <span>
              Decisions
            </span>

            <strong>
              {decisions.length}
            </strong>
          </div>

          <div>
            <span>
              Waiting On
            </span>

            <strong>
              {waitingOn.length}
            </strong>
          </div>

          <div>
            <span>
              Relationships
            </span>

            <strong>
              {
                state.relationships
                  .length
              }
            </strong>
          </div>

          <div>
            <span>
              Signals
            </span>

            <strong>
              {state.signals.length}
            </strong>
          </div>
        </section>
      </div>

      <DetailDrawer
        open={drawer !== null}
        eyebrow={
          drawer?.eyebrow ?? ""
        }
        title={
          drawer?.title ?? ""
        }
        onClose={() =>
          setDrawer(null)
        }
      >
        <p>{drawer?.body}</p>
      </DetailDrawer>
    </>
  )
}