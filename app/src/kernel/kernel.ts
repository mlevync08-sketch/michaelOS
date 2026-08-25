import type { Project } from "../types/project"
import type { Signal } from "../types/signal"

import {
  buildExecutiveDashboard,
  type ExecutiveDashboard,
} from "../engine/brain"

export type KernelInput = {
  projects: Project[]
  signals?: Signal[]
}

export type KernelOutput = ExecutiveDashboard

export function runMichaelOSKernel(
  input: KernelInput
): KernelOutput {
  return buildExecutiveDashboard(
    input.projects,
    input.signals ?? []
  )
}