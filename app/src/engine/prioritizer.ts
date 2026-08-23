import type { Project } from "../types/project"

export type RankedProject = Project & {
  score: number
  reasons: string[]
}

function priorityScore(priority: Project["priority"]): number {
  switch (priority) {
    case "critical":
      return 40
    case "high":
      return 30
    case "medium":
      return 20
    case "low":
      return 10
  }
}

function healthScore(health: Project["health"]): number {
  switch (health) {
    case "red":
      return 30
    case "amber":
      return 15
    case "green":
      return 0
  }
}

export function scoreProject(project: Project): RankedProject {
  let score = 0
  const reasons: string[] = []

  const pScore = priorityScore(project.priority)
  score += pScore
  reasons.push(`${project.priority} priority (+${pScore})`)

  const hScore = healthScore(project.health)
  score += hScore

  if (hScore > 0) {
    reasons.push(`${project.health} health (+${hScore})`)
  }

  if (project.blocker) {
    score += 25
    reasons.push("Active blocker (+25)")
  }

  if (project.next_action) {
    score += 5
    reasons.push("Clear next action (+5)")
  }

  if (project.status === "Active") {
    score += 10
    reasons.push("Active project (+10)")
  }

  return {
    ...project,
    score,
    reasons,
  }
}

export function rankProjects(projects: Project[]): RankedProject[] {
  return projects
    .map(scoreProject)
    .sort((a, b) => b.score - a.score)
}