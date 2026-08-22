type ChiefOfStaffBriefProps = {
  projectCount: number
  criticalCount: number
  attentionCount: number
}

export default function ChiefOfStaffBrief({
  projectCount,
  criticalCount,
  attentionCount,
}: ChiefOfStaffBriefProps) {
  return (
    <section className="brief-card">
      <p className="section-label">CHIEF OF STAFF BRIEF</p>

      <h2>Protect your highest-leverage work.</h2>

      <p>
        You currently have {projectCount} active projects, {criticalCount} marked
        critical, and {attentionCount} requiring attention. MichaelOS will use
        these signals to determine what deserves your focus first.
      </p>
    </section>
  )
}