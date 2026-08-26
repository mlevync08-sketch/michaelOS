import type { Project } from "../types/project"
import type {
  ActionItem,
  DecisionItem,
  ExecutiveAgendaItem,
  ExecutiveMission,
  ExecutiveRecommendation,
  ExecutiveRisk,
  Relationship,
  RelationshipAlert,
  WaitingOnItem,
} from "../types/executiveState"

type Input = {
  projects: Project[]
  actions: ActionItem[]
  decisions: DecisionItem[]
  waitingOn: WaitingOnItem[]
  relationships: Relationship[]
}

const priorityWeight: Record<string, number> = {
  critical: 100,
  high: 75,
  medium: 50,
  low: 25,
}

function normalizedPriority(
  value?: string | null
): "critical" | "high" | "medium" | "low" {
  const priority = (value ?? "medium").toLowerCase()

  if (
    priority === "critical" ||
    priority === "high" ||
    priority === "medium" ||
    priority === "low"
  ) {
    return priority
  }

  return "medium"
}

function daysSince(date?: string | null) {
  if (!date) return 0

  const value = new Date(date).getTime()

  if (!Number.isFinite(value)) return 0

  return Math.max(
    0,
    Math.floor((Date.now() - value) / 86400000)
  )
}

function projectMap(projects: Project[]) {
  return new Map(
    projects.map((project) => [project.id, project])
  )
}

export function buildExecutiveMission(
  input: Input
): ExecutiveMission {
  const projects = projectMap(input.projects)

  const candidates: Array<{
    score: number
    mission: ExecutiveMission
  }> = []

  for (const decision of input.decisions) {
    const priority = normalizedPriority(decision.priority)

    candidates.push({
      score:
        (decision.impact ?? 50) +
        priorityWeight[priority] +
        (decision.consequence_of_delay ? 15 : 0),

      mission: {
        title:
          decision.recommendation?.replace(
            /^Recommended next action:\s*/i,
            ""
          ) ?? `Resolve: ${decision.title}`,

        detail:
          decision.context ??
          `Close the open decision: ${decision.title}`,

        whyToday:
          decision.context ??
          `${decision.title} is an open executive decision with downstream consequences.`,

        ifIgnored:
          decision.consequence_of_delay ??
          "Delay may block downstream execution and increase decision load.",

        successLooksLike:
          "A clear decision is recorded and the next owner/action is explicit.",

        estimatedFocusMinutes:
          priority === "critical" ? 60 : 45,

        confidence: Math.min(
          100,
          decision.confidence ?? 85
        ),

        source: "decision",
        sourceId: decision.id,
      },
    })
  }

  for (const action of input.actions) {
    const priority = normalizedPriority(action.priority)
    const project = action.project_id
      ? projects.get(action.project_id)
      : undefined

    candidates.push({
      score:
        priorityWeight[priority] +
        (action.due_date ? 15 : 0) +
        (project?.blocker ? 20 : 0),

      mission: {
        title: action.title,

        detail: project
          ? `${project.name}: ${action.title}`
          : action.title,

        whyToday: project?.blocker
          ? `${project.name} has an active blocker, and this action is the clearest available move to reduce it.`
          : "This is one of the highest-priority executable actions in the current operating state.",

        ifIgnored: project?.blocker
          ? `The blocker "${project.blocker}" may continue to slow ${project.name}.`
          : "The work may roll forward and increase execution debt.",

        successLooksLike: project?.next_milestone
          ? `Advance ${project.name} toward: ${project.next_milestone}.`
          : "Complete the action and make the next owner or milestone explicit.",

        estimatedFocusMinutes:
          priority === "critical" ? 60 : 45,

        confidence: 90,

        source: "action",
        sourceId: action.id,
      },
    })
  }

  for (const waiting of input.waitingOn) {
    const priority = normalizedPriority(waiting.priority)
    const age = daysSince(waiting.requested_on)

    candidates.push({
      score:
        priorityWeight[priority] +
        Math.min(age * 5, 40),

      mission: {
        title: `Unblock ${waiting.item}`,
        detail: `Waiting on ${waiting.person}`,

        whyToday:
          age > 0
            ? `This dependency has been open for ${age} day${
                age === 1 ? "" : "s"
              } and is accumulating execution cost.`
            : "This is an active external dependency tied to forward execution.",

        ifIgnored:
          "The dependency may continue to delay downstream work and create avoidable context switching.",

        successLooksLike:
          `Get a clear response, owner, or follow-up date from ${waiting.person}.`,

        estimatedFocusMinutes: 20,
        confidence: 88,

        source: "dependency",
        sourceId: waiting.id,
      },
    })
  }

  for (const project of input.projects) {
    const priority = normalizedPriority(project.priority)

    candidates.push({
      score:
        priorityWeight[priority] +
        (project.health === "red"
          ? 35
          : project.health === "amber"
          ? 20
          : 0) +
        (project.blocker ? 25 : 0) +
        (project.next_action ? 10 : 0),

      mission: {
        title:
          project.next_action ??
          `Advance ${project.name}`,

        detail:
          project.next_milestone ??
          `Move ${project.name} to its next meaningful milestone.`,

        whyToday: project.blocker
          ? `${project.name} has an active blocker limiting forward progress.`
          : `${project.name} is a ${priority}-priority initiative with meaningful executive leverage.`,

        ifIgnored: project.blocker
          ? `The blocker "${project.blocker}" may continue to delay ${project.name}.`
          : "Momentum may decline on a strategically important initiative.",

        successLooksLike: project.next_milestone
          ? `Reach: ${project.next_milestone}.`
          : "Create visible forward movement and a concrete next step.",

        estimatedFocusMinutes:
          priority === "critical"
            ? 90
            : priority === "high"
            ? 60
            : 45,

        confidence:
          project.next_action ? 92 : 82,

        source: "project",
        sourceId: project.id,
      },
    })
  }

  return (
    candidates.sort(
      (a, b) => b.score - a.score
    )[0]?.mission ?? {
      title: "Define today's highest-leverage move",
      detail:
        "MichaelOS has no active executable items.",
      whyToday:
        "No prioritized work is currently available.",
      ifIgnored:
        "No material consequence detected.",
      successLooksLike:
        "Add or activate current priorities.",
      estimatedFocusMinutes: 15,
      confidence: 50,
      source: "project",
      sourceId: "none",
    }
  )
}

export function buildExecutiveAgenda(
  input: Input
): ExecutiveAgendaItem[] {
  const projects = projectMap(input.projects)

  const rows: Array<{
    score: number
    item: ExecutiveAgendaItem
  }> = []

  for (const action of input.actions) {
    const priority = normalizedPriority(action.priority)

    rows.push({
      score:
        priorityWeight[priority] +
        (action.due_date ? 10 : 0),

      item: {
        id: `action-${action.id}`,

        title: action.project_id
          ? projects.get(action.project_id)?.name ??
            action.title
          : action.title,

        subtitle: action.title,
        source: "action",
        priority,
        projectId: action.project_id,
        dueDate: action.due_date,
      },
    })
  }

  for (const decision of input.decisions) {
    const priority = normalizedPriority(decision.priority)

    rows.push({
      score:
        priorityWeight[priority] +
        (decision.impact ?? 0),

      item: {
        id: `decision-${decision.id}`,
        title: decision.title,

        subtitle:
          decision.recommendation ??
          decision.context ??
          "Executive decision required",

        source: "decision",
        priority,
        projectId: decision.project_id,
        dueDate: decision.due_date,
      },
    })
  }

  for (const waiting of input.waitingOn) {
    const priority = normalizedPriority(waiting.priority)

    rows.push({
      score:
        priorityWeight[priority] +
        Math.min(
          daysSince(waiting.requested_on) * 5,
          30
        ),

      item: {
        id: `dependency-${waiting.id}`,
        title: `Follow up with ${waiting.person}`,
        subtitle: waiting.item,
        source: "dependency",
        priority,
        projectId: waiting.project_id,
        dueDate: waiting.follow_up_on,
      },
    })
  }

  // IMPORTANT:
  // Projects are a fallback agenda source so Atlas still
  // recommends useful work when actions/decisions/waiting_on
  // are not populated yet.
  for (const project of input.projects) {
    const priority = normalizedPriority(project.priority)

    rows.push({
      score:
        priorityWeight[priority] +
        (project.health === "red"
          ? 30
          : project.health === "amber"
          ? 15
          : 0) +
        (project.blocker ? 20 : 0) +
        (project.next_action ? 10 : 0),

      item: {
        id: `project-${project.id}`,
        title: project.name,

        subtitle:
          project.next_action ??
          project.next_milestone ??
          "Advance the next meaningful milestone.",

        source: "project",
        priority,
        projectId: project.id,
        dueDate: null,
      },
    })
  }

  return rows
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((entry) => entry.item)
}

export function buildRecommendations(
  input: Input
): ExecutiveRecommendation[] {
  const output: ExecutiveRecommendation[] = []

  const topDecision = [...input.decisions].sort(
    (a, b) =>
      (b.impact ?? 0) - (a.impact ?? 0)
  )[0]

  if (topDecision) {
    output.push({
      id: `decision-${topDecision.id}`,
      title: `Resolve ${topDecision.title}`,
      detail:
        topDecision.recommendation ??
        "Make the decision and assign the next action.",
      reason:
        topDecision.consequence_of_delay ??
        "Open decisions create downstream execution drag.",
      confidence: Math.min(
        100,
        topDecision.confidence ?? 85
      ),
    })
  }

  const oldestWaiting = [...input.waitingOn].sort(
    (a, b) =>
      daysSince(b.requested_on) -
      daysSince(a.requested_on)
  )[0]

  if (oldestWaiting) {
    output.push({
      id: `waiting-${oldestWaiting.id}`,
      title: `Close the loop with ${oldestWaiting.person}`,
      detail: oldestWaiting.item,
      reason: `This dependency has been open for ${daysSince(
        oldestWaiting.requested_on
      )} day(s).`,
      confidence: 90,
    })
  }

  const highRiskProject = input.projects.find(
    (project) =>
      project.health === "red" ||
      Boolean(project.blocker)
  )

  if (highRiskProject) {
    output.push({
      id: `project-${highRiskProject.id}`,
      title: `Intervene on ${highRiskProject.name}`,
      detail:
        highRiskProject.next_action ??
        "Define the next recovery action.",
      reason:
        highRiskProject.blocker ??
        "Project health requires executive attention.",
      confidence: 92,
    })
  }

  return output.slice(0, 3)
}

export function buildRisks(
  input: Input
): ExecutiveRisk[] {
  return input.projects
    .filter(
      (project) =>
        project.health === "red" ||
        project.health === "amber" ||
        Boolean(project.blocker)
    )
    .slice(0, 5)
    .map((project) => ({
      id: project.id,
      title: project.name,
      detail:
        project.blocker ??
        `${project.name} is currently ${project.health}.`,
      severity:
        project.health === "red"
          ? "critical"
          : project.health === "amber"
          ? "high"
          : "medium",
    }))
}

export function buildRelationshipAlerts(
  input: Input
): RelationshipAlert[] {
  return input.relationships
    .filter(
      (relationship) =>
        (relationship.open_loops ?? 0) > 0 ||
        daysSince(
          relationship.last_interaction
        ) >= 14
    )
    .sort(
      (a, b) =>
        (b.relevance_score ?? 0) -
        (a.relevance_score ?? 0)
    )
    .slice(0, 5)
    .map((relationship) => ({
      id: relationship.id,
      name: relationship.name,
      detail:
        relationship.next_move ??
        relationship.next_commitment ??
        `${
          relationship.open_loops ?? 0
        } open loop(s) require attention.`,
      relevance:
        relationship.relevance_score ?? 50,
    }))
}
