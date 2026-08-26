
import type { Project } from "../types/project"
import type {
  ActionItem, DecisionItem, ExecutiveAgendaItem, ExecutiveMission,
  ExecutiveRecommendation, ExecutiveRisk, Relationship, RelationshipAlert,
  WaitingOnItem,
} from "../types/executiveState"

type Input = {
  projects: Project[]
  actions: ActionItem[]
  decisions: DecisionItem[]
  waitingOn: WaitingOnItem[]
  relationships: Relationship[]
}

const weight: Record<string, number> = { critical:100, high:75, medium:50, low:25 }
const norm = (v?: string | null) => {
  const p=(v ?? "medium").toLowerCase()
  return (["critical","high","medium","low"].includes(p) ? p : "medium") as "critical"|"high"|"medium"|"low"
}
const daysSince=(d?:string|null)=>{
  if(!d) return 0
  const t=new Date(d).getTime()
  return Number.isFinite(t) ? Math.max(0,Math.floor((Date.now()-t)/86400000)) : 0
}

export function buildExecutiveMission(input: Input): ExecutiveMission {
  const projectMap=new Map(input.projects.map(p=>[p.id,p]))
  const candidates: {score:number; mission:ExecutiveMission}[]=[]

  for(const d of input.decisions){
    const p=norm(d.priority)
    candidates.push({
      score:(d.impact ?? 50)+weight[p]+(d.consequence_of_delay?15:0),
      mission:{
        title:d.recommendation?.replace(/^Recommended next action:\s*/i,"") ?? `Resolve: ${d.title}`,
        detail:d.context ?? `Close the open decision: ${d.title}`,
        whyToday:d.context ?? `${d.title} is an open executive decision with downstream consequences.`,
        ifIgnored:d.consequence_of_delay ?? "Delay may block downstream execution and increase decision load.",
        successLooksLike:"A clear decision is recorded and the next owner/action is explicit.",
        estimatedFocusMinutes:p==="critical"?60:45,
        confidence:Math.min(100,d.confidence ?? 85),
        source:"decision", sourceId:d.id
      }
    })
  }

  for(const a of input.actions){
    const p=norm(a.priority)
    const project=a.project_id?projectMap.get(a.project_id):undefined
    candidates.push({
      score:weight[p]+(a.due_date?15:0)+(project?.blocker?20:0),
      mission:{
        title:a.title,
        detail:project?`${project.name}: ${a.title}`:a.title,
        whyToday:project?.blocker
          ? `${project.name} has an active blocker, and this action is the clearest available move to reduce it.`
          : "This is one of the highest-priority executable actions in the current operating state.",
        ifIgnored:project?.blocker
          ? `The blocker "${project.blocker}" may continue to slow ${project.name}.`
          : "The work may roll forward and increase execution debt.",
        successLooksLike:project?.next_milestone
          ? `Advance ${project.name} toward: ${project.next_milestone}.`
          : "Complete the action and make the next owner or milestone explicit.",
        estimatedFocusMinutes:p==="critical"?60:45,
        confidence:90,
        source:"action", sourceId:a.id
      }
    })
  }

  for(const w of input.waitingOn){
    const p=norm(w.priority), age=daysSince(w.requested_on)
    candidates.push({
      score:weight[p]+Math.min(age*5,40),
      mission:{
        title:`Unblock ${w.item}`,
        detail:`Waiting on ${w.person}`,
        whyToday:age>0
          ? `This dependency has been open for ${age} day${age===1?"":"s"} and is accumulating execution cost.`
          : "This is an active external dependency tied to forward execution.",
        ifIgnored:"The dependency may continue to delay downstream work and create avoidable context switching.",
        successLooksLike:`Get a clear response, owner, or follow-up date from ${w.person}.`,
        estimatedFocusMinutes:20,
        confidence:88,
        source:"dependency", sourceId:w.id
      }
    })
  }

  for(const pjt of input.projects){
    const p=norm(pjt.priority)
    candidates.push({
      score:weight[p]+(pjt.health==="red"?35:pjt.health==="amber"?20:0)+(pjt.blocker?25:0)+(pjt.next_action?10:0),
      mission:{
        title:pjt.next_action ?? `Advance ${pjt.name}`,
        detail:pjt.next_milestone ?? `Move ${pjt.name} to its next meaningful milestone.`,
        whyToday:pjt.blocker
          ? `${pjt.name} has an active blocker limiting forward progress.`
          : `${pjt.name} is a ${p}-priority initiative with meaningful executive leverage.`,
        ifIgnored:pjt.blocker
          ? `The blocker "${pjt.blocker}" may continue to delay ${pjt.name}.`
          : "Momentum may decline on a strategically important initiative.",
        successLooksLike:pjt.next_milestone ? `Reach: ${pjt.next_milestone}.` : "Create visible forward movement and a concrete next step.",
        estimatedFocusMinutes:p==="critical"?90:p==="high"?60:45,
        confidence:pjt.next_action?92:82,
        source:"project", sourceId:pjt.id
      }
    })
  }

  return candidates.sort((a,b)=>b.score-a.score)[0]?.mission ?? {
    title:"Define today's highest-leverage move",
    detail:"MichaelOS has no active executable items.",
    whyToday:"No prioritized work is currently available.",
    ifIgnored:"No material consequence detected.",
    successLooksLike:"Add or activate current priorities.",
    estimatedFocusMinutes:15,
    confidence:50,
    source:"project", sourceId:"none"
  }
}

export function buildExecutiveAgenda(input: Input): ExecutiveAgendaItem[] {
  const projectMap=new Map(input.projects.map(p=>[p.id,p]))
  const rows:{score:number;item:ExecutiveAgendaItem}[]=[]

  input.actions.forEach(a=>{
    const p=norm(a.priority)
    rows.push({score:weight[p]+(a.due_date?10:0),item:{
      id:`action-${a.id}`,
      title:a.project_id?(projectMap.get(a.project_id)?.name ?? a.title):a.title,
      subtitle:a.title, source:"action", priority:p, projectId:a.project_id, dueDate:a.due_date
    }})
  })
  input.decisions.forEach(d=>{
    const p=norm(d.priority)
    rows.push({score:weight[p]+(d.impact ?? 0),item:{
      id:`decision-${d.id}`, title:d.title,
      subtitle:d.recommendation ?? d.context ?? "Executive decision required",
      source:"decision", priority:p, projectId:d.project_id, dueDate:d.due_date
    }})
  })
  input.waitingOn.forEach(w=>{
    const p=norm(w.priority)
    rows.push({score:weight[p]+Math.min(daysSince(w.requested_on)*5,30),item:{
      id:`dependency-${w.id}`, title:`Follow up with ${w.person}`, subtitle:w.item,
      source:"dependency", priority:p, projectId:w.project_id, dueDate:w.follow_up_on
    }})
  })

  return rows.sort((a,b)=>b.score-a.score).slice(0,4).map(x=>x.item)
}

export function buildRecommendations(input: Input): ExecutiveRecommendation[] {
  const out: ExecutiveRecommendation[]=[]
  const d=[...input.decisions].sort((a,b)=>(b.impact??0)-(a.impact??0))[0]
  if(d) out.push({id:`decision-${d.id}`,title:`Resolve ${d.title}`,detail:d.recommendation??"Make the decision and assign the next action.",reason:d.consequence_of_delay??"Open decisions create downstream execution drag.",confidence:Math.min(100,d.confidence??85)})
  const w=[...input.waitingOn].sort((a,b)=>daysSince(b.requested_on)-daysSince(a.requested_on))[0]
  if(w) out.push({id:`waiting-${w.id}`,title:`Close the loop with ${w.person}`,detail:w.item,reason:`This dependency has been open for ${daysSince(w.requested_on)} day(s).`,confidence:90})
  const p=input.projects.find(x=>x.health==="red")
  if(p) out.push({id:`project-${p.id}`,title:`Intervene on ${p.name}`,detail:p.next_action??"Define the next recovery action.",reason:p.blocker??"Project health is red.",confidence:92})
  return out.slice(0,3)
}

export function buildRisks(input: Input): ExecutiveRisk[] {
  return input.projects.filter(p=>p.health==="red"||p.health==="amber"||Boolean(p.blocker)).slice(0,5).map(p=>({
    id:p.id,title:p.name,detail:p.blocker??`${p.name} is currently ${p.health}.`,
    severity:p.health==="red"?"critical":p.health==="amber"?"high":"medium"
  }))
}

export function buildRelationshipAlerts(input: Input): RelationshipAlert[] {
  return input.relationships
    .filter(r=>(r.open_loops??0)>0 || daysSince(r.last_interaction)>=14)
    .sort((a,b)=>(b.relevance_score??0)-(a.relevance_score??0))
    .slice(0,5)
    .map(r=>({id:r.id,name:r.name,detail:r.next_move??r.next_commitment??`${r.open_loops??0} open loop(s) require attention.`,relevance:r.relevance_score??50}))
}
