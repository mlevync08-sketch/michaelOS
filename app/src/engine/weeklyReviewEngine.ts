import type { Project } from "../types/project"
import type {
  ExecutiveRecommendation,
  ExecutiveRisk,
  RelationshipAlert,
} from "../types/executiveState"
import type { ActionIntelligence } from "./actionEngine"
import type { DecisionIntelligence } from "./decisionEngine"
import type { DependencyIntelligence } from "./dependencyEngine"
import type { RelationshipIntelligence } from "./relationshipEngine"

export type WeeklyMomentum =
  | "accelerating"
  | "steady"
  | "at_risk"

export type WeeklyReviewIntelligence = {
  headline: string
  narrative: string

  wins: string[]
  stalled: string[]
  decisionDrag: string[]
  relationshipMovement: string[]
  riskMovement: string[]

  metrics: {
    projects: number
    greenProjects: number
    redProjects: number
    highLeverageActions: number
    decideNow: number
    criticalDependencies: number
    priorityRelationships: number
  }

  momentum: WeeklyMomentum

  executionMix: {
    deepWork: number
    quickWins: number
    delegated: number
    execution: number
  }

  nextWeek: {
    keepDoing: string[]
    stopDoing: string[]
    startDoing: string[]
  }

  recommendations: ExecutiveRecommendation[]
  risks: ExecutiveRisk[]
  relationshipAlerts: RelationshipAlert[]
}

type Input = {
  projects: Project[]
  actionIntelligence: ActionIntelligence
  decisionIntelligence: DecisionIntelligence
  dependencyIntelligence: DependencyIntelligence
  relationshipIntelligence: RelationshipIntelligence
  recommendations: ExecutiveRecommendation[]
  risks: ExecutiveRisk[]
  relationshipAlerts: RelationshipAlert[]
}

function projectMomentum(projects: Project[]): WeeklyMomentum {
  const red = projects.filter((p) => p.health === "red").length
  const amber = projects.filter((p) => p.health === "amber").length
  const green = projects.filter((p) => p.health === "green").length

  if (red > 0 || amber >= Math.max(2, green)) return "at_risk"
  if (green >= Math.max(1, Math.ceil(projects.length * 0.6))) return "accelerating"
  return "steady"
}

function buildWins(input: Input) {
  const wins: string[] = []

  input.projects
    .filter((p) => p.health === "green")
    .slice(0, 3)
    .forEach((p) => {
      wins.push(
        `${p.name} is green and positioned to continue forward execution.`
      )
    })

  if (input.actionIntelligence.stats.quickWins > 0) {
    wins.push(
      `${input.actionIntelligence.stats.quickWins} quick-win action(s) are available to create closure with low execution cost.`
    )
  }

  if (input.relationshipIntelligence.priority.length > 0) {
    wins.push(
      `${input.relationshipIntelligence.priority.length} relationship(s) are strategically active enough to create leverage this week.`
    )
  }

  return wins.slice(0, 4)
}

function buildStalled(input: Input) {
  const stalled: string[] = []

  input.projects
    .filter((p) => p.health === "red" || Boolean(p.blocker))
    .slice(0, 4)
    .forEach((p) => {
      stalled.push(
        `${p.name}${p.blocker ? ` is constrained by "${p.blocker}"` : " is red and requires intervention"}.`
      )
    })

  input.dependencyIntelligence.aging
    .slice(0, 2)
    .forEach((d) => {
      stalled.push(
        `${d.person}: "${d.item}" has been open ${d.ageDays} day(s).`
      )
    })

  return stalled.slice(0, 5)
}

function buildDecisionDrag(input: Input) {
  return input.decisionIntelligence.queue
    .filter(
      (d) =>
        d.classification === "decide_now" ||
        d.consequenceOfDelay.length > 0
    )
    .slice(0, 4)
    .map(
      (d) =>
        `${d.title}: ${d.consequenceOfDelay}`
    )
}

function buildRelationshipMovement(input: Input) {
  const movement: string[] = []

  input.relationshipIntelligence.priority
    .slice(0, 3)
    .forEach((r) => {
      movement.push(
        `${r.name}: ${r.nextMove}`
      )
    })

  input.relationshipIntelligence.stale
    .slice(0, 2)
    .forEach((r) => {
      movement.push(
        `${r.name} has gone ${r.daysSinceInteraction} day(s) without interaction.`
      )
    })

  return movement.slice(0, 5)
}

function buildRiskMovement(input: Input) {
  const items: string[] = []

  input.risks.slice(0, 4).forEach((risk) => {
    items.push(`${risk.title}: ${risk.detail}`)
  })

  if (input.dependencyIntelligence.stats.critical > 0) {
    items.push(
      `${input.dependencyIntelligence.stats.critical} dependency(ies) are now critical.`
    )
  }

  return items.slice(0, 5)
}

function buildNextWeek(input: Input) {
  const keepDoing: string[] = []
  const stopDoing: string[] = []
  const startDoing: string[] = []

  if (input.actionIntelligence.stats.deepWork > 0) {
    keepDoing.push(
      "Protect at least one deep-work block for high-leverage execution."
    )
  }

  if (input.relationshipIntelligence.priority.length > 0) {
    keepDoing.push(
      "Invest in the small number of relationships tied to current strategic leverage."
    )
  }

  if (input.decisionIntelligence.stats.decideNow > 0) {
    startDoing.push(
      `Close ${input.decisionIntelligence.stats.decideNow} decision(s) that already have enough evidence to move.`
    )
  }

  if (input.dependencyIntelligence.stats.overdueFollowUps > 0) {
    startDoing.push(
      `Escalate ${input.dependencyIntelligence.stats.overdueFollowUps} overdue dependency follow-up(s).`
    )
  }

  if (input.actionIntelligence.stats.quickWins > input.actionIntelligence.stats.deepWork) {
    stopDoing.push(
      "Letting low-cost execution crowd out the work that requires sustained focus."
    )
  }

  if (input.projects.filter((p) => p.health === "red").length > 0) {
    stopDoing.push(
      "Allowing red projects to remain active without a recovery decision or explicit deprioritization."
    )
  }

  if (keepDoing.length === 0) {
    keepDoing.push(
      "Maintain explicit next actions and owners across the active portfolio."
    )
  }

  if (stopDoing.length === 0) {
    stopDoing.push(
      "Avoid adding new commitments without removing or delegating lower-leverage work."
    )
  }

  if (startDoing.length === 0) {
    startDoing.push(
      "Convert inferred next moves into explicit actions, decisions, and dependencies."
    )
  }

  return {
    keepDoing: keepDoing.slice(0, 3),
    stopDoing: stopDoing.slice(0, 3),
    startDoing: startDoing.slice(0, 3),
  }
}

export function buildWeeklyReviewIntelligence(
  input: Input
): WeeklyReviewIntelligence {
  const momentum = projectMomentum(input.projects)

  const headline =
    momentum === "accelerating"
      ? "Execution is accelerating. Protect the work creating the momentum."
      : momentum === "at_risk"
      ? "Execution is moving, but risk and decision drag are beginning to compound."
      : "Execution is steady. The next gains come from sharper decisions and tighter focus."

  const narrativeParts: string[] = []

  narrativeParts.push(
    `${input.projects.length} active project(s) are in the portfolio.`
  )

  if (input.decisionIntelligence.stats.decideNow > 0) {
    narrativeParts.push(
      `${input.decisionIntelligence.stats.decideNow} decision(s) are ready to move now.`
    )
  }

  if (input.dependencyIntelligence.stats.critical > 0) {
    narrativeParts.push(
      `${input.dependencyIntelligence.stats.critical} dependency(ies) have reached critical escalation.`
    )
  }

  if (input.relationshipIntelligence.priority.length > 0) {
    narrativeParts.push(
      `${input.relationshipIntelligence.priority.length} relationship(s) deserve executive attention.`
    )
  }

  return {
    headline,
    narrative: narrativeParts.join(" "),

    wins: buildWins(input),
    stalled: buildStalled(input),
    decisionDrag: buildDecisionDrag(input),
    relationshipMovement: buildRelationshipMovement(input),
    riskMovement: buildRiskMovement(input),

    metrics: {
      projects: input.projects.length,
      greenProjects: input.projects.filter((p) => p.health === "green").length,
      redProjects: input.projects.filter((p) => p.health === "red").length,
      highLeverageActions: input.actionIntelligence.stats.highLeverage,
      decideNow: input.decisionIntelligence.stats.decideNow,
      criticalDependencies: input.dependencyIntelligence.stats.critical,
      priorityRelationships: input.relationshipIntelligence.stats.priority,
    },

    momentum,

    executionMix: {
      deepWork: input.actionIntelligence.deepWork.length,
      quickWins: input.actionIntelligence.quickWins.length,
      delegated: input.actionIntelligence.delegated.length,
      execution: input.actionIntelligence.execution.length,
    },

    nextWeek: buildNextWeek(input),

    recommendations: input.recommendations,
    risks: input.risks,
    relationshipAlerts: input.relationshipAlerts,
  }
}
