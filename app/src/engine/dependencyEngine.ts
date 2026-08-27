import type { Project } from "../types/project"
import type { WaitingOnItem } from "../types/executiveState"

export type DependencySeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"

export type DependencyIntelligenceItem = {
  id: string
  person: string
  item: string
  projectId: string | null
  projectName: string | null
  priority: "critical" | "high" | "medium" | "low"
  requestedOn: string | null
  followUpOn: string | null
  ageDays: number
  escalationScore: number
  severity: DependencySeverity
  blockedProject: boolean
  blockerText: string | null
  suggestedFollowUp: string
  scoreReasons: string[]
}

export type DependencyIntelligence = {
  queue: DependencyIntelligenceItem[]
  critical: DependencyIntelligenceItem[]
  overdueFollowUps: DependencyIntelligenceItem[]
  aging: DependencyIntelligenceItem[]
  stats: {
    total: number
    critical: number
    overdueFollowUps: number
    aging: number
    blockedProjects: number
  }
  recommendation: {
    title: string
    detail: string
    confidence: number
  }
}

type BuildInput = {
  waitingOn: WaitingOnItem[]
  projects: Project[]
}

const priorityWeight: Record<string, number> = {
  critical: 55,
  high: 40,
  medium: 25,
  low: 10,
}

function normalizedPriority(
  value?: string | null
): "critical" | "high" | "medium" | "low" {
  const p = (value ?? "medium").toLowerCase()
  if (
    p === "critical" ||
    p === "high" ||
    p === "medium" ||
    p === "low"
  ) return p
  return "medium"
}

function ageDays(date?: string | null) {
  if (!date) return 0
  const value = new Date(date).getTime()
  if (!Number.isFinite(value)) return 0
  return Math.max(
    0,
    Math.floor((Date.now() - value) / 86400000)
  )
}

function isPast(date?: string | null) {
  if (!date) return false
  const value = new Date(`${date}T23:59:59`).getTime()
  return Number.isFinite(value) && value < Date.now()
}

function severityFromScore(
  score: number
): DependencySeverity {
  if (score >= 85) return "critical"
  if (score >= 65) return "high"
  if (score >= 40) return "medium"
  return "low"
}

function suggestedFollowUp(
  item: WaitingOnItem,
  age: number,
  project?: Project
) {
  if (item.follow_up_on && isPast(item.follow_up_on)) {
    return `Follow up with ${item.person} today. The planned follow-up date has passed.`
  }

  if (project?.blocker) {
    return `Follow up with ${item.person} now because this dependency is linked to an active blocker on ${project.name}.`
  }

  if (age >= 7) {
    return `Escalate the follow-up with ${item.person}. This dependency has been open for ${age} days.`
  }

  if (age >= 3) {
    return `Send a concise follow-up to ${item.person} and set a firm response date.`
  }

  return `Keep the dependency visible and confirm the next follow-up date with ${item.person}.`
}

function scoreDependency(
  item: WaitingOnItem,
  project?: Project
) {
  const priority = normalizedPriority(item.priority)
  const age = ageDays(item.requested_on)
  let score = priorityWeight[priority]
  const reasons = [
    `${priority} priority (+${priorityWeight[priority]})`,
  ]

  if (age >= 7) {
    score += 25
    reasons.push("Open 7+ days (+25)")
  } else if (age >= 3) {
    score += 15
    reasons.push("Open 3+ days (+15)")
  } else if (age >= 1) {
    score += 5
    reasons.push("Aging dependency (+5)")
  }

  if (item.follow_up_on && isPast(item.follow_up_on)) {
    score += 20
    reasons.push("Follow-up overdue (+20)")
  }

  if (project?.blocker) {
    score += 20
    reasons.push("Blocks project execution (+20)")
  }

  if (project?.health === "red") {
    score += 15
    reasons.push("Related project red (+15)")
  } else if (project?.health === "amber") {
    score += 8
    reasons.push("Related project amber (+8)")
  }

  return {
    score: Math.min(100, score),
    reasons,
    age,
  }
}

export function buildDependencyIntelligence({
  waitingOn,
  projects,
}: BuildInput): DependencyIntelligence {
  const projectMap = new Map(
    projects.map((project) => [project.id, project])
  )

  const queue = waitingOn
    .map((item) => {
      const project = item.project_id
        ? projectMap.get(item.project_id)
        : undefined

      const scoring = scoreDependency(item, project)
      const severity = severityFromScore(scoring.score)

      const row: DependencyIntelligenceItem = {
        id: item.id,
        person: item.person,
        item: item.item,
        projectId: item.project_id,
        projectName: project?.name ?? null,
        priority: normalizedPriority(item.priority),
        requestedOn: item.requested_on,
        followUpOn: item.follow_up_on,
        ageDays: scoring.age,
        escalationScore: scoring.score,
        severity,
        blockedProject: Boolean(project?.blocker),
        blockerText: project?.blocker ?? null,
        suggestedFollowUp: suggestedFollowUp(
          item,
          scoring.age,
          project
        ),
        scoreReasons: scoring.reasons,
      }

      return row
    })
    .sort((a, b) => b.escalationScore - a.escalationScore)

  const critical = queue.filter(
    (item) => item.severity === "critical"
  )

  const overdueFollowUps = queue.filter(
    (item) => item.followUpOn && isPast(item.followUpOn)
  )

  const aging = queue.filter(
    (item) => item.ageDays >= 3
  )

  const top = queue[0]

  return {
    queue,
    critical,
    overdueFollowUps,
    aging,

    stats: {
      total: queue.length,
      critical: critical.length,
      overdueFollowUps: overdueFollowUps.length,
      aging: aging.length,
      blockedProjects: queue.filter(
        (item) => item.blockedProject
      ).length,
    },

    recommendation: top
      ? {
          title: `Close the loop with ${top.person}`,
          detail: `${top.item} • ${top.ageDays} day(s) open • ${top.escalationScore} escalation score`,
          confidence: Math.min(
            97,
            75 + Math.round(top.escalationScore / 5)
          ),
        }
      : {
          title: "No external dependencies are currently open",
          detail:
            "Add waiting-on records to activate Dependency Intelligence.",
          confidence: 60,
        },
  }
}
