export interface RouteParams extends Record<string, string> {
  talentNominationGroupId: string;
}

export const SECTION_KEY = {
  BASIC: "basic",
  COMMUNITY: "community",
  TALENT_MANAGEMENT: "talent-management",
  NEXT_ROLE_CAREER_OBJECTIVE: "next-role-career-objective",
  GOALS_AND_WORK_STYLE: "goals-and-work-style",
  RECRUITMENT_PROCESSES: "recruitment-processes",
} as const;
