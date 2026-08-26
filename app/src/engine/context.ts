import type { FounderContext } from "../types/founderContext"

export function summarizeFounderContext(
  context: FounderContext
): string {
  const priorities =
    context.currentPriorities.length > 0
      ? context.currentPriorities.join(", ")
      : "No active priorities."

  const companies =
    context.companies.join(", ")

  return `
Founder: ${context.founderName}
Role: ${context.role}

Companies:
${companies}

Mission:
${context.currentMission}

Current Priorities:
${priorities}

Active Fundraise:
${context.activeFundraise ? "Yes" : "No"}
`.trim()
}