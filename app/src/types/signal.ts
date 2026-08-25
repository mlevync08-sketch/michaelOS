export type SignalSource =
  | "project"
  | "calendar"
  | "meeting"
  | "email"
  | "relationship"
  | "decision"
  | "memory"
  | "health"
  | "document"

export type SignalStrength =
  | "low"
  | "medium"
  | "high"
  | "critical"

export type Signal = {
  id: string

  source: SignalSource

  title: string

  summary: string

  importance: SignalStrength

  confidence: number

  occurred_at: string

  related_project_id: string | null

  related_person: string | null

  actionable: boolean
}