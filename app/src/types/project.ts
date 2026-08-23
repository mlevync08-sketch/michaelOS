export type Project = {
  id: string
  name: string
  status: string
  health: "green" | "amber" | "red"
  priority: "low" | "medium" | "high" | "critical"
  next_milestone: string | null
  blocker: string | null
  next_action: string | null
  owner: string | null
}