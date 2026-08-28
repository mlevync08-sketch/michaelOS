import type {
  ExecutiveRecommendationNode,
  RecommendationConflict,
  RecommendationEngine,
} from "./recommendationGraph"

export type ExecutiveConsensus = {
  primary: ExecutiveRecommendationNode | null
  supporting: ExecutiveRecommendationNode[]
  engineCount: number
  supportingEngines: RecommendationEngine[]
  confidence: number
}

export type ExecutiveTradeoff = {
  id: string
  title: string
  detail: string
  severity: "critical" | "high" | "medium" | "low"
  recommendationIds: string[]
}

export type ExecutiveCoordinatorOutput = {
  generatedAt: string

  rankedRecommendations: ExecutiveRecommendationNode[]

  consensus: ExecutiveConsensus

  conflicts: RecommendationConflict[]

  tradeoffs: ExecutiveTradeoff[]

  coordinatorNarrative: {
    headline: string
    summary: string
    nextMove: string
    why: string
  }

  stats: {
    recommendations: number
    conflicts: number
    tradeoffs: number
    enginesRepresented: number
  }
}
