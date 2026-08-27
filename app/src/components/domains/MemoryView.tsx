import {
  useState,
} from "react"

import type {
  MemoryIntelligenceItem,
} from "../../engine/memoryIntelligenceEngine"

import type {
  ExecutiveState,
} from "../../types/executiveState"

import "./DomainViews.css"
import "./MemoryView.css"

type Filter =
  | "all"
  | "commitment"
  | "decision"
  | "lesson"
  | "pattern"

export default function MemoryView({
  state,
}: {
  state: ExecutiveState
}) {
  const [
    filter,
    setFilter,
  ] =
    useState<Filter>(
      "all"
    )

  const [
    selected,
    setSelected,
  ] =
    useState<MemoryIntelligenceItem | null>(
      null
    )

  const intelligence =
    state.memoryIntelligence

  const visible =
    filter === "all"
      ? intelligence.queue
      : intelligence.queue.filter(
          (item) =>
            item.memoryType ===
            filter
        )

  return (
    <div className="domain-page memory-page">
      <section className="domain-hero memory-hero">
        <div>
          <div className="domain-overline">
            MEMORY INTELLIGENCE
          </div>

          <h2>
            Memory
          </h2>

          <p>
            MichaelOS should not remember
            everything equally. Atlas keeps
            durable commitments, decisions,
            lessons, and recurring patterns
            visible when they can change a
            future judgment.
          </p>
        </div>

        <div className="memory-hero-recommendation">
          <small>
            ATLAS REMEMBERS
          </small>

          <strong>
            {
              intelligence
                .recommendation
                .title
            }
          </strong>

          <span>
            {
              intelligence
                .recommendation
                .detail
            }
          </span>

          <em>
            {
              intelligence
                .recommendation
                .confidence
            }
            % confidence
          </em>
        </div>
      </section>

      <div className="domain-stats">
        <div className="domain-stat">
          <span>
            ACTIVE MEMORIES
          </span>

          <strong>
            {
              intelligence
                .stats.active
            }
          </strong>
        </div>

        <div className="domain-stat">
          <span>
            COMMITMENTS
          </span>

          <strong>
            {
              intelligence
                .stats
                .commitments
            }
          </strong>
        </div>

        <div className="domain-stat">
          <span>
            DECISIONS
          </span>

          <strong>
            {
              intelligence
                .stats.decisions
            }
          </strong>
        </div>

        <div className="domain-stat">
          <span>
            LESSONS + PATTERNS
          </span>

          <strong>
            {
              intelligence
                .stats.lessons +
              intelligence
                .stats.patterns
            }
          </strong>
        </div>
      </div>

      <section className="domain-card">
        <div className="memory-toolbar">
          <div>
            <h3>
              Executive memory
            </h3>

            <div className="domain-sub">
              Ranked by importance,
              recency, linkage, and
              likelihood of affecting a
              future decision.
            </div>
          </div>

          <div className="memory-filters">
            <FilterButton
              active={
                filter === "all"
              }
              onClick={() =>
                setFilter("all")
              }
            >
              All
            </FilterButton>

            <FilterButton
              active={
                filter ===
                "commitment"
              }
              onClick={() =>
                setFilter(
                  "commitment"
                )
              }
            >
              Commitments
            </FilterButton>

            <FilterButton
              active={
                filter ===
                "decision"
              }
              onClick={() =>
                setFilter(
                  "decision"
                )
              }
            >
              Decisions
            </FilterButton>

            <FilterButton
              active={
                filter ===
                "lesson"
              }
              onClick={() =>
                setFilter("lesson")
              }
            >
              Lessons
            </FilterButton>

            <FilterButton
              active={
                filter ===
                "pattern"
              }
              onClick={() =>
                setFilter(
                  "pattern"
                )
              }
            >
              Patterns
            </FilterButton>
          </div>
        </div>

        {visible.length >
        0 ? (
          <div className="memory-list">
            {visible.map(
              (
                item,
                index
              ) => (
                <button
                  className="memory-row"
                  key={item.id}
                  onClick={() =>
                    setSelected(
                      item
                    )
                  }
                >
                  <div className="memory-rank">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="memory-main">
                    <div className="memory-title-row">
                      <strong>
                        {
                          item.title
                        }
                      </strong>

                      <span className="memory-type">
                        {
                          item.memoryType
                        }
                      </span>
                    </div>

                    <p>
                      {
                        item.content
                      }
                    </p>

                    <span>
                      {item.projectName ??
                        item.relationshipName ??
                        item.source ??
                        "Cross-domain memory"}
                    </span>
                  </div>

                  <div className="memory-meta">
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
                      {
                        item.priority
                      }
                    </span>

                    <span className="domain-chip">
                      {
                        item.relevanceScore
                      }{" "}
                      relevance
                    </span>

                    <span className="domain-chip gray">
                      {
                        item.ageDays
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
            No memories match this
            view.
          </div>
        )}
      </section>

      <div className="domain-grid">
        <section className="domain-card domain-span-8">
          <h3>
            Memory operating model
          </h3>

          <div className="domain-sub">
            Preserve the information that
            should change future judgment.
          </div>

          <div className="memory-model-grid">
            <ModelCard
              title="Commitments"
              value={
                intelligence
                  .commitments
                  .length
              }
              detail="Promises and obligations that should remain visible until explicitly closed."
            />

            <ModelCard
              title="Decisions"
              value={
                intelligence
                  .decisions
                  .length
              }
              detail="Prior choices and rationale that prevent unnecessary re-litigation."
            />

            <ModelCard
              title="Lessons"
              value={
                intelligence
                  .lessons
                  .length
              }
              detail="Experience converted into reusable operating guidance."
            />

            <ModelCard
              title="Patterns"
              value={
                intelligence
                  .patterns
                  .length
              }
              detail="Repeated behavior that may predict future outcomes."
            />
          </div>
        </section>

        <aside className="domain-card domain-span-4">
          <h3>
            Memory policy
          </h3>

          <div className="domain-callout">
            <small>
              REMEMBER
            </small>

            <p>
              Preserve facts only when
              they are likely to change a
              future decision, commitment,
              relationship, or
              recommendation.
            </p>
          </div>

          <div className="domain-callout">
            <small>
              FORGET
            </small>

            <p>
              Archive stale context that
              no longer changes judgment
              or execution.
            </p>
          </div>

          <div className="domain-callout">
            <small>
              REOPEN
            </small>

            <p>
              Prior decisions should only
              be revisited when material
              new evidence changes the
              decision landscape.
            </p>
          </div>
        </aside>
      </div>

      {selected && (
        <div
          className="memory-drawer-backdrop"
          onClick={() =>
            setSelected(null)
          }
        >
          <aside
            className="memory-drawer"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <button
              className="memory-drawer-close"
              onClick={() =>
                setSelected(
                  null
                )
              }
            >
              ×
            </button>

            <div className="domain-overline">
              MEMORY INTELLIGENCE
            </div>

            <h2>
              {selected.title}
            </h2>

            <p className="memory-drawer-type">
              {
                selected.memoryType
              }{" "}
              •{" "}
              {
                selected.status
              }
            </p>

            <div className="memory-score-grid">
              <div>
                <strong>
                  {
                    selected.relevanceScore
                  }
                </strong>

                <span>
                  RELEVANCE
                </span>
              </div>

              <div>
                <strong>
                  {
                    selected.importance
                  }
                </strong>

                <span>
                  IMPORTANCE
                </span>
              </div>

              <div>
                <strong>
                  {
                    selected.confidence
                  }
                </strong>

                <span>
                  CONFIDENCE
                </span>
              </div>
            </div>

            <div className="domain-callout">
              <small>
                MEMORY
              </small>

              <p>
                {
                  selected.content
                }
              </p>
            </div>

            <div className="domain-callout">
              <small>
                WHY IT MATTERS
              </small>

              <p>
                {
                  selected.whyItMatters
                }
              </p>
            </div>

            <div className="domain-callout">
              <small>
                NEXT USE
              </small>

              <p>
                {
                  selected.nextUse
                }
              </p>
            </div>

            <div className="domain-callout">
              <small>
                LINKAGE
              </small>

              <p>
                {selected.projectName ??
                  selected.relationshipName ??
                  "No direct project or relationship linkage."}
              </p>
            </div>

            <div className="domain-callout">
              <small>
                SOURCE
              </small>

              <p>
                {selected.source ??
                  "Manual / MichaelOS"}{" "}
                •{" "}
                {
                  selected.ageDays
                }{" "}
                day(s) old
              </p>
            </div>

            {selected.tags
              .length >
              0 && (
              <div className="domain-callout">
                <small>
                  TAGS
                </small>

                <p>
                  {
                    selected.tags.join(
                      " • "
                    )
                  }
                </p>
              </div>
            )}

            <div className="domain-callout">
              <small>
                WHY IT RANKS HERE
              </small>

              <p>
                {
                  selected.scoreReasons.join(
                    " • "
                  )
                }
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
  children:
    React.ReactNode
}) {
  return (
    <button
      className={`memory-filter ${
        active
          ? "active"
          : ""
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
    <div className="memory-model-card">
      <strong>
        {value}
      </strong>

      <h4>
        {title}
      </h4>

      <p>
        {detail}
      </p>
    </div>
  )
}
