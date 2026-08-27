import type { Project } from "../types/project"
import type { Relationship } from "../types/executiveState"

export type RelationshipPriority =
  | "critical"
  | "high"
  | "medium"
  | "low"

export type RelationshipIntelligenceItem = {
  id: string
  name: string
  role: string | null
  company: string | null
  health: number
  relevance: number
  lastInteraction: string | null
  daysSinceInteraction: number
  openLoops: number
  projectIds: string[]
  projectNames: string[]
  nextMove: string
  score: number
  priority: RelationshipPriority
  risk: string
  opportunity: string
  scoreReasons: string[]
}

export type RelationshipIntelligence = {
  queue: RelationshipIntelligenceItem[]
  priority: RelationshipIntelligenceItem[]
  stale: RelationshipIntelligenceItem[]
  openLoops: RelationshipIntelligenceItem[]
  stats: {
    total: number
    priority: number
    stale: number
    openLoops: number
    linkedProjects: number
  }
  recommendation: {
    title: string
    detail: string
    confidence: number
  }
}

type BuildInput = {
  relationships: Relationship[]
  projects: Project[]
}

function daysSince(date?: string | null) {
  if (!date) return 999
  const value = new Date(date).getTime()
  if (!Number.isFinite(value)) return 999
  return Math.max(
    0,
    Math.floor((Date.now() - value) / 86400000)
  )
}

function normalizeHealth(value: number | null) {
  if (value === null || !Number.isFinite(value)) return 50
  return Math.max(0, Math.min(100, value))
}

function normalizeRelevance(value: number | null) {
  if (value === null || !Number.isFinite(value)) return 50
  return Math.max(0, Math.min(100, value))
}

function priorityFromScore(score: number): RelationshipPriority {
  if (score >= 85) return "critical"
  if (score >= 65) return "high"
  if (score >= 40) return "medium"
  return "low"
}

function scoreRelationship(
  relationship: Relationship,
  linkedProjects: Project[]
) {
  const relevance = normalizeRelevance(
    relationship.relevance_score
  )
  const health = normalizeHealth(
    relationship.health
  )
  const staleDays = daysSince(
    relationship.last_interaction
  )

  let score = Math.round(relevance * 0.45)
  const reasons = [
    `Strategic relevance (+${Math.round(
      relevance * 0.45
    )})`,
  ]

  if ((relationship.open_loops ?? 0) > 0) {
    const loopScore = Math.min(
      25,
      (relationship.open_loops ?? 0) * 8
    )
    score += loopScore
    reasons.push(
      `Open loops (+${loopScore})`
    )
  }

  if (staleDays >= 30) {
    score += 20
    reasons.push("30+ days since interaction (+20)")
  } else if (staleDays >= 14) {
    score += 12
    reasons.push("14+ days since interaction (+12)")
  } else if (staleDays >= 7) {
    score += 6
    reasons.push("7+ days since interaction (+6)")
  }

  if (linkedProjects.some((p) => p.priority === "critical")) {
    score += 20
    reasons.push("Linked to critical project (+20)")
  } else if (linkedProjects.some((p) => p.priority === "high")) {
    score += 10
    reasons.push("Linked to high-priority project (+10)")
  }

  if (linkedProjects.some((p) => p.blocker)) {
    score += 15
    reasons.push("Linked to active blocker (+15)")
  }

  if (health < 40) {
    score += 15
    reasons.push("Low relationship health (+15)")
  }

  return {
    score: Math.min(100, score),
    reasons,
    relevance,
    health,
    staleDays,
  }
}

function buildRisk(
  relationship: Relationship,
  staleDays: number,
  health: number
) {
  if (health < 40) {
    return "Relationship health is low enough to create execution or trust risk."
  }

  if ((relationship.open_loops ?? 0) >= 3) {
    return "Multiple open commitments are accumulating without closure."
  }

  if (staleDays >= 30) {
    return "The relationship has gone stale despite strategic relevance."
  }

  return "No major relationship risk detected."
}

function buildOpportunity(
  relationship: Relationship,
  linkedProjects: Project[]
) {
  if (relationship.next_move) {
    return relationship.next_move
  }

  if (relationship.next_commitment) {
    return relationship.next_commitment
  }

  if (linkedProjects.length > 0) {
    return `Reconnect around ${linkedProjects[0].name} and make the next mutual commitment explicit.`
  }

  return "Clarify the next strategic reason to engage."
}

export function buildRelationshipIntelligence({
  relationships,
  projects,
}: BuildInput): RelationshipIntelligence {
  const projectMap = new Map(
    projects.map((project) => [project.id, project])
  )

  const queue = relationships
    .map((relationship) => {
      const linkedProjects = (
        relationship.project_ids ?? []
      )
        .map((id) => projectMap.get(id))
        .filter(Boolean) as Project[]

      const scoring = scoreRelationship(
        relationship,
        linkedProjects
      )

      const item: RelationshipIntelligenceItem = {
        id: relationship.id,
        name: relationship.name,
        role: relationship.role,
        company: relationship.company,
        health: scoring.health,
        relevance: scoring.relevance,
        lastInteraction:
          relationship.last_interaction,
        daysSinceInteraction:
          scoring.staleDays,
        openLoops:
          relationship.open_loops ?? 0,
        projectIds:
          relationship.project_ids ?? [],
        projectNames: linkedProjects.map(
          (project) => project.name
        ),
        nextMove:
          relationship.next_move ??
          relationship.next_commitment ??
          buildOpportunity(
            relationship,
            linkedProjects
          ),
        score: scoring.score,
        priority: priorityFromScore(
          scoring.score
        ),
        risk: buildRisk(
          relationship,
          scoring.staleDays,
          scoring.health
        ),
        opportunity: buildOpportunity(
          relationship,
          linkedProjects
        ),
        scoreReasons: scoring.reasons,
      }

      return item
    })
    .sort((a, b) => b.score - a.score)

  const priority = queue.filter(
    (item) =>
      item.priority === "critical" ||
      item.priority === "high"
  )

  const stale = queue.filter(
    (item) => item.daysSinceInteraction >= 14
  )

  const openLoops = queue.filter(
    (item) => item.openLoops > 0
  )

  const top = queue[0]

  return {
    queue,
    priority,
    stale,
    openLoops,

    stats: {
      total: queue.length,
      priority: priority.length,
      stale: stale.length,
      openLoops: openLoops.length,
      linkedProjects: new Set(
        queue.flatMap((item) => item.projectIds)
      ).size,
    },

    recommendation: top
      ? {
          title: `Prioritize ${top.name}`,
          detail: `${top.nextMove} • ${top.score} relationship score`,
          confidence: Math.min(
            97,
            75 + Math.round(top.score / 5)
          ),
        }
      : {
          title:
            "No executive relationships are currently tracked",
          detail:
            "Add strategic relationships to activate Relationship Intelligence.",
          confidence: 60,
        },
  }
}
