import type { Project } from "../types/project"
import type { Signal } from "../types/signal"
import type {
  ActionItem,
  DailyBrief,
  DecisionItem,
  ExecutiveState,
  HealthProfile,
  Relationship,
  WaitingOnItem,
} from "../types/executiveState"

import { buildExecutiveDashboard } from "../engine/brain"
import {
  buildExecutiveAgenda,
  buildExecutiveMission,
  buildRecommendations,
  buildRelationshipAlerts,
  buildRisks,
} from "../engine/executiveEngine"
import { buildActionIntelligence } from "../engine/actionEngine"
import { buildDecisionIntelligence } from "../engine/decisionEngine"

export type KernelInput = {
  projects: Project[]
  actions: ActionItem[]
  decisions: DecisionItem[]
  waitingOn: WaitingOnItem[]
  relationships: Relationship[]
  dailyBrief: DailyBrief | null
  health: HealthProfile | null
  signals?: Signal[]
}

function buildProjectSignals(
  projects: Project[]
): Signal[] {
  return projects.flatMap((project) => {
    const signals: Signal[] = []

    if (project.priority === "critical") {
      signals.push({
        id: `priority-${project.id}`,
        source: "project",
        title: `${project.name} is critical`,
        summary: `${project.name} is currently marked as a critical priority.`,
        importance: "critical",
        confidence: 100,
        occurred_at: new Date().toISOString(),
        related_project_id: project.id,
        related_person: project.owner,
        actionable: true,
      })
    }

    if (
      project.health === "red" ||
      project.health === "amber"
    ) {
      signals.push({
        id: `health-${project.id}`,
        source: "project",
        title: `${project.name} needs attention`,
        summary: `${project.name} is currently ${project.health}.`,
        importance:
          project.health === "red"
            ? "high"
            : "medium",
        confidence: 100,
        occurred_at: new Date().toISOString(),
        related_project_id: project.id,
        related_person: project.owner,
        actionable: true,
      })
    }

    if (
      project.blocker &&
      project.blocker !== "None"
    ) {
      signals.push({
        id: `blocker-${project.id}`,
        source: "project",
        title: `${project.name} has an active blocker`,
        summary: project.blocker,
        importance: "high",
        confidence: 100,
        occurred_at: new Date().toISOString(),
        related_project_id: project.id,
        related_person: project.owner,
        actionable: true,
      })
    }

    return signals
  })
}

function buildDecisionSignals(
  decisions: DecisionItem[]
): Signal[] {
  return decisions.map((decision) => ({
    id: `decision-${decision.id}`,
    source: "decision",
    title: decision.title,
    summary:
      decision.consequence_of_delay ??
      decision.context ??
      "Open executive decision.",
    importance:
      decision.priority === "critical"
        ? "critical"
        : decision.priority === "high"
        ? "high"
        : "medium",
    confidence: decision.confidence ?? 80,
    occurred_at: new Date().toISOString(),
    related_project_id: decision.project_id,
    related_person: null,
    actionable: true,
  }))
}

function buildWaitingSignals(
  waitingOn: WaitingOnItem[]
): Signal[] {
  return waitingOn.map((item) => ({
    id: `waiting-${item.id}`,
    source: "relationship",
    title: `Waiting on ${item.person}`,
    summary: item.item,
    importance:
      item.priority === "critical"
        ? "critical"
        : item.priority === "high"
        ? "high"
        : "medium",
    confidence: 100,
    occurred_at:
      item.requested_on ??
      new Date().toISOString(),
    related_project_id: item.project_id,
    related_person: item.person,
    actionable: true,
  }))
}

export function runMichaelOSKernel(
  input: KernelInput
): ExecutiveState {
  const signals = [
    ...buildProjectSignals(input.projects),
    ...buildDecisionSignals(input.decisions),
    ...buildWaitingSignals(input.waitingOn),
    ...(input.signals ?? []),
  ]

  const dashboard = buildExecutiveDashboard(
    input.projects,
    signals
  )

  const engineInput = {
    projects: input.projects,
    actions: input.actions,
    decisions: input.decisions,
    waitingOn: input.waitingOn,
    relationships: input.relationships,
  }

  const actionIntelligence =
    buildActionIntelligence({
      actions: input.actions,
      projects: input.projects,
    })

  const decisionIntelligence =
    buildDecisionIntelligence({
      decisions: input.decisions,
      projects: input.projects,
    })

  return {
    generatedAt: new Date().toISOString(),

    mission: buildExecutiveMission(engineInput),
    executiveAgenda:
      buildExecutiveAgenda(engineInput),
    recommendations:
      buildRecommendations(engineInput),
    risks: buildRisks(engineInput),
    relationshipAlerts:
      buildRelationshipAlerts(engineInput),
    actionIntelligence,
    decisionIntelligence,

    projects: input.projects,
    actions: input.actions,
    decisions: input.decisions,
    waitingOn: input.waitingOn,
    relationships: input.relationships,

    dailyBrief: input.dailyBrief,
    health: input.health,

    signals,
    dashboard,

    metrics: {
      activeProjects: input.projects.length,
      criticalProjects:
        input.projects.filter(
          (project) =>
            project.priority === "critical"
        ).length,
      needsAttention:
        input.projects.filter(
          (project) =>
            project.health === "amber" ||
            project.health === "red"
        ).length,
      openActions:
        actionIntelligence.stats.total,
      openDecisions:
        decisionIntelligence.stats.total,
      waitingOn: input.waitingOn.length,
    },
  }
}
