export type MemoryType =
  | "decision"
  | "commitment"
  | "lesson"
  | "observation"
  | "preference"

export type MemoryRecord = {
  id: string
  type: MemoryType

  title: string
  summary: string

  source: string | null
  source_id: string | null

  related_project_id: string | null
  related_person: string | null

  importance: "low" | "medium" | "high" | "critical"

  confidence: number

  occurred_at: string
  created_at: string

  outcome: string | null
  lesson: string | null
}