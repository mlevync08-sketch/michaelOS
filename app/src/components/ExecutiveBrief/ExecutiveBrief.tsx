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
          <p className="section-label">ATLAS MORNING NARRATIVE</p>
          <h2>{dashboard.narrative.headline}</h2>
        </div>

        <div className="executive-brief-meta">
          <span>
            {dashboard.mission.estimatedFocusMinutes} min focus
          </span>
          <span>
            {dashboard.narrative.confidence}% confidence
          </span>
        </div>
      </div>

      <div className="executive-narrative">
        <p className="executive-narrative-label">
          WHAT I BELIEVE
        </p>

        <p className="executive-narrative-judgment">
          {dashboard.narrative.executiveJudgment}
        </p>

        <div className="executive-narrative-recommendation">
          <span>MY RECOMMENDATION</span>
          <p>{dashboard.narrative.recommendation}</p>
        </div>
      </div>

      {dashboard.narrative.supportingEvidence.length > 0 && (
        <div className="executive-evidence">
          <p className="executive-narrative-label">
            WHY I BELIEVE THIS
          </p>

          <div className="executive-evidence-list">
            {dashboard.narrative.supportingEvidence.map(
              (evidence, index) => (
                <div
                  className="executive-evidence-item"
                  key={`${evidence}-${index}`}
                >
                  <span>{index + 1}</span>
                  <p>{evidence}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div className="executive-brief-support">
        <div className="executive-brief-support-item">
          <span>If Ignored</span>
          <p>{dashboard.context.ifIgnored}</p>
        </div>

        <div className="executive-brief-support-item">
          <span>What Success Looks Like</span>
          <p>{dashboard.context.successLooksLike}</p>
        </div>

        <div className="executive-brief-support-item">
          <span>Highest Leverage</span>
          <p>{dashboard.context.highestLeverage}</p>
        </div>
      </div>

      <div className="executive-brief-footer">
        <span>Strategic Impact</span>
        <strong>{dashboard.metrics.impact}</strong>
      </div>
    </section>
  )
}