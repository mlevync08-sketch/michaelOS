export type ChallengeType =
  | "assumption"
  | "priority"
  | "dependency"
  | "risk"
  | "opportunity"

export type Challenge = {
  id: string

  type: ChallengeType

  title: string

  observationId: string

  statement: string

  rationale: string

  recommendation: string

  confidence: number

  impact: "low" | "medium" | "high" | "critical"

  created_at: string
}