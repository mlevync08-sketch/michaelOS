import { runMichaelOSKernel } from "../kernel/kernel"
import type { Project } from "../types/project"

type ChiefOfStaffBriefProps = {

  projects: Project[]

}

export default function ChiefOfStaffBrief({
  projects,
}: ChiefOfStaffBriefProps) {
const dashboard = runMichaelOSKernel({
  projects,
})
  return (
    <section className="brief-card">
      <p className="section-label">CHIEF OF STAFF BRIEF</p>

      <h2>Protect your highest-leverage work.</h2>

  <div className="brief-item">

  <strong>Today's Mission</strong>

  <p>{dashboard.mission}</p>

</div>

<div className="brief-item">

  <strong>Highest Risk</strong>

  <p>{dashboard.risk}</p>

</div>

<div className="brief-item">

  <strong>Biggest Opportunity</strong>

  <p>{dashboard.opportunity}</p>

</div>
    </section>
  )
}