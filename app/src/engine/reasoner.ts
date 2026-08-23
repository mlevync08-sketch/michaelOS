import type { Project } from "../types/project"

export type ProjectReasoning = {
  why: string
  success: string
  risk: string
  recommendation: string
  confidence: number
}

export function reasonAboutProject(
  project: Project
): ProjectReasoning {
  const why =
    project.blocker
      ? `${project.name} deserves attention because an active blocker is limiting forward progress.`
      : `${project.name} deserves attention because it is a ${project.priority}-priority active initiative.`

  const success =
    project.next_milestone
      ? `Success means reaching: ${project.next_milestone}.`
      : "Success means advancing the project to its next meaningful milestone."

  const risk =
    project.blocker
      ? `If ignored, the blocker "${project.blocker}" could delay execution.`
      : project.health === "red"
      ? "If ignored, current project health suggests a material execution risk."
      : project.health === "amber"
      ? "If ignored, the project may lose momentum or require intervention later."
      : "No immediate execution risk is currently detected."

  const recommendation =
    project.next_action
      ? `Recommended next action: ${project.next_action}`
      : "Recommended next action: define the next concrete execution step."

  let confidence = 70

  if (project.priority === "critical") confidence += 10
  if (project.next_action) confidence += 8
  if (project.next_milestone) confidence += 7
  if (project.blocker) confidence += 5

  confidence = Math.min(confidence, 100)

  return {
    why,
    success,
    risk,
    recommendation,
    confidence,
  }
}