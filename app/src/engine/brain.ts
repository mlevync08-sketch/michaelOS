import type { Project } from "../types/project"
import { rankProjects } from "./prioritizer"
import { reasonAboutProject } from "./reasoner"

export type ExecutiveDashboard = {
  mission: {
    title: string
    detail: string
    estimatedFocusMinutes: number
  }

  why: string

  success: string

  risk: string

  opportunity: string

  recommendation: string

  consequence: string

  impact: "low" | "medium" | "high" | "critical"

  confidence: number

  focusScore: number
}

export function buildExecutiveDashboard(
  projects: Project[]
): ExecutiveDashboard {
  if (projects.length === 0) {
    return {
      mission: {
        title: "No active projects.",
        detail: "Add or activate projects to begin executive prioritization.",
        estimatedFocusMinutes: 0,
      },

      why: "There is no project data available to prioritize.",

      success:
        "Add or activate projects to begin executive prioritization.",

      risk: "No execution risks detected.",

      opportunity: "No active opportunity identified.",

      recommendation:
        "Add your current priorities to MichaelOS.",

      consequence: "No immediate consequence detected.",

      impact: "low",

      confidence: 0,

      focusScore: 0,
    }
  }

  const rankedProjects = rankProjects(projects)
  const topProject = rankedProjects[0]
  const reasoning = reasonAboutProject(topProject)

  const opportunityProject =
    rankedProjects.find(
      (project) =>
        project.health === "green" &&
        (project.priority === "critical" ||
          project.priority === "high")
    ) ?? topProject

  const focusScore = Math.min(
    100,
    Math.round(
      reasoning.confidence * 0.6 +
        (topProject.priority === "critical" ? 40 : 20)
    )
  )

  return {
    mission: {
      title: topProject.name,
      detail:
        topProject.next_action ??
        "Advance the next meaningful milestone.",

      estimatedFocusMinutes:
        topProject.priority === "critical"
          ? 90
          : topProject.priority === "high"
          ? 60
          : 45,
    },

    why: reasoning.why,

    success: reasoning.success,

    risk: reasoning.risk,

    opportunity: `${opportunityProject.name}: ${
      opportunityProject.next_milestone ??
      opportunityProject.next_action ??
      "Continue forward execution."
    }`,

    recommendation: reasoning.recommendation,

    consequence: topProject.blocker
      ? `If this remains unresolved, "${topProject.blocker}" may delay forward execution.`
      : "Delaying this work may reduce momentum on a high-priority initiative.",

    impact:
      topProject.priority === "critical"
        ? "critical"
        : topProject.priority === "high"
        ? "high"
        : topProject.priority === "medium"
        ? "medium"
        : "low",

    confidence: reasoning.confidence,

    focusScore,
  }
}