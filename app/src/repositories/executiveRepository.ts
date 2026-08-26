import { supabase } from "../lib/supabase"
import type {
  ActionItem,
  DailyBrief,
  DecisionItem,
  HealthProfile,
  Relationship,
  WaitingOnItem,
} from "../types/executiveState"
import type { Project } from "../types/project"

export type ExecutiveRepositoryData = {
  projects: Project[]
  actions: ActionItem[]
  decisions: DecisionItem[]
  waitingOn: WaitingOnItem[]
  relationships: Relationship[]
  dailyBrief: DailyBrief | null
  health: HealthProfile | null
}

export async function loadExecutiveRepositoryData(): Promise<ExecutiveRepositoryData> {
  const [
    projectsResult,
    actionsResult,
    decisionsResult,
    waitingOnResult,
    relationshipsResult,
    dailyBriefResult,
    healthResult,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select(
        "id,name,status,health,priority,next_milestone,blocker,next_action,owner"
      )
      .order("name"),

    supabase
      .from("actions")
      .select(
        "id,project_id,title,bucket,priority,status,owner,due_date"
      )
      .neq("status", "done")
      .order("due_date", { ascending: true, nullsFirst: false }),

    supabase
      .from("decisions")
      .select(
        "id,project_id,title,context,recommendation,consequence_of_delay,priority,status,due_date,impact,confidence"
      )
      .neq("status", "decided")
      .order("impact", { ascending: false, nullsFirst: false }),

    supabase
      .from("waiting_on")
      .select(
        "id,project_id,person,item,requested_on,follow_up_on,priority,status"
      )
      .neq("status", "done")
      .order("requested_on", { ascending: true, nullsFirst: false }),

    supabase
      .from("relationships")
      .select(
        "id,name,role,company,health,last_interaction,project_ids,next_move,open_loops,notes,relevance_score,next_commitment"
      )
      .order("relevance_score", {
        ascending: false,
        nullsFirst: false,
      }),

    supabase
      .from("daily_briefs")
      .select(
        "id,brief_date,executive_summary,priorities,risks,decisions,recommendations"
      )
      .order("brief_date", { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("health_profiles")
      .select("health_data,updated_at")
      .limit(1)
      .maybeSingle(),
  ])

  const errors = [
    projectsResult.error,
    actionsResult.error,
    decisionsResult.error,
    waitingOnResult.error,
    relationshipsResult.error,
    dailyBriefResult.error,
    healthResult.error,
  ].filter(Boolean)

  if (errors.length > 0) {
    console.error("MichaelOS repository errors:", errors)
    throw new Error("Failed to load MichaelOS executive state.")
  }

  return {
    projects: (projectsResult.data ?? []) as Project[],
    actions: (actionsResult.data ?? []) as ActionItem[],
    decisions: (decisionsResult.data ?? []) as DecisionItem[],
    waitingOn: (waitingOnResult.data ?? []) as WaitingOnItem[],
    relationships: (relationshipsResult.data ?? []) as Relationship[],
    dailyBrief: (dailyBriefResult.data ?? null) as DailyBrief | null,
    health: (healthResult.data ?? null) as HealthProfile | null,
  }
}