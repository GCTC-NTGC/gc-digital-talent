export interface FormValues {
  name: {
    en: string | null;
    fr: string | null;
  };
  description: {
    en: string | null;
    fr: string | null;
  };
  openDate: string;
  closeDate: string;
  learnMoreUrl: {
    en: string | null;
    fr: string | null;
  };
  includeLeadershipCompetencies: boolean;
  community: string;
  communityDevelopmentPrograms: {
    value: string;
    description: {
      en: string | null;
      fr: string | null;
    };
  }[];
}
