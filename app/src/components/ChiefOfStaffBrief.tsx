import { buildExecutiveBrief } from "../engine/chiefOfStaff"
type ChiefOfStaffBriefProps = {
  projectCount: number
  criticalCount: number
  attentionCount: number
}

export default function ChiefOfStaffBrief(
  _props: ChiefOfStaffBriefProps
) {
  const brief = buildExecutiveBrief([
  {
    id: "1",
    name: "GTM Command Center",
    status: "Active",
    health: "Green",
    priority: "Critical",
    next_milestone: "Executive Intelligence V1",
    blocker: null,
    next_action: "Complete the Executive Intelligence engine.",
    owner: "Michael",
  },
])
  return (
    <section className="brief-card">
      <p className="section-label">CHIEF OF STAFF BRIEF</p>

      <h2>Protect your highest-leverage work.</h2>

  <div className="brief-item">

  <strong>Today's Mission</strong>

  <p>{brief.mission}</p>

</div>

<div className="brief-item">

  <strong>Highest Risk</strong>

  <p>{brief.risk}</p>

</div>

<div className="brief-item">

  <strong>Biggest Opportunity</strong>

  <p>{brief.opportunity}</p>

</div>
    </section>
  )
}