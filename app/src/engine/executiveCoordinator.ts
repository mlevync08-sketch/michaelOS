import type {
  ExecutiveRecommendationGraph,
  ExecutiveRecommendationNode,
  RecommendationConflict,
  RecommendationEngine,
} from "../types/recommendationGraph"

import type {
  ExecutiveCoordinatorOutput,
  ExecutiveTradeoff,
} from "../types/executiveCoordinator"

type CoordinatorInput = {
  recommendationGraph: ExecutiveRecommendationGraph
  capacity: {
    state: "ready" | "balanced" | "constrained"
    focusCapacityMinutes: number
  }
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

function conflictSeverity(
  a: ExecutiveRecommendationNode,
  b: ExecutiveRecommendationNode
): "critical" | "high" | "medium" | "low" {
  const maxScore = Math.max(a.score, b.score)

  if (maxScore >= 90) return "critical"
  if (maxScore >= 75) return "high"
  if (maxScore >= 55) return "medium"
  return "low"
}

function sameProject(
  a: ExecutiveRecommendationNode,
  b: ExecutiveRecommendationNode
) {
  return Boolean(
    a.relatedProjectId &&
      b.relatedProjectId &&
      a.relatedProjectId === b.relatedProjectId
  )
}

function detectConflicts(
  nodes: ExecutiveRecommendationNode[],
  capacity: CoordinatorInput["capacity"]
): RecommendationConflict[] {
  const conflicts: RecommendationConflict[] = []

  const actionNodes = nodes.filter(
    (node) => node.supportingEngines.includes("action")
  )

  const decisionNodes = nodes.filter(
    (node) => node.supportingEngines.includes("decision")
  )

  for (const action of actionNodes) {
    for (const decision of decisionNodes) {
      if (!sameProject(action, decision)) continue

      const decisionText = `${decision.title} ${decision.summary} ${decision.nextMove}`.toLowerCase()

      if (
        decisionText.includes("wait") ||
        decisionText.includes("pause") ||
        decisionText.includes("hold") ||
        decisionText.includes("defer") ||
        decisionText.includes("needs evidence")
      ) {
        conflicts.push({
          id: `conflict-sequence-${action.id}-${decision.id}`,
          type: "sequence",
          description: `Execution "${action.title}" may be premature because "${decision.title}" suggests waiting or gathering more evidence first.`,
          severity: conflictSeverity(action, decision),
        })
      }
    }
  }

  if (capacity.state === "constrained") {
    const highWorkloadActions = actionNodes.filter(
      (node) => node.score >= 70
    )

    for (const action of highWorkloadActions.slice(0, 3)) {
      conflicts.push({
        id: `conflict-capacity-${action.id}`,
        type: "capacity",
        description: `Capacity is constrained, so "${action.title}" should be time-boxed to approximately ${capacity.focusCapacityMinutes} focused minutes or partially delegated.`,
        severity: action.score >= 85 ? "high" : "medium",
      })
    }
  }

  const memoryNodes = nodes.filter(
    (node) => node.supportingEngines.includes("memory")
  )

  const relationshipNodes = nodes.filter(
    (node) => node.supportingEngines.includes("relationship")
  )

  for (const memory of memoryNodes) {
    for (const relationship of relationshipNodes) {
      if (
        memory.relatedRelationshipId &&
        relationship.relatedRelationshipId &&
        memory.relatedRelationshipId === relationship.relatedRelationshipId
      ) {
        conflicts.push({
          id: `conflict-memory-relationship-${memory.id}-${relationship.id}`,
          type: "priority",
          description: `Memory and Relationship Intelligence both elevate the same relationship. Treat the relationship move as higher-confidence coordinated work rather than two separate priorities.`,
          severity: "medium",
        })
      }
    }
  }

  return conflicts
}

function mergeConsensus(
  nodes: ExecutiveRecommendationNode[]
) {
  const ranked = [...nodes].sort(
    (a, b) => b.score - a.score
  )

  const primary = ranked[0] ?? null

  if (!primary) {
    return {
      primary: null,
      supporting: [],
      engineCount: 0,
      supportingEngines: [] as RecommendationEngine[],
      confidence: 0,
    }
  }

  const supporting = ranked
    .slice(1)
    .filter((node) => {
      if (
        primary.relatedProjectId &&
        node.relatedProjectId === primary.relatedProjectId
      ) {
        return true
      }

      if (
        primary.relatedRelationshipId &&
        node.relatedRelationshipId === primary.relatedRelationshipId
      ) {
        return true
      }

      return Math.abs(primary.score - node.score) <= 8
    })
    .slice(0, 4)

  const supportingEngines = Array.from(
    new Set([
      ...primary.supportingEngines,
      ...supporting.flatMap(
        (node) => node.supportingEngines
      ),
    ])
  )

  const confidenceValues = [
    primary.confidence,
    ...supporting.map((node) => node.confidence),
  ]

  const confidence = clamp(
    Math.round(
      confidenceValues.reduce(
        (sum, value) => sum + value,
        0
      ) / confidenceValues.length
    )
  )

  return {
    primary,
    supporting,
    engineCount: supportingEngines.length,
    supportingEngines,
    confidence,
  }
}

function buildTradeoffs(
  primary: ExecutiveRecommendationNode | null,
  conflicts: RecommendationConflict[],
  capacity: CoordinatorInput["capacity"]
): ExecutiveTradeoff[] {
  const tradeoffs: ExecutiveTradeoff[] = []

  if (primary && conflicts.some((c) => c.type === "capacity")) {
    tradeoffs.push({
      id: "tradeoff-capacity",
      title: "Leverage vs. available capacity",
      detail: `The top recommendation remains important, but execution should fit within approximately ${capacity.focusCapacityMinutes} focused minutes before shifting to delegation or lower-context work.`,
      severity: capacity.state === "constrained" ? "high" : "medium",
      recommendationIds: [primary.id],
    })
  }

  const sequenceConflicts = conflicts.filter(
    (conflict) => conflict.type === "sequence"
  )

  if (sequenceConflicts.length > 0) {
    tradeoffs.push({
      id: "tradeoff-sequence",
      title: "Execution speed vs. decision readiness",
      detail:
        "At least one action may be sequenced before the underlying decision is sufficiently resolved. Favor the decision first, then execute.",
      severity: "high",
      recommendationIds: [],
    })
  }

  if (primary && primary.urgency >= 85 && primary.impact < 70) {
    tradeoffs.push({
      id: "tradeoff-urgent-low-impact",
      title: "Urgency vs. strategic impact",
      detail:
        "The top item is urgent but not necessarily the highest-impact long-term move. Close it quickly without allowing it to consume the entire focus block.",
      severity: "medium",
      recommendationIds: [primary.id],
    })
  }

  return tradeoffs
}

export function coordinateExecutiveIntelligence({
  recommendationGraph,
  capacity,
}: CoordinatorInput): ExecutiveCoordinatorOutput {
  const rankedRecommendations = [
    ...recommendationGraph.nodes,
  ].sort((a, b) => b.score - a.score)

  const conflicts = detectConflicts(
    rankedRecommendations,
    capacity
  )

  const consensus = mergeConsensus(
    rankedRecommendations
  )

  const tradeoffs = buildTradeoffs(
    consensus.primary,
    conflicts,
    capacity
  )

  const primary = consensus.primary

  const coordinatorNarrative = primary
    ? {
        headline: primary.title,
        summary:
          consensus.engineCount > 1
            ? `${consensus.engineCount} intelligence engines reinforce this recommendation.`
            : "This is currently the highest-ranked executive recommendation.",
        nextMove: primary.nextMove,
        why: `${primary.why}${
          tradeoffs.length
            ? ` Key tradeoff: ${tradeoffs[0].detail}`
            : ""
        }`,
      }
    : {
        headline: "No dominant recommendation detected",
        summary:
          "MichaelOS does not yet have enough coordinated evidence to elevate one move above the rest.",
        nextMove:
          "Add explicit actions, decisions, dependencies, relationships, or memories.",
        why:
          "Coordinator confidence rises as multiple engines provide independent evidence.",
      }

  return {
    generatedAt: new Date().toISOString(),

    rankedRecommendations,

    consensus,

    conflicts,

    tradeoffs,

    coordinatorNarrative,

    stats: {
      recommendations: rankedRecommendations.length,
      conflicts: conflicts.length,
      tradeoffs: tradeoffs.length,
      enginesRepresented:
        recommendationGraph.stats.enginesRepresented,
    },
  }
}
