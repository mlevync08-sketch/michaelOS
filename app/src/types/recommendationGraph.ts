export type RecommendationEngine =
  | "executive" | "action" | "decision" | "dependency"
  | "relationship" | "memory" | "capacity" | "weekly_review"

export type RecommendationPriority = "critical" | "high" | "medium" | "low"

export type RecommendationEvidence = {
  id: string
  engine: RecommendationEngine
  label: string
  detail: string
  confidence: number
}

export type RecommendationConflict = {
  id: string
  type: "capacity" | "timing" | "sequence" | "priority" | "evidence"
  description: string
  severity: RecommendationPriority
}

export type RecommendationDependency = {
  id: string
  label: string
  description: string
}

export type ExecutiveRecommendationNode = {
  id: string
  title: string
  summary: string
  nextMove: string
  confidence: number
  impact: number
  urgency: number
  priority: RecommendationPriority
  score: number
  why: string
  supportingEngines: RecommendationEngine[]
  evidence: RecommendationEvidence[]
  conflicts: RecommendationConflict[]
  dependencies: RecommendationDependency[]
  relatedProjectId: string | null
  relatedRelationshipId: string | null
  sourceId: string | null
  sourceType: string
  createdAt: string
}

export type ExecutiveRecommendationGraph = {
  generatedAt: string
  nodes: ExecutiveRecommendationNode[]
  topRecommendation: ExecutiveRecommendationNode | null
  consensus: {
    engineCount: number
    supportingEngines: RecommendationEngine[]
    confidence: number
  }
  stats: {
    total: number
    critical: number
    high: number
    medium: number
    low: number
    enginesRepresented: number
  }
}
