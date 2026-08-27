import type { Project } from "../types/project"
import type { ActionItem } from "../types/executiveState"

export type ActionCategory =
  | "deep_work"
  | "quick_win"
  | "delegated"
  | "execution"

export type ActionIntelligenceItem = {
  id: string
  title: string
  projectId: string | null
  projectName: string | null
  owner: string | null
  dueDate: string | null
  priority: "critical" | "high" | "medium" | "low"
  category: ActionCategory
  source: "action" | "project_fallback"
  score: number
  scoreReasons: string[]
  estimatedMinutes: number
  leverage: "critical" | "high" | "medium" | "low"
  overdue: boolean
}

export type ActionIntelligence = {
  queue: ActionIntelligenceItem[]
  deepWork: ActionIntelligenceItem[]
  quickWins: ActionIntelligenceItem[]
  delegated: ActionIntelligenceItem[]
  execution: ActionIntelligenceItem[]
  stats: {
    total: number
    deepWork: number
    quickWins: number
    delegated: number
    overdue: number
    highLeverage: number
  }
  recommendation: {
    title: string
    detail: string
    confidence: number
  }
}

type BuildInput = {
  actions: ActionItem[]
  projects: Project[]
}

const priorityWeight: Record<string, number> = {
  critical: 50,
  high: 35,
  medium: 20,
  low: 10,
}

function normalizedPriority(
  value?: string | null
): "critical" | "high" | "medium" | "low" {
  const p = (value ?? "medium").toLowerCase()
  if (
    p === "critical" ||
    p === "high" ||
    p === "medium" ||
    p === "low"
  ) {
    return p
  }
  return "medium"
}

function isOverdue(dueDate: string | null) {
  if (!dueDate) return false
  const due = new Date(`${dueDate}T23:59:59`).getTime()
  return Number.isFinite(due) && due < Date.now()
}

function daysUntil(dueDate: string | null) {
  if (!dueDate) return null
  const due = new Date(`${dueDate}T23:59:59`).getTime()
  if (!Number.isFinite(due)) return null
  return Math.ceil((due - Date.now()) / 86400000)
}

function estimateMinutes(
  priority: "critical" | "high" | "medium" | "low",
  title: string,
  bucket: string | null
) {
  const text = `${title} ${bucket ?? ""}`.toLowerCase()

  if (
    text.includes("email") ||
    text.includes("reply") ||
    text.includes("follow up") ||
    text.includes("follow-up") ||
    text.includes("confirm") ||
    text.includes("schedule")
  ) {
    return 15
  }

  if (
    text.includes("review") ||
    text.includes("draft") ||
    text.includes("finalize") ||
    text.includes("model") ||
    text.includes("deck") ||
    text.includes("strategy")
  ) {
    return priority === "critical" ? 90 : 60
  }

  if (priority === "critical") return 75
  if (priority === "high") return 45
  if (priority === "medium") return 30
  return 20
}

function classifyCategory(
  item: {
    owner: string | null
    bucket: string | null
    estimatedMinutes: number
    title: string
  }
): ActionCategory {
  const bucket = (item.bucket ?? "").toLowerCase()
  const title = item.title.toLowerCase()
  const owner = (item.owner ?? "").toLowerCase()

  if (
    bucket.includes("delegate") ||
    bucket.includes("delegated") ||
    (owner &&
      !["michael", "michael levy", "me"].includes(owner))
  ) {
    return "delegated"
  }

  if (
    item.estimatedMinutes <= 20 ||
    bucket.includes("quick") ||
    title.includes("confirm") ||
    title.includes("reply") ||
    title.includes("follow up") ||
    title.includes("follow-up")
  ) {
    return "quick_win"
  }

  if (
    item.estimatedMinutes >= 45 ||
    bucket.includes("deep") ||
    bucket.includes("focus")
  ) {
    return "deep_work"
  }

  return "execution"
}

function leverageFromScore(
  score: number
): "critical" | "high" | "medium" | "low" {
  if (score >= 85) return "critical"
  if (score >= 65) return "high"
  if (score >= 40) return "medium"
  return "low"
}

function scoreAction(input: {
  priority: "critical" | "high" | "medium" | "low"
  dueDate: string | null
  project?: Project
  owner: string | null
  estimatedMinutes: number
}) {
  let score = priorityWeight[input.priority]
  const reasons: string[] = [
    `${input.priority} priority (+${priorityWeight[input.priority]})`,
  ]

  const days = daysUntil(input.dueDate)

  if (days !== null) {
    if (days < 0) {
      score += 30
      reasons.push("Overdue (+30)")
    } else if (days === 0) {
      score += 25
      reasons.push("Due today (+25)")
    } else if (days <= 2) {
      score += 15
      reasons.push("Due within 48h (+15)")
    }
  }

  if (input.project?.blocker) {
    score += 20
    reasons.push("Reduces active blocker (+20)")
  }

  if (input.project?.health === "red") {
    score += 15
    reasons.push("Red project (+15)")
  } else if (input.project?.health === "amber") {
    score += 8
    reasons.push("Amber project (+8)")
  }

  if (input.estimatedMinutes <= 20) {
    score += 8
    reasons.push("Low execution cost (+8)")
  }

  if (
    input.owner &&
    !["michael", "michael levy", "me"].includes(
      input.owner.toLowerCase()
    )
  ) {
    score += 5
    reasons.push("Delegation leverage (+5)")
  }

  return {
    score: Math.min(score, 100),
    reasons,
  }
}

export function buildActionIntelligence({
  actions,
  projects,
}: BuildInput): ActionIntelligence {
  const projectMap = new Map(
    projects.map((project) => [project.id, project])
  )

  const explicitItems: ActionIntelligenceItem[] =
    actions.map((action) => {
      const priority = normalizedPriority(action.priority)
      const project = action.project_id
        ? projectMap.get(action.project_id)
        : undefined
      const estimatedMinutes = estimateMinutes(
        priority,
        action.title,
        action.bucket
      )

      const scoring = scoreAction({
        priority,
        dueDate: action.due_date,
        project,
        owner: action.owner,
        estimatedMinutes,
      })

      const category = classifyCategory({
        owner: action.owner,
        bucket: action.bucket,
        estimatedMinutes,
        title: action.title,
      })

      return {
        id: action.id,
        title: action.title,
        projectId: action.project_id,
        projectName: project?.name ?? null,
        owner: action.owner,
        dueDate: action.due_date,
        priority,
        category,
        source: "action",
        score: scoring.score,
        scoreReasons: scoring.reasons,
        estimatedMinutes,
        leverage: leverageFromScore(scoring.score),
        overdue: isOverdue(action.due_date),
      }
    })

  // Until the explicit actions table is fully populated,
  // project.next_action remains a truthful fallback source.
  const fallbackItems: ActionIntelligenceItem[] =
    projects
      .filter(
        (project) =>
          Boolean(project.next_action) &&
          !explicitItems.some(
            (item) =>
              item.projectId === project.id &&
              item.title.trim().toLowerCase() ===
                project.next_action?.trim().toLowerCase()
          )
      )
      .map((project) => {
        const priority = normalizedPriority(project.priority)
        const title =
          project.next_action ??
          `Advance ${project.name}`
        const estimatedMinutes = estimateMinutes(
          priority,
          title,
          null
        )

        const scoring = scoreAction({
          priority,
          dueDate: null,
          project,
          owner: project.owner,
          estimatedMinutes,
        })

        const category = classifyCategory({
          owner: project.owner,
          bucket: null,
          estimatedMinutes,
          title,
        })

        return {
          id: `project-${project.id}`,
          title,
          projectId: project.id,
          projectName: project.name,
          owner: project.owner,
          dueDate: null,
          priority,
          category,
          source: "project_fallback",
          score: scoring.score,
          scoreReasons: [
            ...scoring.reasons,
            "Project next-action fallback",
          ],
          estimatedMinutes,
          leverage: leverageFromScore(scoring.score),
          overdue: false,
        }
      })

  const queue = [...explicitItems, ...fallbackItems].sort(
    (a, b) => b.score - a.score
  )

  const deepWork = queue.filter(
    (item) => item.category === "deep_work"
  )
  const quickWins = queue.filter(
    (item) => item.category === "quick_win"
  )
  const delegated = queue.filter(
    (item) => item.category === "delegated"
  )
  const execution = queue.filter(
    (item) => item.category === "execution"
  )

  const top = queue[0]

  return {
    queue,
    deepWork,
    quickWins,
    delegated,
    execution,

    stats: {
      total: queue.length,
      deepWork: deepWork.length,
      quickWins: quickWins.length,
      delegated: delegated.length,
      overdue: queue.filter((item) => item.overdue).length,
      highLeverage: queue.filter(
        (item) =>
          item.leverage === "critical" ||
          item.leverage === "high"
      ).length,
    },

    recommendation: top
      ? {
          title: top.title,
          detail: `${
            top.projectName
              ? `${top.projectName} • `
              : ""
          }${top.estimatedMinutes} min • ${top.leverage} leverage`,
          confidence: Math.min(
            97,
            75 + Math.round(top.score / 5)
          ),
        }
      : {
          title: "No immediate execution move detected",
          detail:
            "Add actions or project next-actions to activate the Actions Engine.",
          confidence: 60,
        },
  }
}
