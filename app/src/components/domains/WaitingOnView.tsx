import { useState } from "react"
import type { DependencyIntelligenceItem } from "../../engine/dependencyEngine"
import type { ExecutiveState } from "../../types/executiveState"
import "./DomainViews.css"
import "./WaitingOnView.css"

export default function WaitingOnView({
  state,
}: {
  state: ExecutiveState
}) {
  const [selected, setSelected] =
    useState<DependencyIntelligenceItem | null>(null)

  const intelligence = state.dependencyIntelligence

  return (
    <div className="domain-page waiting-page">
      <section className="domain-hero waiting-hero">
        <div>
          <div className="domain-overline">
            DEPENDENCY INTELLIGENCE
          </div>
          <h2>Waiting On</h2>
          <p>
            External dependencies ranked by age,
            priority, project impact, overdue
            follow-up, and execution cost.
          </p>
        </div>

        <div className="waiting-hero-recommendation">
          <small>ATLAS RECOMMENDS</small>
          <strong>
            {intelligence.recommendation.title}
          </strong>
          <span>
            {intelligence.recommendation.detail}
          </span>
          <em>
            {intelligence.recommendation.confidence}%
            confidence
          </em>
        </div>
      </section>

      <div className="domain-stats">
        <div className="domain-stat">
          <span>OPEN DEPENDENCIES</span>
          <strong>{intelligence.stats.total}</strong>
        </div>

        <div className="domain-stat">
          <span>CRITICAL</span>
          <strong>{intelligence.stats.critical}</strong>
        </div>

        <div className="domain-stat">
          <span>FOLLOW-UP OVERDUE</span>
          <strong>
            {intelligence.stats.overdueFollowUps}
          </strong>
        </div>

        <div className="domain-stat">
          <span>BLOCKED PROJECTS</span>
          <strong>
            {intelligence.stats.blockedProjects}
          </strong>
        </div>
      </div>

      <section className="domain-card">
        <h3>Dependency register</h3>
        <div className="domain-sub">
          Escalation is based on consequence and
          aging—not annoyance.
        </div>

        {intelligence.queue.length ? (
          <div className="waiting-list">
            {intelligence.queue.map((item) => (
              <button
                className="waiting-row"
                key={item.id}
                onClick={() => setSelected(item)}
              >
                <div className="waiting-age">
                  <strong>{item.ageDays}</strong>
                  <small>DAYS</small>
                </div>

                <div className="waiting-main">
                  <strong>{item.person}</strong>
                  <p>{item.item}</p>
                  <span>
                    {item.projectName ??
                      "Cross-domain dependency"}
                  </span>
                </div>

                <div className="waiting-meta">
                  <span
                    className={`domain-chip ${
                      item.severity === "critical"
                        ? "red"
                        : item.severity === "high"
                        ? "amber"
                        : "gray"
                    }`}
                  >
                    {item.severity}
                  </span>

                  <span className="domain-chip">
                    {item.escalationScore} score
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="domain-empty">
            No explicit waiting-on records are
            currently open.
          </div>
        )}
      </section>

      <div className="domain-grid">
        <section className="domain-card domain-span-8">
          <h3>Dependency operating model</h3>
          <div className="domain-sub">
            Make external drag explicit and
            visible before it becomes a project
            surprise.
          </div>

          <div className="waiting-model-grid">
            <ModelCard
              title="Critical"
              value={intelligence.critical.length}
              detail="Dependencies with the highest cost of continued delay."
            />
            <ModelCard
              title="Aging"
              value={intelligence.aging.length}
              detail="Open three or more days and accumulating execution cost."
            />
            <ModelCard
              title="Overdue Follow-up"
              value={
                intelligence.overdueFollowUps.length
              }
              detail="Follow-up date has passed without closure."
            />
          </div>
        </section>

        <aside className="domain-card domain-span-4">
          <h3>Dependency policy</h3>
          <div className="domain-callout">
            <small>FOLLOW-UP</small>
            <p>
              The next follow-up date should be
              explicit for every meaningful external
              dependency.
            </p>
          </div>

          <div className="domain-callout">
            <small>ESCALATION</small>
            <p>
              Escalate when business consequence
              rises—not simply because a person is
              slow to respond.
            </p>
          </div>

          <div className="domain-callout">
            <small>PROJECT LINKAGE</small>
            <p>
              Dependencies should show exactly which
              project or milestone they are delaying.
            </p>
          </div>
        </aside>
      </div>

      {selected && (
        <div
          className="waiting-drawer-backdrop"
          onClick={() => setSelected(null)}
        >
          <aside
            className="waiting-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="waiting-drawer-close"
              onClick={() => setSelected(null)}
            >
              ×
            </button>

            <div className="domain-overline">
              DEPENDENCY INTELLIGENCE
            </div>

            <h2>{selected.person}</h2>
            <p className="waiting-drawer-project">
              {selected.projectName ??
                "Cross-domain dependency"}
            </p>

            <div className="waiting-score-grid">
              <div>
                <strong>{selected.ageDays}</strong>
                <span>DAYS OPEN</span>
              </div>

              <div>
                <strong>
                  {selected.escalationScore}
                </strong>
                <span>ESCALATION</span>
              </div>

              <div>
                <strong>
                  {selected.severity.toUpperCase()}
                </strong>
                <span>SEVERITY</span>
              </div>
            </div>

            <div className="domain-callout">
              <small>WAITING FOR</small>
              <p>{selected.item}</p>
            </div>

            <div className="domain-callout">
              <small>SUGGESTED FOLLOW-UP</small>
              <p>{selected.suggestedFollowUp}</p>
            </div>

            <div className="domain-callout">
              <small>PROJECT IMPACT</small>
              <p>
                {selected.blockedProject
                  ? `This dependency is tied to an active blocker: ${selected.blockerText}`
                  : "No direct active project blocker is currently linked."}
              </p>
            </div>

            <div className="domain-callout">
              <small>FOLLOW-UP DATE</small>
              <p>
                {selected.followUpOn ??
                  "No follow-up date set"}
              </p>
            </div>

            <div className="domain-callout">
              <small>WHY IT RANKS HERE</small>
              <p>
                {selected.scoreReasons.join(" • ")}
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

function ModelCard({
  title,
  value,
  detail,
}: {
  title: string
  value: number
  detail: string
}) {
  return (
    <div className="waiting-model-card">
      <strong>{value}</strong>
      <h4>{title}</h4>
      <p>{detail}</p>
    </div>
  )
}
