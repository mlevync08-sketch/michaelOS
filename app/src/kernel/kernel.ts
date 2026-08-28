import type { Project } from "../types/project"
import type { Signal } from "../types/signal"
import type {
  ActionItem,
  DailyBrief,
  DecisionItem,
  ExecutiveState,
  HealthProfile,
  MemoryItem,
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

import {
  buildActionIntelligence,
} from "../engine/actionEngine"

import {
  buildDecisionIntelligence,
} from "../engine/decisionEngine"

import {
  buildDependencyIntelligence,
} from "../engine/dependencyEngine"

import {
  buildRelationshipIntelligence,
} from "../engine/relationshipEngine"

import {
  buildWeeklyReviewIntelligence,
} from "../engine/weeklyReviewEngine"

import {
  buildCapacityIntelligence,
} from "../engine/capacityEngine"

import {
  buildMemoryIntelligence,
} from "../engine/memoryIntelligenceEngine"

import { buildExecutiveRecommendationGraph } from "../engine/recommendationGraph"

export type KernelInput = {
  projects: Project[]
  actions: ActionItem[]
  decisions: DecisionItem[]
  waitingOn: WaitingOnItem[]
  relationships: Relationship[]
  memories: MemoryItem[]
  dailyBrief: DailyBrief | null
  health: HealthProfile | null
  signals?: Signal[]
}

function buildProjectSignals(
  projects: Project[]
): Signal[] {
  return projects.flatMap(
    (project) => {
      const signals: Signal[] =
        []

      if (
        project.priority ===
        "critical"
      ) {
        signals.push({
          id: `priority-${project.id}`,
          source: "project",
          title: `${project.name} is critical`,
          summary: `${project.name} is currently marked as a critical priority.`,
          importance: "critical",
          confidence: 100,
          occurred_at:
            new Date().toISOString(),
          related_project_id:
            project.id,
          related_person:
            project.owner,
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
          occurred_at:
            new Date().toISOString(),
          related_project_id:
            project.id,
          related_person:
            project.owner,
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
          summary:
            project.blocker,
          importance: "high",
          confidence: 100,
          occurred_at:
            new Date().toISOString(),
          related_project_id:
            project.id,
          related_person:
            project.owner,
          actionable: true,
        })
      }

      return signals
    }
  )
}

function buildDecisionSignals(
  decisions: DecisionItem[]
): Signal[] {
  return decisions.map(
    (decision) => ({
      id: `decision-${decision.id}`,
      source: "decision",
      title: decision.title,
      summary:
        decision.consequence_of_delay ??
        decision.context ??
        "Open executive decision.",
      importance:
        decision.priority ===
        "critical"
          ? "critical"
          : decision.priority ===
            "high"
          ? "high"
          : "medium",
      confidence:
        decision.confidence ??
        80,
      occurred_at:
        new Date().toISOString(),
      related_project_id:
        decision.project_id,
      related_person: null,
      actionable: true,
    })
  )
}

function buildWaitingSignals(
  waitingOn: WaitingOnItem[]
): Signal[] {
  return waitingOn.map(
    (item) => ({
      id: `waiting-${item.id}`,
      source: "relationship",
      title: `Waiting on ${item.person}`,
      summary: item.item,
      importance:
        item.priority ===
        "critical"
          ? "critical"
          : item.priority ===
            "high"
          ? "high"
          : "medium",
      confidence: 100,
      occurred_at:
        item.requested_on ??
        new Date().toISOString(),
      related_project_id:
        item.project_id,
      related_person:
        item.person,
      actionable: true,
    })
  )
}

function buildMemorySignals(
  memories: MemoryItem[]
): Signal[] {
  return memories
    .filter(
      (memory) =>
        memory.status ===
        "active" &&
        (memory.memory_type ===
          "commitment" ||
          memory.memory_type ===
            "pattern")
    )
    .map((memory) => ({
      id: `memory-${memory.id}`,
      source: "memory",
      title: memory.title,
      summary:
        memory.content,
      importance:
        memory.importance >= 85
          ? "critical"
          : memory.importance >= 65
          ? "high"
          : memory.importance >= 40
          ? "medium"
          : "low",
      confidence:
        memory.confidence,
      occurred_at:
        memory.occurred_at,
      related_project_id:
        memory.project_id,
      related_person: null,
      actionable:
        memory.memory_type ===
        "commitment",
    }))
}

export function runMichaelOSKernel(
  input: KernelInput
): ExecutiveState {
  const signals = [
    ...buildProjectSignals(
      input.projects
    ),

    ...buildDecisionSignals(
      input.decisions
    ),

    ...buildWaitingSignals(
      input.waitingOn
    ),

    ...buildMemorySignals(
      input.memories
    ),

    ...(input.signals ?? []),
  ]

  const dashboard =
    buildExecutiveDashboard(
      input.projects,
      signals
    )

  const engineInput = {
    projects: input.projects,
    actions: input.actions,
    decisions: input.decisions,
    waitingOn:
      input.waitingOn,
    relationships:
      input.relationships,
  }

  const actionIntelligence =
    buildActionIntelligence({
      actions: input.actions,
      projects: input.projects,
    })

  const decisionIntelligence =
    buildDecisionIntelligence({
      decisions:
        input.decisions,
      projects:
        input.projects,
    })

  const dependencyIntelligence =
    buildDependencyIntelligence({
      waitingOn:
        input.waitingOn,
      projects:
        input.projects,
    })

  const relationshipIntelligence =
    buildRelationshipIntelligence({
      relationships:
        input.relationships,
      projects:
        input.projects,
    })

  const recommendations =
    buildRecommendations(
      engineInput
    )

  const risks =
    buildRisks(
      engineInput
    )

  const relationshipAlerts =
    buildRelationshipAlerts(
      engineInput
    )

  const weeklyReviewIntelligence =
    buildWeeklyReviewIntelligence({
      projects:
        input.projects,
      actionIntelligence,
      decisionIntelligence,
      dependencyIntelligence,
      relationshipIntelligence,
      recommendations,
      risks,
      relationshipAlerts,
    })

  const mission =
    buildExecutiveMission(
      engineInput
    )

  const capacityIntelligence =
    buildCapacityIntelligence({
      health: input.health,
      projects:
        input.projects,
      actionIntelligence,
      decisionIntelligence,
      dependencyIntelligence,
      currentFocusScore:
        dashboard.metrics
          .focusScore,
      missionMinutes:
        mission.estimatedFocusMinutes,
    })

  const memoryIntelligence =
    buildMemoryIntelligence({
      memories:
        input.memories,
      projects:
        input.projects,
      relationships:
        input.relationships,
    })

    const recommendationGraph =
  buildExecutiveRecommendationGraph({
    actionIntelligence,
    decisionIntelligence,
    dependencyIntelligence,
    relationshipIntelligence,
    memoryIntelligence,
    capacityIntelligence,
    weeklyReviewIntelligence,
    projects: input.projects,
  })

  return {
    generatedAt:
      new Date().toISOString(),

    mission,

    executiveAgenda:
      buildExecutiveAgenda(
        engineInput
      ),

    recommendations,
    risks,
    relationshipAlerts,

    actionIntelligence,
    decisionIntelligence,
    dependencyIntelligence,
    relationshipIntelligence,
    weeklyReviewIntelligence,
    capacityIntelligence,
    memoryIntelligence,
    recommendationGraph,
    
    projects:
      input.projects,

    actions:
      input.actions,

    decisions:
      input.decisions,

    waitingOn:
      input.waitingOn,

    relationships:
      input.relationships,

    memories:
      input.memories,

    dailyBrief:
      input.dailyBrief,

    health:
      input.health,

    signals,
    dashboard,

    metrics: {
      activeProjects:
        input.projects.length,

      criticalProjects:
        input.projects.filter(
          (project) =>
            project.priority ===
            "critical"
        ).length,

      needsAttention:
        input.projects.filter(
          (project) =>
            project.health ===
              "amber" ||
            project.health ===
              "red"
        ).length,

      openActions:
        actionIntelligence
          .stats.total,

      openDecisions:
        decisionIntelligence
          .stats.total,

      waitingOn:
        dependencyIntelligence
          .stats.total,

      memories:
        memoryIntelligence
          .stats.total,
    },
  }
}
