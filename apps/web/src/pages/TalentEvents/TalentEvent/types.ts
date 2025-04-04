import { TalentEventNominationsTableFragment as TalentEventNominationsTableFragmentType } from "@gc-digital-talent/graphql";

export interface RouteParams extends Record<string, string> {
  eventId: string;
}

export type TalentNominator = NonNullable<
  NonNullable<
    TalentEventNominationsTableFragmentType["nominations"]
  >[number]["nominator"]
>;
