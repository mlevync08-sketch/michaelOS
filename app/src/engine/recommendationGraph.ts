import type { ExecutiveState } from "../types/executiveState"
import type {
  ExecutiveRecommendationGraph,
  ExecutiveRecommendationNode,
  RecommendationEngine,
  RecommendationEvidence,
  RecommendationPriority,
} from "../types/recommendationGraph"

type Input = Pick<
  ExecutiveState,
  "actionIntelligence" | "decisionIntelligence" | "dependencyIntelligence" |
  "relationshipIntelligence" | "memoryIntelligence" | "capacityIntelligence" |
  "weeklyReviewIntelligence" | "projects"
>

const clamp = (v:number) => Math.max(0, Math.min(100, v))
const priorityFromScore = (s:number):RecommendationPriority =>
  s >= 85 ? "critical" : s >= 65 ? "high" : s >= 40 ? "medium" : "low"
const nodeScore = (impact:number, urgency:number, confidence:number) =>
  clamp(Math.round(impact * .45 + urgency * .35 + confidence * .2))
const ev = (
  engine:RecommendationEngine, label:string, detail:string,
  confidence:number, id:string
):RecommendationEvidence => ({ id, engine, label, detail, confidence:clamp(confidence) })

export function buildExecutiveRecommendationGraph(input:Input):ExecutiveRecommendationGraph {
  const nodes:ExecutiveRecommendationNode[] = []
  const now = new Date().toISOString()

  for (const item of input.actionIntelligence.queue.slice(0,5)) {
    const impact = item.leverage==="critical"?95:item.leverage==="high"?80:item.leverage==="medium"?60:40
    const urgency = item.overdue?95:item.priority==="critical"?90:item.priority==="high"?75:55
    const confidence = 88
    const score = nodeScore(impact, urgency, confidence)
    nodes.push({
      id:`rec-action-${item.id}`, title:item.title,
      summary:item.projectName ? `${item.projectName} • ${item.estimatedMinutes} min` : `${item.estimatedMinutes} min executive action`,
      nextMove:item.title, confidence, impact, urgency,
      priority:priorityFromScore(score), score,
      why:item.scoreReasons.join(" • "), supportingEngines:["action"],
      evidence:[ev("action","Action score",`${item.score} action score; ${item.leverage} leverage`,confidence,`e-action-${item.id}`)],
      conflicts:[], dependencies:[], relatedProjectId:item.projectId, relatedRelationshipId:null,
      sourceId:item.id, sourceType:"action", createdAt:now
    })
  }

  for (const item of input.decisionIntelligence.queue.slice(0,5)) {
    const impact = item.impact
    const urgency = item.classification==="decide_now"?95:item.classification==="needs_evidence"?65:45
    const confidence = item.confidence
    const score = nodeScore(impact, urgency, confidence)
    nodes.push({
      id:`rec-decision-${item.id}`, title:item.title, summary:item.recommendation,
      nextMove:item.recommendation, confidence, impact, urgency,
      priority:priorityFromScore(score), score, why:item.consequenceOfDelay,
      supportingEngines:["decision"],
      evidence:item.evidence.slice(0,3).map((d,i)=>ev("decision",`Decision evidence ${i+1}`,d,confidence,`e-decision-${item.id}-${i}`)),
      conflicts:[], dependencies:[], relatedProjectId:item.projectId, relatedRelationshipId:null,
      sourceId:item.id, sourceType:"decision", createdAt:now
    })
  }

  for (const item of input.dependencyIntelligence.queue.slice(0,5)) {
    const impact = item.blockedProject?90:item.escalationScore
    const urgency = item.escalationScore
    const confidence = 92
    const score = nodeScore(impact,urgency,confidence)
    nodes.push({
      id:`rec-dependency-${item.id}`, title:`Close the loop with ${item.person}`,
      summary:item.item, nextMove:item.suggestedFollowUp, confidence, impact, urgency,
      priority:priorityFromScore(score), score,
      why:item.blockedProject ? `Linked to active blocker: ${item.blockerText ?? "unknown blocker"}` : `${item.ageDays} day(s) open`,
      supportingEngines:["dependency"],
      evidence:[
        ev("dependency","Dependency age",`${item.ageDays} day(s) open`,100,`e-dep-age-${item.id}`),
        ev("dependency","Escalation",`${item.escalationScore} escalation score`,92,`e-dep-score-${item.id}`)
      ],
      conflicts:[], dependencies:[], relatedProjectId:item.projectId, relatedRelationshipId:null,
      sourceId:item.id, sourceType:"dependency", createdAt:now
    })
  }

  for (const item of input.relationshipIntelligence.queue.slice(0,5)) {
    const impact = item.relevance
    const urgency = clamp(item.openLoops*12 + Math.min(item.daysSinceInteraction,30)*2)
    const confidence = 88
    const score = nodeScore(impact,urgency,confidence)
    nodes.push({
      id:`rec-relationship-${item.id}`, title:`Prioritize ${item.name}`,
      summary:item.nextMove, nextMove:item.nextMove, confidence, impact, urgency,
      priority:priorityFromScore(score), score, why:item.opportunity,
      supportingEngines:["relationship"],
      evidence:[
        ev("relationship","Strategic relevance",`${item.relevance} relevance score`,90,`e-rel-${item.id}`),
        ev("relationship","Open loops",`${item.openLoops} unresolved loop(s)`,95,`e-rel-loop-${item.id}`)
      ],
      conflicts:[], dependencies:[], relatedProjectId:item.projectIds[0]??null,
      relatedRelationshipId:item.id, sourceId:item.id, sourceType:"relationship", createdAt:now
    })
  }

  for (const item of input.memoryIntelligence.queue.slice(0,5)) {
    const impact = item.importance
    const urgency = item.memoryType==="commitment" && item.status==="active" ? 85 : item.memoryType==="pattern" ? 65 : 50
    const confidence = item.confidence
    const score = nodeScore(impact,urgency,confidence)
    nodes.push({
      id:`rec-memory-${item.id}`, title:`Remember: ${item.title}`, summary:item.content,
      nextMove:item.nextUse, confidence, impact, urgency, priority:priorityFromScore(score), score,
      why:item.whyItMatters, supportingEngines:["memory"],
      evidence:[ev("memory","Memory relevance",`${item.relevanceScore} relevance score`,confidence,`e-memory-${item.id}`)],
      conflicts:[], dependencies:[], relatedProjectId:item.projectId, relatedRelationshipId:item.relationshipId,
      sourceId:item.id, sourceType:"memory", createdAt:now
    })
  }

  {
    const c = input.capacityIntelligence
    const impact = 80
    const urgency = c.state==="constrained"?95:c.state==="balanced"?70:50
    const confidence = c.recommendation.confidence
    const score = nodeScore(impact,urgency,confidence)
    nodes.push({
      id:"rec-capacity-current", title:c.recommendation.title, summary:c.recommendation.detail,
      nextMove:c.policies.protect[0] ?? c.recommendation.detail,
      confidence, impact, urgency, priority:priorityFromScore(score), score,
      why:`Readiness ${c.readinessScore}; workload pressure ${c.workloadPressure}; ${c.focusCapacityMinutes} focus minutes available.`,
      supportingEngines:["capacity"],
      evidence:[
        ev("capacity","Readiness",`${c.readinessScore} readiness score`,confidence,"e-cap-readiness"),
        ev("capacity","Workload pressure",`${c.workloadPressure} workload pressure`,confidence,"e-cap-load")
      ],
      conflicts:[], dependencies:[], relatedProjectId:null, relatedRelationshipId:null,
      sourceId:null, sourceType:"capacity", createdAt:now
    })
  }

  {
    const w = input.weeklyReviewIntelligence
    const impact = w.momentum==="at_risk"?85:w.momentum==="accelerating"?75:65
    const urgency = w.metrics.redProjects>0 || w.metrics.criticalDependencies>0 ? 85 : 60
    const confidence = 82
    const score = nodeScore(impact,urgency,confidence)
    nodes.push({
      id:"rec-weekly-review-current", title:w.headline, summary:w.narrative,
      nextMove:w.nextWeek.startDoing[0] ?? w.nextWeek.keepDoing[0] ?? "Protect the highest-leverage work.",
      confidence, impact, urgency, priority:priorityFromScore(score), score, why:w.narrative,
      supportingEngines:["weekly_review"],
      evidence:[ev("weekly_review","Momentum",w.momentum,confidence,"e-weekly")],
      conflicts:[], dependencies:[], relatedProjectId:null, relatedRelationshipId:null,
      sourceId:null, sourceType:"weekly_review", createdAt:now
    })
  }

  const ranked = nodes.sort((a,b)=>b.score-a.score)
  const topRecommendation = ranked[0] ?? null
  const represented = Array.from(new Set(ranked.flatMap(n=>n.supportingEngines)))

  return {
    generatedAt:now, nodes:ranked, topRecommendation,
    consensus:{
      engineCount:topRecommendation ? topRecommendation.supportingEngines.length : 0,
      supportingEngines:topRecommendation?.supportingEngines ?? [],
      confidence:topRecommendation?.confidence ?? 0
    },
    stats:{
      total:ranked.length,
      critical:ranked.filter(n=>n.priority==="critical").length,
      high:ranked.filter(n=>n.priority==="high").length,
      medium:ranked.filter(n=>n.priority==="medium").length,
      low:ranked.filter(n=>n.priority==="low").length,
      enginesRepresented:represented.length
    }
  }
}
