import { useState } from "react"
import type {
  DecisionClass,
  DecisionIntelligenceItem,
} from "../../engine/decisionEngine"
import type { ExecutiveState } from "../../types/executiveState"
import "./DomainViews.css"
import "./DecisionsView.css"

type Filter =
  | "all"
  | "decide_now"
  | "needs_evidence"
  | "watch"

const classLabel: Record<
  DecisionClass,
  string
> = {
  decide_now: "Decide Now",
  needs_evidence: "Needs Evidence",
  watch: "Watch",
}

export default function DecisionsView({
  state,
}: {
  state: ExecutiveState
}) {
  const [filter, setFilter] =
    useState<Filter>("all")
  const [selected, setSelected] =
    useState<DecisionIntelligenceItem | null>(
      null
    )

  const intelligence =
    state.decisionIntelligence

  const visible =
    filter === "all"
      ? intelligence.queue
      : intelligence.queue.filter(
          (item) =>
            item.classification === filter
        )

  return (
    <div className="domain-page decisions-page">
      <section className="domain-hero decisions-hero">
        <div>
          <div className="domain-overline">
            DECISION INTELLIGENCE
          </div>

          <h2>Decisions</h2>

          <p>
            Separate choices from tasks. Atlas
            ranks open decisions by impact,
            urgency, confidence, project health,
            and the consequence of continued
            delay.
          </p>
        </div>

        <div className="decision-hero-recommendation">
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
          <span>OPEN DECISIONS</span>
          <strong>
            {intelligence.stats.total}
          </strong>
        </div>

        <div className="domain-stat">
          <span>DECIDE NOW</span>
          <strong>
            {
              intelligence.stats
                .decideNow
            }
          </strong>
        </div>

        <div className="domain-stat">
          <span>NEEDS EVIDENCE</span>
          <strong>
            {
              intelligence.stats
                .needsEvidence
            }
          </strong>
        </div>

        <div className="domain-stat">
          <span>LOW CONFIDENCE</span>
          <strong>
            {
              intelligence.stats
                .lowConfidence
            }
          </strong>
        </div>
      </div>

      <section className="domain-card">
        <div className="decision-toolbar">
          <div>
            <h3>Executive decision queue</h3>

            <div className="domain-sub">
              The goal is not to maximize
              confidence. It is to make the
              right decision with the right
              amount of evidence.
            </div>
          </div>

          <div className="decision-filters">
            <FilterButton
              active={filter === "all"}
              onClick={() =>
                setFilter("all")
              }
            >
              All
            </FilterButton>

            <FilterButton
              active={
                filter === "decide_now"
              }
              onClick={() =>
                setFilter("decide_now")
              }
            >
              Decide Now
            </FilterButton>

            <FilterButton
              active={
                filter ===
                "needs_evidence"
              }
              onClick={() =>
                setFilter(
                  "needs_evidence"
                )
              }
            >
              Needs Evidence
            </FilterButton>

            <FilterButton
              active={filter === "watch"}
              onClick={() =>
                setFilter("watch")
              }
            >
              Watch
            </FilterButton>
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="decision-list">
            {visible.map((item, index) => (
              <button
                className="decision-row"
                key={item.id}
                onClick={() =>
                  setSelected(item)
                }
              >
                <div className="decision-rank">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <div className="decision-content">
                  <div className="decision-title-row">
                    <strong>
                      {item.title}
                    </strong>

                    <span
                      className={`decision-class ${item.classification}`}
                    >
                      {
                        classLabel[
                          item
                            .classification
                        ]
                      }
                    </span>
                  </div>

                  <p>
                    {item.projectName ??
                      "Cross-domain decision"}
                  </p>

                  <div className="decision-rec">
                    {item.recommendation}
                  </div>
                </div>

                <div className="decision-metrics">
                  <div>
                    <strong>
                      {item.impact}
                    </strong>
                    <small>IMPACT</small>
                  </div>

                  <div>
                    <strong>
                      {item.confidence}
                    </strong>
                    <small>CONFIDENCE</small>
                  </div>

                  <div>
                    <strong>
                      {item.score}
                    </strong>
                    <small>SCORE</small>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="domain-empty">
            No decisions match this queue.
          </div>
        )}
      </section>

      <div className="domain-grid">
        <section className="domain-card domain-span-8">
          <h3>Decision operating model</h3>

          <div className="domain-sub">
            Use reversibility and confidence to
            decide how much evidence is enough.
          </div>

          <div className="decision-model-grid">
            <ModelCard
              title="Decide Now"
              value={
                intelligence.decideNow.length
              }
              detail="High-impact decisions with enough confidence to move."
            />

            <ModelCard
              title="Needs Evidence"
              value={
                intelligence
                  .needsEvidence.length
              }
              detail="Important choices where confidence is still too low."
            />

            <ModelCard
              title="Watch"
              value={
                intelligence.watch.length
              }
              detail="Decisions that matter, but do not yet justify executive focus."
            />
          </div>
        </section>

        <aside className="domain-card domain-span-4">
          <h3>Decision policy</h3>

          <div className="domain-callout">
            <small>REVERSIBLE</small>
            <p>
              Bias toward speed. Preserve the
              option to revisit after new
              evidence arrives.
            </p>
          </div>

          <div className="domain-callout">
            <small>IRREVERSIBLE</small>
            <p>
              Slow down enough to understand
              second-order effects and downside
              exposure.
            </p>
          </div>

          <div className="domain-callout">
            <small>DELAY</small>
            <p>
              Inaction is still a decision. Atlas
              treats consequence-of-delay as an
              explicit cost.
            </p>
          </div>
        </aside>
      </div>

      {selected && (
        <div
          className="decision-drawer-backdrop"
          onClick={() =>
            setSelected(null)
          }
        >
          <aside
            className="decision-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="decision-drawer-close"
              onClick={() =>
                setSelected(null)
              }
            >
              ×
            </button>

            <div className="domain-overline">
              DECISION INTELLIGENCE
            </div>

            <h2>{selected.title}</h2>

            <p className="decision-drawer-project">
              {selected.projectName ??
                "Cross-domain decision"}
            </p>

            <div className="decision-score-grid">
              <div>
                <strong>
                  {selected.score}
                </strong>
                <span>DECISION SCORE</span>
              </div>

              <div>
                <strong>
                  {selected.impact}
                </strong>
                <span>IMPACT</span>
              </div>

              <div>
                <strong>
                  {selected.confidence}
                </strong>
                <span>CONFIDENCE</span>
              </div>
            </div>

            <div className="domain-callout">
              <small>RECOMMENDATION</small>
              <p>
                {selected.recommendation}
              </p>
            </div>

            <div className="domain-callout">
              <small>
                CONSEQUENCE OF DELAY
              </small>
              <p>
                {
                  selected.consequenceOfDelay
                }
              </p>
            </div>

            <div className="domain-callout">
              <small>TRADEOFFS</small>
              <ul className="decision-bullets">
                {selected.tradeoffs.map(
                  (tradeoff) => (
                    <li key={tradeoff}>
                      {tradeoff}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="domain-callout">
              <small>EVIDENCE</small>
              <ul className="decision-bullets">
                {selected.evidence.map(
                  (evidence) => (
                    <li key={evidence}>
                      {evidence}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="domain-callout">
              <small>REVERSIBILITY</small>
              <p>
                {selected.reversible
                  ? "Likely reversible — bias toward speed."
                  : "Potentially irreversible — bias toward evidence and downside review."}
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

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      className={`decision-filter ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
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
    <div className="decision-model-card">
      <strong>{value}</strong>
      <h4>{title}</h4>
      <p>{detail}</p>
    </div>
  )
}
