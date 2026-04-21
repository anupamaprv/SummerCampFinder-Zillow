import type { Program, Interest, SortKey } from "./types";

export interface SearchInput {
  zip: string;
  age: number;
  interests: Interest[];
}

export interface FilterState {
  types: string[];
  schedules: string[];
  maxCost: number;
  maxDistance: number;
}

export interface ScoredProgram extends Program {
  relevance: number;
  matchedInterests: number;
  showCollege: boolean;
}

export function scorePrograms(
  programs: Program[],
  input: SearchInput,
): ScoredProgram[] {
  return programs
    .filter((p) => input.age >= p.ageMin && input.age <= p.ageMax)
    .map((p) => {
      const matched = p.interests.filter((i) => input.interests.includes(i)).length;
      const interestScore = input.interests.length
        ? (matched / input.interests.length) * 100
        : 50;
      const distancePenalty = Math.max(0, 100 - p.distanceMi * 2);
      const relevance = Math.round(
        interestScore * 0.55 + distancePenalty * 0.2 + p.fun * 0.15 + p.uniqueness * 0.1,
      );
      return {
        ...p,
        relevance,
        matchedInterests: matched,
        showCollege: input.age >= 13,
      };
    });
}

export function applyFilters(items: ScoredProgram[], f: FilterState): ScoredProgram[] {
  return items.filter((p) => {
    if (f.types.length && !f.types.includes(p.type)) return false;
    if (f.schedules.length && !f.schedules.includes(p.schedule)) return false;
    if (p.costPerWeek > f.maxCost) return false;
    if (p.distanceMi > f.maxDistance) return false;
    return true;
  });
}

export function sortPrograms(items: ScoredProgram[], key: SortKey): ScoredProgram[] {
  const arr = [...items];
  switch (key) {
    case "cost-asc": arr.sort((a, b) => a.costPerWeek - b.costPerWeek); break;
    case "cost-desc": arr.sort((a, b) => b.costPerWeek - a.costPerWeek); break;
    case "distance": arr.sort((a, b) => a.distanceMi - b.distanceMi); break;
    case "uniqueness": arr.sort((a, b) => b.uniqueness - a.uniqueness); break;
    case "fun": arr.sort((a, b) => b.fun - a.fun); break;
    case "college": arr.sort((a, b) => b.collegeImpact - a.collegeImpact); break;
    default: arr.sort((a, b) => b.relevance - a.relevance);
  }
  return arr;
}