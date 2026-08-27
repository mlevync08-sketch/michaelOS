import type { Project } from "../types/project"
import type { DecisionItem } from "../types/executiveState"

export type DecisionClass =
  | "decide_now"
  | "needs_evidence"
  | "watch"

export type DecisionIntelligenceItem = {
  id: string
  title: string
  projectId: string | null
  projectName: string | null
  context: string | null
  recommendation: string
  consequenceOfDelay: string
  priority: "critical" | "high" | "medium" | "low"
  impact: number
  confidence: number
  score: number
  classification: DecisionClass
  reversible: boolean
  reviewDate: string | null
  evidence: string[]
  tradeoffs: string[]
  scoreReasons: string[]
}

export type DecisionIntelligence = {
  queue: DecisionIntelligenceItem[]
  decideNow: DecisionIntelligenceItem[]
  needsEvidence: DecisionIntelligenceItem[]
  watch: DecisionIntelligenceItem[]
  stats: {
    total: number
    decideNow: number
    needsEvidence: number
    critical: number
    lowConfidence: number
  }
  recommendation: {
    title: string
    detail: string
    confidence: number
  }
}

type BuildInput = {
  decisions: DecisionItem[]
  projects: Project[]
}

const priorityWeight: Record<string, number> = {
  critical: 40,
  high: 30,
  medium: 20,
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
  ) {
    return p
  }
  return "medium"
}

function normalizeImpact(value: number | null) {
  if (value === null || !Number.isFinite(value)) return 50
  return Math.max(0, Math.min(100, value))
}

function normalizeConfidence(value: number | null) {
  if (value === null || !Number.isFinite(value)) return 70
  return Math.max(0, Math.min(100, value))
}

function buildTradeoffs(
  decision: DecisionItem,
  project?: Project
) {
  const tradeoffs: string[] = []

  if (decision.recommendation) {
    tradeoffs.push(
      `Acting now follows the current recommendation: ${decision.recommendation}`
    )
  }

  if (decision.consequence_of_delay) {
    tradeoffs.push(
      `Waiting carries this cost: ${decision.consequence_of_delay}`
    )
  }

  if (project?.blocker) {
    tradeoffs.push(
      `The related project is already constrained by: ${project.blocker}`
    )
  }

  if (project?.health === "red") {
    tradeoffs.push(
      "The related project is red, increasing the cost of indecision."
    )
  } else if (project?.health === "amber") {
    tradeoffs.push(
      "The related project is amber, so additional delay may increase intervention cost."
    )
  }

  if (tradeoffs.length === 0) {
    tradeoffs.push(
      "The core tradeoff is speed versus additional evidence."
    )
  }

  return tradeoffs
}

function buildEvidence(
  decision: DecisionItem,
  project?: Project
) {
  const evidence: string[] = []

  if (decision.context) {
    evidence.push(decision.context)
  }

  if (decision.recommendation) {
    evidence.push(
      `Current recommendation: ${decision.recommendation}`
    )
  }

  if (decision.consequence_of_delay) {
    evidence.push(
      `Consequence of delay: ${decision.consequence_of_delay}`
    )
  }

  if (project?.next_milestone) {
    evidence.push(
      `Related milestone: ${project.next_milestone}`
    )
  }

  if (project?.next_action) {
    evidence.push(
      `Related next action: ${project.next_action}`
    )
  }

  if (evidence.length === 0) {
    evidence.push(
      "No structured evidence has been attached yet."
    )
  }

  return evidence
}

function isLikelyReversible(
  decision: DecisionItem
) {
  const text = `${decision.title} ${decision.context ?? ""} ${
    decision.recommendation ?? ""
  }`.toLowerCase()

  const irreversibleTerms = [
    "acquisition",
    "sell",
    "terminate",
    "fire",
    "equity",
    "board",
    "pricing change",
    "contract signature",
    "raise",
    "investment",
  ]

  return !irreversibleTerms.some((term) =>
    text.includes(term)
  )
}

function classifyDecision(
  score: number,
  confidence: number
): DecisionClass {
  if (score >= 70 && confidence >= 65) {
    return "decide_now"
  }

  if (confidence < 65) {
    return "needs_evidence"
  }

  return "watch"
}

function scoreDecision(
  decision: DecisionItem,
  project?: Project
) {
  const priority = normalizedPriority(
    decision.priority
  )
  const impact = normalizeImpact(decision.impact)
  const confidence = normalizeConfidence(
    decision.confidence
  )

  let score =
    priorityWeight[priority] +
    Math.round(impact * 0.35)

  const reasons: string[] = [
    `${priority} priority (+${priorityWeight[priority]})`,
    `Impact contribution (+${Math.round(
      impact * 0.35
    )})`,
  ]

  if (decision.consequence_of_delay) {
    score += 15
    reasons.push("Explicit delay consequence (+15)")
  }

  if (project?.blocker) {
    score += 12
    reasons.push("Related blocker (+12)")
  }

  if (project?.health === "red") {
    score += 10
    reasons.push("Red project (+10)")
  } else if (project?.health === "amber") {
    score += 5
    reasons.push("Amber project (+5)")
  }

  if (confidence < 50) {
    score -= 10
    reasons.push("Very low confidence (-10)")
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    reasons,
    impact,
    confidence,
  }
}

export function buildDecisionIntelligence({
  decisions,
  projects,
}: BuildInput): DecisionIntelligence {
  const projectMap = new Map(
    projects.map((project) => [project.id, project])
  )

  const queue = decisions
    .map((decision) => {
      const project = decision.project_id
        ? projectMap.get(decision.project_id)
        : undefined

      const scoring = scoreDecision(
        decision,
        project
      )

      const reversible =
        isLikelyReversible(decision)

      const classification =
        classifyDecision(
          scoring.score,
          scoring.confidence
        )

      const item: DecisionIntelligenceItem = {
        id: decision.id,
        title: decision.title,
        projectId: decision.project_id,
        projectName: project?.name ?? null,
        context: decision.context,
        recommendation:
          decision.recommendation ??
          (reversible
            ? "Bias toward a timely reversible decision."
            : "Gather sufficient evidence before committing."),
        consequenceOfDelay:
          decision.consequence_of_delay ??
          "Delay increases executive decision load and may slow downstream execution.",
        priority: normalizedPriority(
          decision.priority
        ),
        impact: scoring.impact,
        confidence: scoring.confidence,
        score: scoring.score,
        classification,
        reversible,
        reviewDate: decision.due_date,
        evidence: buildEvidence(
          decision,
          project
        ),
        tradeoffs: buildTradeoffs(
          decision,
          project
        ),
        scoreReasons: scoring.reasons,
      }

      return item
    })
    .sort((a, b) => b.score - a.score)

  const decideNow = queue.filter(
    (item) =>
      item.classification === "decide_now"
  )

  const needsEvidence = queue.filter(
    (item) =>
      item.classification ===
      "needs_evidence"
  )

  const watch = queue.filter(
    (item) =>
      item.classification === "watch"
  )

  const top = queue[0]

  return {
    queue,
    decideNow,
    needsEvidence,
    watch,

    stats: {
      total: queue.length,
      decideNow: decideNow.length,
      needsEvidence: needsEvidence.length,
      critical: queue.filter(
        (item) =>
          item.priority === "critical"
      ).length,
      lowConfidence: queue.filter(
        (item) =>
          item.confidence < 65
      ).length,
    },

    recommendation: top
      ? {
          title: top.title,
          detail: `${top.recommendation} • ${top.score} decision score`,
          confidence: Math.min(
            97,
            Math.max(
              60,
              Math.round(
                (top.confidence +
                  top.score) /
                  2
              )
            )
          ),
        }
      : {
          title:
            "No explicit executive decisions are open",
          detail:
            "Add decisions to MichaelOS to activate Decision Intelligence.",
          confidence: 60,
        },
  }
}
