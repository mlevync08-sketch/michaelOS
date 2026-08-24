import type { ExecutiveDashboard } from "../engine/brain"

type ChiefOfStaffBriefProps = {
  dashboard: ExecutiveDashboard
}

export default function ChiefOfStaffBrief({
  dashboard,
}: ChiefOfStaffBriefProps) {
  return (
    <section className="brief-card">
      <p className="section-label">MORNING EXECUTIVE BRIEF</p>

      <h2>Protect your highest-leverage work.</h2>

      <div className="brief-item">
        <strong>Today's Mission</strong>

        <p>
          <strong>{dashboard.mission.title}</strong>
          <br />
          {dashboard.mission.detail}
        </p>

        <p>
          Estimated focus: {dashboard.mission.estimatedFocusMinutes} min
          <br />
          Confidence: {dashboard.confidence}%
        </p>
      </div>

      <div className="brief-item">
        <strong>Why Today Matters</strong>
        <p>{dashboard.why}</p>
      </div>

      <div className="brief-item">
        <strong>If Ignored</strong>
        <p>{dashboard.consequence}</p>
      </div>

      <div className="brief-item">
        <strong>What Success Looks Like</strong>
        <p>{dashboard.success}</p>
      </div>

      <div className="brief-item">
        <strong>Highest Risk</strong>
        <p>{dashboard.risk}</p>
      </div>

      <div className="brief-item">
        <strong>Highest Leverage</strong>
        <p>{dashboard.opportunity}</p>
      </div>

      <div className="brief-item">
        <strong>Recommended Next Step</strong>
        <p>{dashboard.recommendation}</p>
      </div>

      <div className="brief-item">
        <strong>Strategic Impact</strong>
        <p>{dashboard.impact}</p>
      </div>
    </section>
  )
}