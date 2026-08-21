export type Project = {
  id: string
  user_id: string
  name: string
  status: string
  health: 'green' | 'amber' | 'red' | string
  priority: 'critical' | 'high' | 'medium' | 'low' | string
  progress?: number | null
  horizon?: string | null
  next_milestone?: string | null
  blocker?: string | null
  next_action?: string | null
  owner?: string | null
  created_at?: string
  updated_at?: string
}

export type ActionItem = {
  id: string
  user_id: string
  project_id?: string | null
  title: string
  status?: string | null
  priority?: string | null
  due_date?: string | null
  owner?: string | null
}

export type Decision = {
  id: string
  user_id: string
  project_id?: string | null
  title: string
  recommendation?: string | null
  status?: string | null
  impact?: number | null
  confidence?: number | null
}

export type Relationship = {
  id: string
  user_id: string
  name: string
  company?: string | null
  health?: string | null
  last_interaction?: string | null
  next_move?: string | null
}

export type WaitingOn = {
  id: string
  user_id: string
  person?: string | null
  item?: string | null
  status?: string | null
  requested_at?: string | null
  follow_up_at?: string | null
}
