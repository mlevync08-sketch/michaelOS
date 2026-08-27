import { useState } from "react"
import type { RelationshipIntelligenceItem } from "../../engine/relationshipEngine"
import type { ExecutiveState } from "../../types/executiveState"
import "./DomainViews.css"
import "./RelationshipsView.css"

export default function RelationshipsView({
  state,
}: {
  state: ExecutiveState
}) {
  const [selected, setSelected] =
    useState<RelationshipIntelligenceItem | null>(null)

  const intelligence =
    state.relationshipIntelligence

  return (
    <div className="domain-page relationships-page">
      <section className="domain-hero relationships-hero">
        <div>
          <div className="domain-overline">
            RELATIONSHIP INTELLIGENCE
          </div>

          <h2>Relationships</h2>

          <p>
            Strategic relevance, relationship
            health, interaction recency, open
            loops, project linkage, and the next
            move Atlas believes will create the
            most leverage.
          </p>
        </div>

        <div className="relationship-hero-recommendation">
          <small>ATLAS RECOMMENDS</small>
          <strong>
            {
              intelligence.recommendation
                .title
            }
          </strong>
          <span>
            {
              intelligence.recommendation
                .detail
            }
          </span>
          <em>
            {
              intelligence.recommendation
                .confidence
            }
            % confidence
          </em>
        </div>
      </section>

      <div className="domain-stats">
        <div className="domain-stat">
          <span>RELATIONSHIPS</span>
          <strong>
            {intelligence.stats.total}
          </strong>
        </div>

        <div className="domain-stat">
          <span>PRIORITY</span>
          <strong>
            {intelligence.stats.priority}
          </strong>
        </div>

        <div className="domain-stat">
          <span>STALE</span>
          <strong>
            {intelligence.stats.stale}
          </strong>
        </div>

        <div className="domain-stat">
          <span>OPEN LOOPS</span>
          <strong>
            {intelligence.stats.openLoops}
          </strong>
        </div>
      </div>

      <section className="domain-card">
        <h3>Executive network</h3>

        <div className="domain-sub">
          Ranked by strategic relevance,
          commitments, recency, and project
          consequence.
        </div>

        {intelligence.queue.length ? (
          <div className="relationship-list">
            {intelligence.queue.map(
              (item) => (
                <button
                  className="relationship-row"
                  key={item.id}
                  onClick={() =>
                    setSelected(item)
                  }
                >
                  <div className="relationship-score">
                    <strong>
                      {item.score}
                    </strong>
                    <small>SCORE</small>
                  </div>

                  <div className="relationship-main">
                    <strong>
                      {item.name}
                    </strong>

                    <p>
                      {item.role ?? ""}
                      {item.company
                        ? ` • ${item.company}`
                        : ""}
                    </p>

                    <span>
                      {item.nextMove}
                    </span>
                  </div>

                  <div className="relationship-meta">
                    <span
                      className={`domain-chip ${
                        item.priority ===
                        "critical"
                          ? "red"
                          : item.priority ===
                            "high"
                          ? "amber"
                          : "gray"
                      }`}
                    >
                      {item.priority}
                    </span>

                    <span className="domain-chip">
                      {item.openLoops} loops
                    </span>

                    <span className="domain-chip gray">
                      {
                        item.daysSinceInteraction
                      }{" "}
                      days
                    </span>
                  </div>
                </button>
              )
            )}
          </div>
        ) : (
          <div className="domain-empty">
            No relationship records are stored
            yet.
          </div>
        )}
      </section>

      <div className="domain-grid">
        <section className="domain-card domain-span-8">
          <h3>Relationship operating model</h3>

          <div className="domain-sub">
            Spend relationship capital where it
            compounds strategic outcomes.
          </div>

          <div className="relationship-model-grid">
            <ModelCard
              title="Priority"
              value={
                intelligence.priority.length
              }
              detail="High-value relationships that currently justify executive attention."
            />

            <ModelCard
              title="Stale"
              value={
                intelligence.stale.length
              }
              detail="Strategically relevant relationships without recent interaction."
            />

            <ModelCard
              title="Open Loops"
              value={
                intelligence.openLoops.length
              }
              detail="Relationships carrying unresolved commitments or next moves."
            />
          </div>
        </section>

        <aside className="domain-card domain-span-4">
          <h3>Relationship policy</h3>

          <div className="domain-callout">
            <small>RELEVANCE</small>
            <p>
              Not every important person deserves
              equal attention every week. Atlas
              prioritizes current strategic
              consequence.
            </p>
          </div>

          <div className="domain-callout">
            <small>OPEN LOOPS</small>
            <p>
              Unclosed commitments reduce trust.
              Keep ownership and next moves
              explicit.
            </p>
          </div>

          <div className="domain-callout">
            <small>RECENCY</small>
            <p>
              A stale high-value relationship is
              an opportunity signal, not merely a
              CRM reminder.
            </p>
          </div>
        </aside>
      </div>

      {selected && (
        <div
          className="relationship-drawer-backdrop"
          onClick={() =>
            setSelected(null)
          }
        >
          <aside
            className="relationship-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="relationship-drawer-close"
              onClick={() =>
                setSelected(null)
              }
            >
              ×
            </button>

            <div className="domain-overline">
              RELATIONSHIP INTELLIGENCE
            </div>

            <h2>{selected.name}</h2>

            <p className="relationship-drawer-role">
              {selected.role ?? ""}
              {selected.company
                ? ` • ${selected.company}`
                : ""}
            </p>

            <div className="relationship-score-grid">
              <div>
                <strong>
                  {selected.score}
                </strong>
                <span>RELATIONSHIP SCORE</span>
              </div>

              <div>
                <strong>
                  {selected.relevance}
                </strong>
                <span>RELEVANCE</span>
              </div>

              <div>
                <strong>
                  {selected.health}
                </strong>
                <span>HEALTH</span>
              </div>
            </div>

            <div className="domain-callout">
              <small>NEXT MOVE</small>
              <p>
                {selected.nextMove}
              </p>
            </div>

            <div className="domain-callout">
              <small>OPPORTUNITY</small>
              <p>
                {selected.opportunity}
              </p>
            </div>

            <div className="domain-callout">
              <small>RISK</small>
              <p>{selected.risk}</p>
            </div>

            <div className="domain-callout">
              <small>PROJECT LINKAGE</small>
              <p>
                {selected.projectNames.length
                  ? selected.projectNames.join(
                      " • "
                    )
                  : "No linked projects."}
              </p>
            </div>

            <div className="domain-callout">
              <small>OPEN LOOPS</small>
              <p>
                {selected.openLoops} unresolved
                commitment(s)
              </p>
            </div>

            <div className="domain-callout">
              <small>LAST INTERACTION</small>
              <p>
                {
                  selected.daysSinceInteraction
                }{" "}
                day(s) ago
              </p>
            </div>

            <div className="domain-callout">
              <small>WHY IT RANKS HERE</small>
              <p>
                {selected.scoreReasons.join(
                  " • "
                )}
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
    <div className="relationship-model-card">
      <strong>{value}</strong>
      <h4>{title}</h4>
      <p>{detail}</p>
    </div>
  )
}
