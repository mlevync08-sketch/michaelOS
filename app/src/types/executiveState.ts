import type { Project } from "./project"
import type { Signal } from "./signal"
import type { ExecutiveDashboard } from "../engine/brain"
import type { ActionIntelligence } from "../engine/actionEngine"
import type { DecisionIntelligence } from "../engine/decisionEngine"
import type { DependencyIntelligence } from "../engine/dependencyEngine"
import type { RelationshipIntelligence } from "../engine/relationshipEngine"
import type { WeeklyReviewIntelligence } from "../engine/weeklyReviewEngine"
import type { CapacityIntelligence } from "../engine/capacityEngine"
import type { MemoryIntelligence } from "../engine/memoryIntelligenceEngine"
import type { ExecutiveRecommendationGraph } from "./recommendationGraph"

export type ActionItem = {
  id: string
  project_id: string | null
  title: string
  bucket: string | null
  priority: string
  status: string
  owner: string | null
  due_date: string | null
}

export type DecisionItem = {
  id: string
  project_id: string | null
  title: string
  context: string | null
  recommendation: string | null
  consequence_of_delay: string | null
  priority: string
  status: string
  due_date: string | null
  impact: number | null
  confidence: number | null
}

export type WaitingOnItem = {
  id: string
  project_id: string | null
  person: string
  item: string
  requested_on: string | null
  follow_up_on: string | null
  priority: string
  status: string
}

export type Relationship = {
  id: string
  name: string
  role: string | null
  company: string | null
  health: number | null
  last_interaction: string | null
  project_ids: string[]
  next_move: string | null
  open_loops: number
  notes: string | null
  relevance_score: number | null
  next_commitment: string | null
}

export type MemoryItem = {
  id: string

  memory_type:
    | "commitment"
    | "decision"
    | "lesson"
    | "pattern"
    | "fact"
    | "context"

  title: string
  content: string

  importance: number
  confidence: number

  status:
    | "active"
    | "resolved"
    | "archived"

  occurred_at: string
  review_on: string | null

  project_id: string | null
  relationship_id: string | null

  source: string | null
  source_ref: string | null

  tags: string[]
}

export type DailyBrief = {
  id: string
  brief_date: string
  executive_summary: string | null
  priorities: unknown
  risks: unknown
  decisions: unknown
  recommendations: unknown
}

export type HealthProfile = {
  health_data: Record<string, unknown> | null
  updated_at: string | null
}

export type ExecutiveAgendaItem = {
  id: string
  title: string
  subtitle: string
  source:
    | "action"
    | "decision"
    | "project"
    | "dependency"
  priority:
    | "critical"
    | "high"
    | "medium"
    | "low"
  projectId: string | null
  dueDate: string | null
}

export type ExecutiveRecommendation = {
  id: string
  title: string
  detail: string
  reason: string
  confidence: number
}

export type ExecutiveRisk = {
  id: string
  title: string
  detail: string
  severity:
    | "critical"
    | "high"
    | "medium"
    | "low"
}

export type RelationshipAlert = {
  id: string
  name: string
  detail: string
  relevance: number
}

export type ExecutiveMission = {
  title: string
  detail: string
  whyToday: string
  ifIgnored: string
  successLooksLike: string
  estimatedFocusMinutes: number
  confidence: number
  source:
    | "decision"
    | "action"
    | "dependency"
    | "project"
  sourceId: string
}

export type ExecutiveState = {
  generatedAt: string

  mission: ExecutiveMission
  executiveAgenda: ExecutiveAgendaItem[]
  recommendations: ExecutiveRecommendation[]
  risks: ExecutiveRisk[]
  relationshipAlerts: RelationshipAlert[]

  actionIntelligence: ActionIntelligence
  decisionIntelligence: DecisionIntelligence
  dependencyIntelligence: DependencyIntelligence
  relationshipIntelligence: RelationshipIntelligence
  weeklyReviewIntelligence: WeeklyReviewIntelligence
  capacityIntelligence: CapacityIntelligence
  memoryIntelligence: MemoryIntelligence
  recommendationGraph: ExecutiveRecommendationGraph

  projects: Project[]
  actions: ActionItem[]
  decisions: DecisionItem[]
  waitingOn: WaitingOnItem[]
  relationships: Relationship[]
  memories: MemoryItem[]

  dailyBrief: DailyBrief | null
  health: HealthProfile | null

  signals: Signal[]
  dashboard: ExecutiveDashboard

  metrics: {
    activeProjects: number
    criticalProjects: number
    needsAttention: number
    openActions: number
    openDecisions: number
    waitingOn: number
    memories: number
  }
}
