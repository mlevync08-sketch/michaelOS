import type { Project } from "../types/project"
import type { HealthProfile } from "../types/executiveState"
import type { ActionIntelligence } from "./actionEngine"
import type { DecisionIntelligence } from "./decisionEngine"
import type { DependencyIntelligence } from "./dependencyEngine"

export type CapacityState =
  | "ready"
  | "balanced"
  | "constrained"

export type CapacityIntelligence = {
  readinessScore: number
  workloadPressure: number
  focusCapacityMinutes: number
  state: CapacityState

  healthConnected: boolean
  healthSignals: {
    recovery: number | null
    sleep: number | null
    restingHeartRate: number | null
    hrv: number | null
    sourceFields: string[]
  }

  workload: {
    highLeverageActions: number
    deepWorkItems: number
    decideNow: number
    criticalDependencies: number
    redProjects: number
  }

  recommendation: {
    title: string
    detail: string
    confidence: number
  }

  policies: {
    protect: string[]
    reduce: string[]
    defer: string[]
  }

  scoreReasons: string[]
}

type BuildInput = {
  health: HealthProfile | null
  projects: Project[]
  actionIntelligence: ActionIntelligence
  decisionIntelligence: DecisionIntelligence
  dependencyIntelligence: DependencyIntelligence
  currentFocusScore: number
  missionMinutes: number
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }

  return null
}

function extractHealth(
  health: HealthProfile | null
) {
  const data = health?.health_data ?? {}

  const recovery =
    asNumber(data.recovery) ??
    asNumber(data.recovery_score) ??
    asNumber(data.readiness) ??
    asNumber(data.readiness_score)

  const sleep =
    asNumber(data.sleep) ??
    asNumber(data.sleep_score) ??
    asNumber(data.sleep_quality)

  const restingHeartRate =
    asNumber(data.resting_heart_rate) ??
    asNumber(data.restingHeartRate) ??
    asNumber(data.rhr)

  const hrv =
    asNumber(data.hrv) ??
    asNumber(data.hrv_ms) ??
    asNumber(data.heart_rate_variability)

  const sourceFields = [
    recovery !== null ? "recovery" : null,
    sleep !== null ? "sleep" : null,
    restingHeartRate !== null
      ? "resting_heart_rate"
      : null,
    hrv !== null ? "hrv" : null,
  ].filter(Boolean) as string[]

  return {
    recovery,
    sleep,
    restingHeartRate,
    hrv,
    sourceFields,
  }
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

export function buildCapacityIntelligence({
  health,
  projects,
  actionIntelligence,
  decisionIntelligence,
  dependencyIntelligence,
  currentFocusScore,
  missionMinutes,
}: BuildInput): CapacityIntelligence {
  const healthSignals = extractHealth(health)
  const healthConnected =
    Boolean(health) &&
    healthSignals.sourceFields.length > 0

  const redProjects = projects.filter(
    (project) => project.health === "red"
  ).length

  const workloadPressureRaw =
    actionIntelligence.stats.highLeverage * 8 +
    actionIntelligence.stats.deepWork * 5 +
    decisionIntelligence.stats.decideNow * 10 +
    dependencyIntelligence.stats.critical * 12 +
    redProjects * 10

  const workloadPressure = clamp(
    workloadPressureRaw
  )

  let readiness = currentFocusScore
  const reasons: string[] = [
    `Executive focus baseline: ${currentFocusScore}`,
  ]

  if (healthSignals.recovery !== null) {
    readiness =
      readiness * 0.65 +
      clamp(healthSignals.recovery) * 0.35
    reasons.push(
      `Recovery signal incorporated: ${healthSignals.recovery}`
    )
  }

  if (healthSignals.sleep !== null) {
    readiness =
      readiness * 0.8 +
      clamp(healthSignals.sleep) * 0.2
    reasons.push(
      `Sleep signal incorporated: ${healthSignals.sleep}`
    )
  }

  readiness -= workloadPressure * 0.18
  reasons.push(
    `Workload pressure adjustment: -${Math.round(
      workloadPressure * 0.18
    )}`
  )

  const readinessScore = clamp(
    Math.round(readiness)
  )

  const state: CapacityState =
    readinessScore >= 80
      ? "ready"
      : readinessScore >= 60
      ? "balanced"
      : "constrained"

  const focusCapacityMinutes =
    state === "ready"
      ? Math.max(90, missionMinutes)
      : state === "balanced"
      ? Math.max(60, Math.min(90, missionMinutes))
      : Math.max(30, Math.min(60, missionMinutes))

  const protect: string[] = []
  const reduce: string[] = []
  const defer: string[] = []

  if (state === "ready") {
    protect.push(
      "Protect the first deep-work block for the highest-leverage mission."
    )
    protect.push(
      "Use peak capacity for decisions or work requiring sustained judgment."
    )
  }

  if (state === "balanced") {
    protect.push(
      "Protect one meaningful focus block before opening the day to reactive work."
    )
    reduce.push(
      "Batch quick wins and communication into bounded windows."
    )
  }

  if (state === "constrained") {
    reduce.push(
      "Reduce context switching and avoid stacking multiple deep-work commitments."
    )
    defer.push(
      "Defer low-leverage work that does not change a decision, deadline, or dependency."
    )
    protect.push(
      "Use available capacity for one consequential move, then shift to delegation and closure."
    )
  }

  if (decisionIntelligence.stats.decideNow > 0) {
    protect.push(
      `Reserve capacity for ${decisionIntelligence.stats.decideNow} decision(s) that already have enough evidence to move.`
    )
  }

  if (
    dependencyIntelligence.stats.critical > 0
  ) {
    reduce.push(
      `Close or escalate ${dependencyIntelligence.stats.critical} critical dependency(ies) before adding new commitments.`
    )
  }

  const recommendation =
    state === "ready"
      ? {
          title:
            "Use today's capacity for high-leverage depth.",
          detail: `You can support approximately ${focusCapacityMinutes} minutes of meaningful focus. Protect the first block.`,
          confidence: healthConnected ? 92 : 84,
        }
      : state === "balanced"
      ? {
          title:
            "Be selective with depth and aggressive with batching.",
          detail: `Capacity supports about ${focusCapacityMinutes} focused minutes before execution quality is likely to decline.`,
          confidence: healthConnected ? 90 : 82,
        }
      : {
          title:
            "Narrow the day before the day narrows you.",
          detail: `Constrained capacity suggests one consequential move, then delegation, closure, and lower-context work.`,
          confidence: healthConnected ? 91 : 80,
        }

  return {
    readinessScore,
    workloadPressure,
    focusCapacityMinutes,
    state,

    healthConnected,
    healthSignals,

    workload: {
      highLeverageActions:
        actionIntelligence.stats.highLeverage,
      deepWorkItems:
        actionIntelligence.stats.deepWork,
      decideNow:
        decisionIntelligence.stats.decideNow,
      criticalDependencies:
        dependencyIntelligence.stats.critical,
      redProjects,
    },

    recommendation,

    policies: {
      protect: protect.slice(0, 4),
      reduce: reduce.slice(0, 4),
      defer: defer.slice(0, 4),
    },

    scoreReasons: reasons,
  }
}
