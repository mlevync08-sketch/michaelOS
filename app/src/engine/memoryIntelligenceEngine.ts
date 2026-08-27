import type { Project } from "../types/project"
import type {
  MemoryItem,
  Relationship,
} from "../types/executiveState"

export type MemoryPriority =
  | "critical"
  | "high"
  | "medium"
  | "low"

export type MemoryIntelligenceItem = {
  id: string
  memoryType:
    | "commitment"
    | "decision"
    | "lesson"
    | "pattern"
    | "fact"
    | "context"

  title: string
  content: string

  importance: number
  confidence: number

  status:
    | "active"
    | "resolved"
    | "archived"

  occurredAt: string
  reviewOn: string | null

  projectId: string | null
  projectName: string | null

  relationshipId: string | null
  relationshipName: string | null

  source: string | null
  tags: string[]

  ageDays: number
  relevanceScore: number
  priority: MemoryPriority

  whyItMatters: string
  nextUse: string

  scoreReasons: string[]
}

export type MemoryIntelligence = {
  queue: MemoryIntelligenceItem[]

  commitments: MemoryIntelligenceItem[]
  decisions: MemoryIntelligenceItem[]
  lessons: MemoryIntelligenceItem[]
  patterns: MemoryIntelligenceItem[]

  stats: {
    total: number
    active: number
    commitments: number
    decisions: number
    lessons: number
    patterns: number
    dueForReview: number
  }

  recommendation: {
    title: string
    detail: string
    confidence: number
  }
}

type BuildInput = {
  memories: MemoryItem[]
  projects: Project[]
  relationships: Relationship[]
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

function daysSince(date: string) {
  const value = new Date(date).getTime()

  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.max(
    0,
    Math.floor(
      (Date.now() - value) / 86400000
    )
  )
}

function reviewIsDue(
  reviewOn: string | null
) {
  if (!reviewOn) return false

  const value = new Date(
    `${reviewOn}T23:59:59`
  ).getTime()

  return (
    Number.isFinite(value) &&
    value < Date.now()
  )
}

function priorityFromScore(
  score: number
): MemoryPriority {
  if (score >= 85) return "critical"
  if (score >= 65) return "high"
  if (score >= 40) return "medium"
  return "low"
}

function memoryTypeWeight(
  type: MemoryItem["memory_type"]
) {
  switch (type) {
    case "commitment":
      return 20

    case "decision":
      return 18

    case "pattern":
      return 15

    case "lesson":
      return 12

    case "context":
      return 8

    case "fact":
      return 5
  }
}

function recencyContribution(
  ageDays: number
) {
  if (ageDays <= 7) return 20
  if (ageDays <= 30) return 12
  if (ageDays <= 90) return 6
  return 0
}

function buildWhyItMatters(
  item: MemoryItem,
  projectName: string | null,
  relationshipName: string | null
) {
  switch (item.memory_type) {
    case "commitment":
      return projectName
        ? `This is an open commitment tied to ${projectName}.`
        : relationshipName
        ? `This commitment affects the relationship with ${relationshipName}.`
        : "Commitments should remain visible until closed or explicitly released."

    case "decision":
      return projectName
        ? `This preserves the rationale behind a decision affecting ${projectName}.`
        : "Decision memory prevents MichaelOS from re-litigating choices without new evidence."

    case "lesson":
      return "Lessons matter when they change a future decision, operating rule, or recommendation."

    case "pattern":
      return "Patterns matter because repeated behavior is often a stronger signal than a single event."

    case "fact":
      return "This fact may become relevant when Atlas needs historical context."

    case "context":
      return "This context helps Atlas interpret current signals without losing prior meaning."
  }
}

function buildNextUse(
  item: MemoryItem,
  projectName: string | null,
  relationshipName: string | null
) {
  if (
    item.memory_type === "commitment" &&
    item.status === "active"
  ) {
    return "Surface this memory whenever the related work or relationship appears in the executive brief."
  }

  if (item.memory_type === "decision") {
    return "Compare future recommendations against this prior decision and only reopen it when the evidence materially changes."
  }

  if (item.memory_type === "lesson") {
    return "Apply this lesson when a similar project, decision, or operating pattern appears."
  }

  if (item.memory_type === "pattern") {
    return "Watch for another occurrence and increase confidence only when independent evidence supports the pattern."
  }

  if (projectName) {
    return `Use this memory when reasoning about ${projectName}.`
  }

  if (relationshipName) {
    return `Use this memory when reasoning about ${relationshipName}.`
  }

  return "Keep this available as historical context for future executive reasoning."
}

function scoreMemory(
  item: MemoryItem,
  linkedProject: Project | undefined,
  linkedRelationship:
    | Relationship
    | undefined
) {
  const age = daysSince(
    item.occurred_at
  )

  let score = Math.round(
    clamp(item.importance) * 0.45
  )

  const reasons: string[] = [
    `Importance (+${Math.round(
      clamp(item.importance) * 0.45
    )})`,
  ]

  const typeWeight =
    memoryTypeWeight(item.memory_type)

  score += typeWeight
  reasons.push(
    `${item.memory_type} memory (+${typeWeight})`
  )

  const recency =
    recencyContribution(age)

  if (recency > 0) {
    score += recency
    reasons.push(
      `Recency (+${recency})`
    )
  }

  if (
    item.status === "active" &&
    item.memory_type === "commitment"
  ) {
    score += 15
    reasons.push(
      "Active commitment (+15)"
    )
  }

  if (reviewIsDue(item.review_on)) {
    score += 15
    reasons.push(
      "Review due (+15)"
    )
  }

  if (
    linkedProject?.priority ===
    "critical"
  ) {
    score += 15
    reasons.push(
      "Critical project linkage (+15)"
    )
  } else if (
    linkedProject?.priority ===
    "high"
  ) {
    score += 8
    reasons.push(
      "High-priority project linkage (+8)"
    )
  }

  if (
    linkedProject?.blocker
  ) {
    score += 10
    reasons.push(
      "Linked to active blocker (+10)"
    )
  }

  if (
    linkedRelationship &&
    (linkedRelationship.relevance_score ??
      0) >= 70
  ) {
    score += 10
    reasons.push(
      "High-relevance relationship (+10)"
    )
  }

  return {
    score: clamp(score),
    age,
    reasons,
  }
}

export function buildMemoryIntelligence({
  memories,
  projects,
  relationships,
}: BuildInput): MemoryIntelligence {
  const projectMap = new Map(
    projects.map((project) => [
      project.id,
      project,
    ])
  )

  const relationshipMap =
    new Map(
      relationships.map(
        (relationship) => [
          relationship.id,
          relationship,
        ]
      )
    )

  const queue = memories
    .filter(
      (memory) =>
        memory.status !==
        "archived"
    )
    .map((memory) => {
      const project = memory.project_id
        ? projectMap.get(
            memory.project_id
          )
        : undefined

      const relationship =
        memory.relationship_id
          ? relationshipMap.get(
              memory.relationship_id
            )
          : undefined

      const scoring = scoreMemory(
        memory,
        project,
        relationship
      )

      const item: MemoryIntelligenceItem =
        {
          id: memory.id,

          memoryType:
            memory.memory_type,

          title: memory.title,
          content: memory.content,

          importance:
            clamp(
              memory.importance
            ),

          confidence:
            clamp(
              memory.confidence
            ),

          status: memory.status,

          occurredAt:
            memory.occurred_at,

          reviewOn:
            memory.review_on,

          projectId:
            memory.project_id,

          projectName:
            project?.name ?? null,

          relationshipId:
            memory.relationship_id,

          relationshipName:
            relationship?.name ??
            null,

          source:
            memory.source,

          tags:
            memory.tags ?? [],

          ageDays:
            scoring.age,

          relevanceScore:
            scoring.score,

          priority:
            priorityFromScore(
              scoring.score
            ),

          whyItMatters:
            buildWhyItMatters(
              memory,
              project?.name ?? null,
              relationship?.name ??
                null
            ),

          nextUse:
            buildNextUse(
              memory,
              project?.name ?? null,
              relationship?.name ??
                null
            ),

          scoreReasons:
            scoring.reasons,
        }

      return item
    })
    .sort(
      (a, b) =>
        b.relevanceScore -
        a.relevanceScore
    )

  const commitments =
    queue.filter(
      (item) =>
        item.memoryType ===
        "commitment"
    )

  const decisions =
    queue.filter(
      (item) =>
        item.memoryType ===
        "decision"
    )

  const lessons =
    queue.filter(
      (item) =>
        item.memoryType ===
        "lesson"
    )

  const patterns =
    queue.filter(
      (item) =>
        item.memoryType ===
        "pattern"
    )

  const top = queue[0]

  return {
    queue,
    commitments,
    decisions,
    lessons,
    patterns,

    stats: {
      total: queue.length,

      active:
        queue.filter(
          (item) =>
            item.status === "active"
        ).length,

      commitments:
        commitments.length,

      decisions:
        decisions.length,

      lessons:
        lessons.length,

      patterns:
        patterns.length,

      dueForReview:
        queue.filter(
          (item) =>
            reviewIsDue(
              item.reviewOn
            )
        ).length,
    },

    recommendation: top
      ? {
          title:
            `Remember: ${top.title}`,

          detail:
            `${top.whyItMatters} • ${top.relevanceScore} relevance score`,

          confidence:
            Math.min(
              97,
              Math.max(
                65,
                Math.round(
                  (top.confidence +
                    top.relevanceScore) /
                    2
                )
              )
            ),
        }
      : {
          title:
            "No durable executive memories are stored yet",

          detail:
            "Capture commitments, decisions, lessons, and recurring patterns to activate Memory Intelligence.",

          confidence: 60,
        },
  }
}
