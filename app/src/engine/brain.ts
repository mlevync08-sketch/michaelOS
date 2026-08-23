import type { Project } from "../types/project"
import { rankProjects } from "./prioritizer"
import { reasonAboutProject } from "./reasoner"

export type ExecutiveDashboard = {
  mission: string
  why: string
  success: string
  risk: string
  opportunity: string
  recommendation: string
  confidence: number
}

export function buildExecutiveDashboard(
  projects: Project[]
): ExecutiveDashboard {
  if (projects.length === 0) {
    return {
      mission: "No active projects.",
      why: "There is no project data available to prioritize.",
      success: "Add or activate projects to begin executive prioritization.",
      risk: "No execution risks detected.",
      opportunity: "No active opportunity identified.",
      recommendation: "Add your current priorities to MichaelOS.",
      confidence: 0,
    }
  }

  const rankedProjects = rankProjects(projects)
  const topProject = rankedProjects[0]
  const reasoning = reasonAboutProject(topProject)

  const opportunityProject =
    rankedProjects.find(
      (project) =>
        project.health === "green" &&
        (project.priority === "critical" || project.priority === "high")
    ) ?? topProject

  return {
    mission: `${topProject.name}: ${
      topProject.next_action ?? "Advance the next meaningful milestone."
    }`,
    why: reasoning.why,
    success: reasoning.success,
    risk: reasoning.risk,
    opportunity: `${opportunityProject.name}: ${
      opportunityProject.next_milestone ??
      opportunityProject.next_action ??
      "Continue forward execution."
    }`,
    recommendation: reasoning.recommendation,
    confidence: reasoning.confidence,
  }
}