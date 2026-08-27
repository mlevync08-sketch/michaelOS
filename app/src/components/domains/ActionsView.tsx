import { useState } from "react"
import type {
  ActionIntelligenceItem,
  ActionCategory,
} from "../../engine/actionEngine"
import type { ExecutiveState } from "../../types/executiveState"
import "./DomainViews.css"
import "./ActionsView.css"

type Filter =
  | "all"
  | "deep_work"
  | "quick_win"
  | "delegated"
  | "execution"

const categoryLabel: Record<ActionCategory, string> = {
  deep_work: "Deep Work",
  quick_win: "Quick Win",
  delegated: "Delegated",
  execution: "Execution",
}

export default function ActionsView({
  state,
}: {
  state: ExecutiveState
}) {
  const [filter, setFilter] =
    useState<Filter>("all")
  const [selected, setSelected] =
    useState<ActionIntelligenceItem | null>(
      null
    )

  const intelligence =
    state.actionIntelligence

  const visible =
    filter === "all"
      ? intelligence.queue
      : intelligence.queue.filter(
          (item) => item.category === filter
        )

  return (
    <div className="domain-page actions-page">
      <section className="domain-hero actions-hero">
        <div>
          <div className="domain-overline">
            EXECUTION ENGINE
          </div>

          <h2>Actions</h2>

          <p>
            The work required to convert executive
            judgment into forward motion—ranked by
            leverage, urgency, execution cost, and
            delegation opportunity.
          </p>
        </div>

        <div className="actions-hero-recommendation">
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
          <span>ACTION UNIVERSE</span>
          <strong>
            {intelligence.stats.total}
          </strong>
        </div>

        <div className="domain-stat">
          <span>DEEP WORK</span>
          <strong>
            {intelligence.stats.deepWork}
          </strong>
        </div>

        <div className="domain-stat">
          <span>QUICK WINS</span>
          <strong>
            {
              intelligence.stats
                .quickWins
            }
          </strong>
        </div>

        <div className="domain-stat">
          <span>DELEGATED</span>
          <strong>
            {
              intelligence.stats
                .delegated
            }
          </strong>
        </div>
      </div>

      <section className="domain-card">
        <div className="actions-toolbar">
          <div>
            <h3>Executive action queue</h3>
            <div className="domain-sub">
              Atlas ranks actions by consequence,
              urgency, project health, blocker
              relief, and execution cost.
            </div>
          </div>

          <div className="actions-filters">
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
                filter === "deep_work"
              }
              onClick={() =>
                setFilter("deep_work")
              }
            >
              Deep Work
            </FilterButton>

            <FilterButton
              active={
                filter === "quick_win"
              }
              onClick={() =>
                setFilter("quick_win")
              }
            >
              Quick Wins
            </FilterButton>

            <FilterButton
              active={
                filter === "delegated"
              }
              onClick={() =>
                setFilter("delegated")
              }
            >
              Delegated
            </FilterButton>
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="actions-list">
            {visible.map((item, index) => (
              <button
                className="action-intelligence-row"
                key={item.id}
                onClick={() =>
                  setSelected(item)
                }
              >
                <div className="action-rank">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <div className="action-content">
                  <div className="action-title-row">
                    <strong>
                      {item.title}
                    </strong>

                    {item.source ===
                      "project_fallback" && (
                      <span className="action-source">
                        PROJECT NEXT MOVE
                      </span>
                    )}
                  </div>

                  <p>
                    {item.projectName ??
                      "Standalone action"}
                    {" • "}
                    {item.owner ??
                      "Michael"}
                  </p>
                </div>

                <div className="action-meta">
                  <span className="action-time">
                    {
                      item.estimatedMinutes
                    }
                    m
                  </span>

                  <span
                    className={`domain-chip ${
                      item.leverage ===
                      "critical"
                        ? "red"
                        : item.leverage ===
                          "high"
                        ? "amber"
                        : "gray"
                    }`}
                  >
                    {item.leverage}
                  </span>

                  <span className="domain-chip">
                    {
                      categoryLabel[
                        item.category
                      ]
                    }
                  </span>
                </div>

                <div className="action-score">
                  <strong>
                    {item.score}
                  </strong>
                  <small>SCORE</small>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="domain-empty">
            No actions match this queue.
          </div>
        )}
      </section>

      <div className="domain-grid">
        <section className="domain-card domain-span-8">
          <h3>Today's execution mix</h3>
          <div className="domain-sub">
            Protect depth, harvest low-cost wins,
            and delegate work that should not
            consume executive focus.
          </div>

          <div className="actions-mix-grid">
            <MixCard
              title="Deep Work"
              count={
                intelligence.deepWork.length
              }
              detail="Longer focus blocks tied to high-value execution."
            />

            <MixCard
              title="Quick Wins"
              count={
                intelligence.quickWins.length
              }
              detail="Low execution cost with meaningful closure value."
            />

            <MixCard
              title="Delegated"
              count={
                intelligence.delegated.length
              }
              detail="Work that should move without consuming your focus block."
            />
          </div>
        </section>

        <aside className="domain-card domain-span-4">
          <h3>Execution policy</h3>
          <div className="domain-sub">
            How Atlas thinks about your action
            queue.
          </div>

          <div className="domain-callout">
            <small>FIRST BLOCK</small>
            <p>
              Start with one high-leverage Deep
              Work item before opening the day to
              context switching.
            </p>
          </div>

          <div className="domain-callout">
            <small>QUICK WINS</small>
            <p>
              Batch sub-20-minute actions rather
              than allowing them to interrupt
              strategy work.
            </p>
          </div>

          <div className="domain-callout">
            <small>DELEGATION</small>
            <p>
              A delegated action remains visible
              until ownership and completion are
              explicit.
            </p>
          </div>
        </aside>
      </div>

      {selected && (
        <div
          className="action-drawer-backdrop"
          onClick={() =>
            setSelected(null)
          }
        >
          <aside
            className="action-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="action-drawer-close"
              onClick={() =>
                setSelected(null)
              }
            >
              ×
            </button>

            <div className="domain-overline">
              ACTION INTELLIGENCE
            </div>

            <h2>{selected.title}</h2>

            <p className="action-drawer-project">
              {selected.projectName ??
                "Standalone action"}
            </p>

            <div className="action-drawer-score">
              <strong>
                {selected.score}
              </strong>
              <span>
                Executive action score
              </span>
            </div>

            <div className="domain-callout">
              <small>CLASSIFICATION</small>
              <p>
                {
                  categoryLabel[
                    selected.category
                  ]
                }{" "}
                • {selected.estimatedMinutes}{" "}
                minutes • {selected.leverage}{" "}
                leverage
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

            <div className="domain-callout">
              <small>OWNERSHIP</small>
              <p>
                {selected.owner ??
                  "Michael"}{" "}
                •{" "}
                {selected.dueDate ??
                  "No due date"}
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
      className={`actions-filter ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function MixCard({
  title,
  count,
  detail,
}: {
  title: string
  count: number
  detail: string
}) {
  return (
    <div className="action-mix-card">
      <strong>{count}</strong>
      <h4>{title}</h4>
      <p>{detail}</p>
    </div>
  )
}
