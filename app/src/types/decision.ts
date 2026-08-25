export type DecisionStatus =
  | "open"
  | "ready"
  | "decided"
  | "deferred"

export type DecisionImpact =
  | "low"
  | "medium"
  | "high"
  | "critical"

export type Decision = {
  id: string

  title: string

  context: string

  recommendation: string

  confidence: number

  consequences: string[]
 
  deadline: string | null

  owner: string | null

  status: DecisionStatus

  impact: DecisionImpact

  related_project_id: string | null

  created_at: string
}