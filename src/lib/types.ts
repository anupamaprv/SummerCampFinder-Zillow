export type ProgramType =
  | "Day Camp"
  | "Overnight"
  | "Academic"
  | "Sports"
  | "Arts"
  | "STEM"
  | "Outdoor"
  | "Specialty"
  | "Childcare";

export type Schedule = "Half Day" | "Full Day" | "Weekly" | "Multi-Week";

export type Interest =
  | "Coding"
  | "Robotics"
  | "Music"
  | "Dance"
  | "Theater"
  | "Art"
  | "Sports"
  | "Martial Arts"
  | "Swimming"
  | "Nature"
  | "Science"
  | "Writing"
  | "Leadership"
  | "Cooking"
  | "Languages"
  | "Math"
  | "Chess"
  | "Engineering"
  | "Gymnastics"
  | "Filmmaking";

export interface Program {
  id: string;
  name: string;
  organization: string;
  type: ProgramType;
  schedule: Schedule;
  city: string;
  state: string;
  zip: string;
  distanceMi: number; // mocked from search ZIP
  ageMin: number;
  ageMax: number;
  costPerWeek: number;
  weeks: number;
  interests: Interest[];
  description: string;
  highlights: string[];
  uniqueness: number; // 1-100
  fun: number; // 1-100
  collegeImpact: number; // 1-100
  image: string;
  startDate: string;
  endDate: string;
}

export type SortKey =
  | "relevance"
  | "cost-asc"
  | "cost-desc"
  | "distance"
  | "uniqueness"
  | "fun"
  | "college";