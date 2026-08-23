import type { Project } from "../types/project"

export type ExecutiveBrief = {
  mission: string
  risk: string
  opportunity: string
}

function scoreProject(project: Project): number {
  let score = 0

  switch (project.priority) {
    case "Critical":
      score += 40
      break
    case "High":
      score += 30
      break
    case "Medium":
      score += 20
      break
    case "Low":
      score += 10
      break
  }

  switch (project.health) {
    case "Red":
      score += 30
      break
    case "Amber":
      score += 15
      break
    case "Green":
      break
  }

  if (project.blocker) score += 25
  if (project.next_action) score += 5
  if (project.status === "Active") score += 10

  return score
}

export function buildExecutiveBrief(
  projects: Project[]
): ExecutiveBrief {
  if (projects.length === 0) {
    return {
      mission: "No active projects.",
      risk: "No execution risks detected.",
      opportunity: "Add projects to begin prioritization."
    }
  }

  const ranked = [...projects].sort(
    (a, b) => scoreProject(b) - scoreProject(a)
  )

  const top = ranked[0]

  return {
    mission: `${top.name}: ${top.next_action ?? "Advance the next milestone."}`,
    risk: top.blocker ?? "No blockers reported.",
    opportunity: top.next_milestone ?? "Continue execution."
  }
}