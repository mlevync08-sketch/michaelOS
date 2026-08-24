import type { Project } from "../types/project"
import { rankProjects } from "./prioritizer"
import { reasonAboutProject } from "./reasoner"

export type ExecutiveDashboard = {
  mission: {
    title: string
    detail: string
    estimatedFocusMinutes: number
  }

  context: {
    whyToday: string
    ifIgnored: string
    successLooksLike: string
    nextMove: string
    highestLeverage: string
  }

  metrics: {
    confidence: number
    focusScore: number
    impact: "low" | "medium" | "high" | "critical"
  }
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

      context: {
        whyToday:
          "There is no project data available to prioritize.",

        ifIgnored:
          "No immediate consequence detected.",

        successLooksLike:
          "Add or activate projects to begin executive prioritization.",

        nextMove:
          "Add your current priorities to MichaelOS.",

        highestLeverage:
          "No active opportunity identified.",
      },

      metrics: {
        confidence: 0,
        focusScore: 0,
        impact: "low",
      },
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

    context: {
      whyToday: reasoning.why,

      ifIgnored: topProject.blocker
        ? `If this remains unresolved, "${topProject.blocker}" may delay forward execution.`
        : "Delaying this work may reduce momentum on a high-priority initiative.",

      successLooksLike: reasoning.success,

      nextMove: reasoning.recommendation,

      highestLeverage: `${opportunityProject.name}: ${
        opportunityProject.next_milestone ??
        opportunityProject.next_action ??
        "Continue forward execution."
      }`,
    },

    metrics: {
      confidence: reasoning.confidence,

      focusScore,

      impact:
        topProject.priority === "critical"
          ? "critical"
          : topProject.priority === "high"
          ? "high"
          : topProject.priority === "medium"
          ? "medium"
          : "low",
    },
  }
}