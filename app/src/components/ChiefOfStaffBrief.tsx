import { buildExecutiveBrief } from "../engine/chiefOfStaff"
import type { Project } from "../types/project"

type ChiefOfStaffBriefProps = {

  projects: Project[]

}

export default function ChiefOfStaffBrief({
  projects,
}: ChiefOfStaffBriefProps) {
  const brief = buildExecutiveBrief(projects)
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