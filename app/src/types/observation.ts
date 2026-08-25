export type ObservationType =
  | "pattern"
  | "constraint"
  | "opportunity"
  | "anomaly"
  | "trend"

export type Observation = {
  id: string

  type: ObservationType

  title: string

  summary: string

  evidenceSignalIds: string[]

  relatedProjectIds: string[]

  relatedPeople: string[]

  importance: "low" | "medium" | "high" | "critical"

  confidence: number

  actionable: boolean

  created_at: string
}