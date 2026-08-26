
import type { Project } from "../types/project"
import type { Signal } from "../types/signal"
import type {
  ActionItem, DailyBrief, DecisionItem, ExecutiveState, HealthProfile,
  Relationship, WaitingOnItem,
} from "../types/executiveState"
import { buildExecutiveDashboard } from "../engine/brain"
import {
  buildExecutiveAgenda, buildExecutiveMission, buildRecommendations,
  buildRelationshipAlerts, buildRisks,
} from "../engine/executiveEngine"

export type KernelInput = {
  projects: Project[]
  actions: ActionItem[]
  decisions: DecisionItem[]
  waitingOn: WaitingOnItem[]
  relationships: Relationship[]
  dailyBrief: DailyBrief | null
  health: HealthProfile | null
  signals?: Signal[]
}

function buildProjectSignals(projects: Project[]): Signal[] {
  return projects.flatMap(project => {
    const signals: Signal[]=[]
    if(project.priority==="critical") signals.push({
      id:`priority-${project.id}`,source:"project",title:`${project.name} is critical`,
      summary:`${project.name} is currently marked as a critical priority.`,
      importance:"critical",confidence:100,occurred_at:new Date().toISOString(),
      related_project_id:project.id,related_person:project.owner,actionable:true
    })
    if(project.health==="red"||project.health==="amber") signals.push({
      id:`health-${project.id}`,source:"project",title:`${project.name} needs attention`,
      summary:`${project.name} is currently ${project.health}.`,
      importance:project.health==="red"?"high":"medium",confidence:100,
      occurred_at:new Date().toISOString(),related_project_id:project.id,
      related_person:project.owner,actionable:true
    })
    if(project.blocker&&project.blocker!=="None") signals.push({
      id:`blocker-${project.id}`,source:"project",title:`${project.name} has an active blocker`,
      summary:project.blocker,importance:"high",confidence:100,occurred_at:new Date().toISOString(),
      related_project_id:project.id,related_person:project.owner,actionable:true
    })
    return signals
  })
}

function buildDecisionSignals(decisions: DecisionItem[]): Signal[] {
  return decisions.map(d=>({
    id:`decision-${d.id}`,source:"decision",title:d.title,
    summary:d.consequence_of_delay??d.context??"Open executive decision.",
    importance:d.priority==="critical"?"critical":d.priority==="high"?"high":"medium",
    confidence:d.confidence??80,occurred_at:new Date().toISOString(),
    related_project_id:d.project_id,related_person:null,actionable:true
  }))
}

function buildWaitingSignals(waitingOn: WaitingOnItem[]): Signal[] {
  return waitingOn.map(w=>({
    id:`waiting-${w.id}`,source:"relationship",title:`Waiting on ${w.person}`,summary:w.item,
    importance:w.priority==="critical"?"critical":w.priority==="high"?"high":"medium",
    confidence:100,occurred_at:w.requested_on??new Date().toISOString(),
    related_project_id:w.project_id,related_person:w.person,actionable:true
  }))
}

export function runMichaelOSKernel(input: KernelInput): ExecutiveState {
  const signals=[
    ...buildProjectSignals(input.projects),
    ...buildDecisionSignals(input.decisions),
    ...buildWaitingSignals(input.waitingOn),
    ...(input.signals??[])
  ]
  const dashboard=buildExecutiveDashboard(input.projects,signals)
  const engineInput={
    projects:input.projects,actions:input.actions,decisions:input.decisions,
    waitingOn:input.waitingOn,relationships:input.relationships
  }

  return {
    generatedAt:new Date().toISOString(),
    mission:buildExecutiveMission(engineInput),
    executiveAgenda:buildExecutiveAgenda(engineInput),
    recommendations:buildRecommendations(engineInput),
    risks:buildRisks(engineInput),
    relationshipAlerts:buildRelationshipAlerts(engineInput),
    projects:input.projects,actions:input.actions,decisions:input.decisions,
    waitingOn:input.waitingOn,relationships:input.relationships,
    dailyBrief:input.dailyBrief,health:input.health,signals,dashboard,
    metrics:{
      activeProjects:input.projects.length,
      criticalProjects:input.projects.filter(p=>p.priority==="critical").length,
      needsAttention:input.projects.filter(p=>p.health==="amber"||p.health==="red").length,
      openActions:input.actions.length,
      openDecisions:input.decisions.length,
      waitingOn:input.waitingOn.length
    }
  }
}
