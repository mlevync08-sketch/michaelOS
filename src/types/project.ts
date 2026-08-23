export type Project = {
  id: string
  name: string
  status: string
  health: "Green" | "Amber" | "Red"
  priority: "Low" | "Medium" | "High" | "Critical"
  next_milestone: string | null
  blocker: string | null
  next_action: string | null
  owner: string | null
}