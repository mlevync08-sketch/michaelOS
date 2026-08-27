import type { ExecutiveState } from "../../types/executiveState"
import "./DomainViews.css"
import "./CapacityView.css"

export default function CapacityView({
  state,
}: {
  state: ExecutiveState
}) {
  const capacity =
    state.capacityIntelligence

  return (
    <div className="domain-page capacity-page">
      <section className="domain-hero capacity-hero">
        <div>
          <div className="domain-overline">
            EXECUTIVE CAPACITY
          </div>

          <h2>Capacity</h2>

          <p>
            Capacity is not a health dashboard.
            Atlas uses health and workload only
            when they should change timing,
            focus, or executive load.
          </p>
        </div>

        <div className="capacity-hero-recommendation">
          <small>ATLAS RECOMMENDS</small>

          <strong>
            {capacity.recommendation.title}
          </strong>

          <span>
            {capacity.recommendation.detail}
          </span>

          <em>
            {capacity.recommendation.confidence}%
            confidence
          </em>
        </div>
      </section>

      <div className="domain-stats">
        <div className="domain-stat">
          <span>READINESS</span>
          <strong>
            {capacity.readinessScore}
          </strong>
        </div>

        <div className="domain-stat">
          <span>WORKLOAD PRESSURE</span>
          <strong>
            {capacity.workloadPressure}
          </strong>
        </div>

        <div className="domain-stat">
          <span>FOCUS CAPACITY</span>
          <strong>
            {capacity.focusCapacityMinutes}m
          </strong>
        </div>

        <div className="domain-stat">
          <span>HEALTH DATA</span>
          <strong>
            {capacity.healthConnected
              ? "LIVE"
              : "PROXY"}
          </strong>
        </div>
      </div>

      <div className="capacity-main-grid">
        <section className="domain-card capacity-readiness-card">
          <div className="capacity-readiness-header">
            <div>
              <h3>Executive readiness</h3>
              <div className="domain-sub">
                Readiness blends focus baseline,
                available health signals, and
                current executive load.
              </div>
            </div>

            <span
              className={`capacity-state ${capacity.state}`}
            >
              {capacity.state.toUpperCase()}
            </span>
          </div>

          <div className="capacity-gauge-wrap">
            <div
              className="capacity-gauge"
              style={{
                background: `conic-gradient(
                  #0aa6a6 0 ${capacity.readinessScore}%,
                  #e7eff0 ${capacity.readinessScore}% 100%
                )`,
              }}
            >
              <div className="capacity-gauge-inner">
                <strong>
                  {capacity.readinessScore}
                </strong>
                <span>READINESS</span>
              </div>
            </div>

            <div className="capacity-gauge-copy">
              <h4>
                {capacity.state === "ready"
                  ? "Capacity supports high-leverage depth."
                  : capacity.state === "balanced"
                  ? "Capacity is workable, but should be protected."
                  : "Capacity is constrained. Narrow the day."}
              </h4>

              <p>
                Atlas estimates approximately{" "}
                <strong>
                  {capacity.focusCapacityMinutes}
                </strong>{" "}
                minutes of meaningful focused
                capacity before the day should
                shift toward lower-context work.
              </p>
            </div>
          </div>
        </section>

        <aside className="domain-card capacity-load-card">
          <h3>Executive load</h3>

          <div className="capacity-load-list">
            <LoadRow
              label="High-leverage actions"
              value={
                capacity.workload
                  .highLeverageActions
              }
            />

            <LoadRow
              label="Deep-work items"
              value={
                capacity.workload.deepWorkItems
              }
            />

            <LoadRow
              label="Decide now"
              value={
                capacity.workload.decideNow
              }
            />

            <LoadRow
              label="Critical dependencies"
              value={
                capacity.workload
                  .criticalDependencies
              }
            />

            <LoadRow
              label="Red projects"
              value={
                capacity.workload.redProjects
              }
            />
          </div>
        </aside>
      </div>

      <div className="domain-grid">
        <section className="domain-card domain-span-8">
          <h3>Capacity policy</h3>

          <div className="domain-sub">
            Translate readiness into operating
            behavior.
          </div>

          <div className="capacity-policy-grid">
            <PolicyColumn
              title="Protect"
              items={capacity.policies.protect}
              className="protect"
            />

            <PolicyColumn
              title="Reduce"
              items={capacity.policies.reduce}
              className="reduce"
            />

            <PolicyColumn
              title="Defer"
              items={capacity.policies.defer}
              className="defer"
            />
          </div>
        </section>

        <aside className="domain-card domain-span-4">
          <h3>Health signal status</h3>

          <div className="domain-sub">
            What Atlas can currently see.
          </div>

          <SignalRow
            label="Recovery"
            value={
              capacity.healthSignals.recovery
            }
          />

          <SignalRow
            label="Sleep"
            value={capacity.healthSignals.sleep}
          />

          <SignalRow
            label="Resting HR"
            value={
              capacity.healthSignals
                .restingHeartRate
            }
          />

          <SignalRow
            label="HRV"
            value={capacity.healthSignals.hrv}
          />

          {!capacity.healthConnected && (
            <div className="domain-callout capacity-proxy-note">
              <small>PROXY MODE</small>
              <p>
                Atlas is currently using portfolio
                load and focus-score signals as a
                deterministic capacity proxy until
                richer health data is available.
              </p>
            </div>
          )}
        </aside>
      </div>

      <section className="domain-card capacity-explain-card">
        <div>
          <div className="domain-overline">
            WHY THIS SCORE
          </div>
          <h3>Explainability</h3>
        </div>

        <div className="capacity-reasons">
          {capacity.scoreReasons.map(
            (reason) => (
              <div
                className="capacity-reason"
                key={reason}
              >
                <span>→</span>
                <p>{reason}</p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  )
}

function LoadRow({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="capacity-load-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function PolicyColumn({
  title,
  items,
  className,
}: {
  title: string
  items: string[]
  className: string
}) {
  return (
    <div
      className={`capacity-policy-column ${className}`}
    >
      <h4>{title}</h4>

      {items.length ? (
        items.map((item) => (
          <div
            className="capacity-policy-item"
            key={item}
          >
            <span>→</span>
            <p>{item}</p>
          </div>
        ))
      ) : (
        <p className="capacity-policy-empty">
          No specific guidance.
        </p>
      )}
    </div>
  )
}

function SignalRow({
  label,
  value,
}: {
  label: string
  value: number | null
}) {
  return (
    <div className="capacity-signal-row">
      <span>{label}</span>
      <strong>
        {value ?? "—"}
      </strong>
    </div>
  )
}
