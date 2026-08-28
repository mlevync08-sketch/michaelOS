import type {
  ExecutiveRecommendationNode,
  RecommendationEngine,
} from "./recommendationGraph"

export type CoordinatedMission = {
  id: string
  title: string
  summary: string

  nextMove: string
  whyToday: string
  ifIgnored: string
  successLooksLike: string

  confidence: number
  score: number

  estimatedFocusMinutes: number

  supportingEngines: RecommendationEngine[]
  supportingRecommendations: ExecutiveRecommendationNode[]

  tradeoff: string | null
}

export type ExecutiveNarrativeV2 = {
  greeting: string
  headline: string
  brief: string
  why: string
  nextMove: string
  tradeoff: string | null
  confidence: number
  engineConsensus: number
}
