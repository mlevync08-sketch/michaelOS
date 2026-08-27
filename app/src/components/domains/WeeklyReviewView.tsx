import type { ExecutiveState } from "../../types/executiveState"
import "./DomainViews.css"
import "./WeeklyReviewView.css"

export default function WeeklyReviewView({
  state,
}: {
  state: ExecutiveState
}) {
  const review = state.weeklyReviewIntelligence

  return (
    <div className="domain-page weekly-review-page">
      <section className="domain-hero dark weekly-review-hero">
        <div className="domain-overline">
          ATLAS WEEKLY REVIEW
        </div>

        <h2>{review.headline}</h2>

        <p>{review.narrative}</p>

        <div className="weekly-momentum">
          <span>MOMENTUM</span>
          <strong>
            {review.momentum
              .replace("_", " ")
              .toUpperCase()}
          </strong>
        </div>
      </section>

      <div className="weekly-metric-grid">
        <Metric
          label="PROJECTS"
          value={review.metrics.projects}
        />
        <Metric
          label="GREEN"
          value={review.metrics.greenProjects}
        />
        <Metric
          label="RED"
          value={review.metrics.redProjects}
        />
        <Metric
          label="HIGH-LEVERAGE ACTIONS"
          value={review.metrics.highLeverageActions}
        />
        <Metric
          label="DECIDE NOW"
          value={review.metrics.decideNow}
        />
        <Metric
          label="CRITICAL DEPENDENCIES"
          value={review.metrics.criticalDependencies}
        />
        <Metric
          label="PRIORITY RELATIONSHIPS"
          value={review.metrics.priorityRelationships}
        />
      </div>

      <div className="domain-grid">
        <section className="domain-card domain-span-8">
          <h3>What moved this week</h3>
          <div className="domain-sub">
            Wins, momentum, and evidence of forward
            execution.
          </div>

          <ReviewList
            items={review.wins}
            empty="No clear wins were detected."
          />
        </section>

        <aside className="domain-card domain-span-4">
          <h3>Execution mix</h3>
          <div className="domain-sub">
            The shape of the action queue.
          </div>

          <div className="weekly-execution-grid">
            <MiniMetric
              label="Deep Work"
              value={review.executionMix.deepWork}
            />
            <MiniMetric
              label="Quick Wins"
              value={review.executionMix.quickWins}
            />
            <MiniMetric
              label="Delegated"
              value={review.executionMix.delegated}
            />
            <MiniMetric
              label="Execution"
              value={review.executionMix.execution}
            />
          </div>
        </aside>
      </div>

      <div className="domain-grid">
        <section className="domain-card domain-span-6">
          <h3>Where work stalled</h3>
          <div className="domain-sub">
            Projects and dependencies that are
            accumulating execution cost.
          </div>

          <ReviewList
            items={review.stalled}
            empty="No major stalls detected."
          />
        </section>

        <section className="domain-card domain-span-6">
          <h3>Decision drag</h3>
          <div className="domain-sub">
            Choices where delay is now part of the
            cost structure.
          </div>

          <ReviewList
            items={review.decisionDrag}
            empty="No material decision drag detected."
          />
        </section>
      </div>

      <div className="domain-grid">
        <section className="domain-card domain-span-6">
          <h3>Relationship movement</h3>
          <div className="domain-sub">
            People whose relevance, recency, or open
            loops changed the week.
          </div>

          <ReviewList
            items={review.relationshipMovement}
            empty="No material relationship movement detected."
          />
        </section>

        <section className="domain-card domain-span-6">
          <h3>Risk movement</h3>
          <div className="domain-sub">
            The risks Atlas would not carry into next
            week without an explicit plan.
          </div>

          <ReviewList
            items={review.riskMovement}
            empty="No dominant risk movement detected."
          />
        </section>
      </div>

      <section className="weekly-next-week">
        <div className="weekly-next-column keep">
          <div className="domain-overline">
            KEEP DOING
          </div>
          <h3>Protect what is working</h3>
          <ReviewList
            items={review.nextWeek.keepDoing}
            empty="No keep-doing guidance."
          />
        </div>

        <div className="weekly-next-column stop">
          <div className="domain-overline">
            STOP DOING
          </div>
          <h3>Remove drag</h3>
          <ReviewList
            items={review.nextWeek.stopDoing}
            empty="No stop-doing guidance."
          />
        </div>

        <div className="weekly-next-column start">
          <div className="domain-overline">
            START DOING
          </div>
          <h3>Create the next advantage</h3>
          <ReviewList
            items={review.nextWeek.startDoing}
            empty="No start-doing guidance."
          />
        </div>
      </section>

      <section className="domain-card weekly-coaching">
        <div>
          <div className="domain-overline">
            ATLAS COACHING
          </div>
          <h3>
            What should change next week?
          </h3>
        </div>

        <p>
          {review.nextWeek.startDoing[0] ??
            review.nextWeek.keepDoing[0] ??
            "Keep the portfolio explicit and protect the highest-leverage work."}
        </p>
      </section>
    </div>
  )
}

function Metric({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="weekly-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function MiniMetric({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="weekly-mini-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function ReviewList({
  items,
  empty,
}: {
  items: string[]
  empty: string
}) {
  if (items.length === 0) {
    return (
      <div className="domain-empty">
        {empty}
      </div>
    )
  }

  return (
    <div className="weekly-review-list">
      {items.map((item) => (
        <div
          className="weekly-review-row"
          key={item}
        >
          <span>→</span>
          <p>{item}</p>
        </div>
      ))}
    </div>
  )
}
