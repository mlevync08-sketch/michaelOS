export type FounderContext = {
  founderName: string

  role: string

  companies: string[]

  currentMission: string

  annualObjectives: string[]

  quarterlyObjectives: string[]

  currentPriorities: string[]

  activeFundraise: boolean

  strategicThemes: string[]

  decisionStyle: string

  communicationStyle: string

  preferredWorkingHours: {
    start: string
    end: string
  }

  created_at: string

  updated_at: string
}