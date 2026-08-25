export type LearningCategory =
  | "decision"
  | "execution"
  | "relationship"
  | "strategy"
  | "communication"

export type Learning = {
  id: string

  title: string

  summary: string

  sourceDecisionId: string | null

  sourceExperienceId: string | null

  lesson: string

  recommendedBehavior: string

  confidence: number

  category: LearningCategory

  created_at: string
}