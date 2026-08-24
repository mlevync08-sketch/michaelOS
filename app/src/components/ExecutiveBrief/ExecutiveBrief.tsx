import type { ExecutiveDashboard } from "../../engine/brain"

type ExecutiveBriefProps = {
  dashboard: ExecutiveDashboard
}

export default function ExecutiveBrief({
  dashboard,
}: ExecutiveBriefProps) {
  return (
    <section className="executive-brief">
      <div className="executive-brief-header">
        <div>
          <p className="section-label">MORNING EXECUTIVE BRIEF</p>
          <h2>Protect your highest-leverage work.</h2>
        </div>

        <div className="executive-brief-meta">
          <span>{dashboard.mission.estimatedFocusMinutes} min focus</span>
          <span>{dashboard.metrics.confidence}% confidence</span>
        </div>
      </div>

      <div className="executive-brief-hero">
        <p className="executive-brief-kicker">TODAY&apos;S MISSION</p>

        <h3>{dashboard.mission.title}</h3>

        <p className="executive-brief-mission">
          {dashboard.mission.detail}
        </p>
      </div>

      <div className="executive-brief-grid">
        <div className="executive-brief-section">
          <span>Why Today Matters</span>
          <p>{dashboard.context.whyToday}</p>
        </div>

        <div className="executive-brief-section">
          <span>If Ignored</span>
          <p>{dashboard.context.ifIgnored}</p>
        </div>

        <div className="executive-brief-section">
          <span>What Success Looks Like</span>
          <p>{dashboard.context.successLooksLike}</p>
        </div>

        <div className="executive-brief-section">
          <span>Watch Out</span>
          <p>{dashboard.context.nextMove}</p>
        </div>

        <div className="executive-brief-section">
          <span>Highest Leverage</span>
          <p>{dashboard.context.highestLeverage}</p>
        </div>

        <div className="executive-brief-section">
          <span>Next Move</span>
          <p>{dashboard.context.nextMove}</p>
        </div>
      </div>

      <div className="executive-brief-footer">
        <span>Strategic Impact</span>
        <strong>{dashboard.metrics.impact}</strong>
      </div>
    </section>
  )
}