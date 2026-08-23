import type { Project } from "../types/project"
import {
  buildExecutiveDashboard,
  type ExecutiveDashboard,
} from "../engine/brain"

export type KernelInput = {
  projects: Project[]
}

export type KernelOutput = ExecutiveDashboard

export function runMichaelOSKernel(
  input: KernelInput
): KernelOutput {
  return buildExecutiveDashboard(input.projects)
}