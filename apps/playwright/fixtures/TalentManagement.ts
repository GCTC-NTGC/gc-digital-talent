import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

import type {
  Classification,
  NineBoxRating,
  Skill,
  TalentNominationLateralMovementOption,
  TalentNominationNomineeRelationshipToNominator,
  TalentNominationSubmitterRelationshipToNominator,
  User,
} from "@gc-digital-talent/graphql/schema-types";

import type { GraphQLContext } from "~/utils/graphql";
import { getTalentNominationOptions } from "~/utils/talentNominations";

import AppPage from "./AppPage";
import { escapeRegExp } from "./GenericTableValidationFixture";

const FIELD = {
  TALENT_MANAGEMENT_LINK: "talentManagementLink",
  TALENT_MANAGEMENT_HEADING: "talentManagementHeading",
  STATUS_FILTER: "statusFilter",
  PAGE_SIZE: "pageSize",
  PAGE_SIZE_500: "pageSize500",
  NEXT_PAGE: "nextPage",
  NOMINATIONS_LINK: "nominationsLink",
  TALENT_NOMINATIONS_HEADING: "talentNominationsHeading",
  TALENT_NOMINATIONS_REGION: "talentNominationsRegion",
  LEARN_MORE_LINK: "learnMoreLink",
  NOMINATE_TALENT_LINK: "nominateTalentLink",
  ALERT_MESSAGE: "alertMessage",
  NEXT_STEP: "nextStep",
  ON_NOMINATORS_BEHALF: "onNominatorsBehalf",
  NOMINATOR_RELATIONSHIP: "nominatorRelationship",
  NOMINEE_RELATIONSHIP: "nomineeRelationship",
  NOMINATOR_EMAIL_SEARCH: "nominatorEmailSearch",
  NOMINEE_EMAIL_SEARCH: "nomineeEmailSearch",
  REFERENCE_EMAIL_SEARCH: "referenceEmailSearch",
  SEARCH_WORK_EMAIL: "searchWorkEmail",
  USER_FOUND: "userFound",
  INFORMATION_CORRECT: "informationCorrect",
  ADVANCEMENT: "advancement",
  LATERAL_MOVEMENT: "lateralMovement",
  DEVELOPMENT_OPPORTUNITIES: "developmentOpportunities",
  PERFORMANCE: "performance",
  LEADERSHIP_POTENTIAL: "leadershipPotential",
  RECOMMENDED_CLASSIFICATIONS: "recommendedClassifications",
  LATERAL_MOVEMENT_OPTIONS: "lateralMovementOptions",
  DEVELOPMENT_PROGRAMS: "developmentPrograms",
  ADDITIONAL_COMMENTS: "additionalComments",
  NOMINATION_RATIONALE: "nominationRationale",
  LEADERSHIP_COMPETENCIES: "leadershipCompetencies",
  SUBMIT_NOMINATION: "submitNomination",
  NOMINATION_RECEIVED_HEADING: "nominationReceivedHeading",
  RETURN_TO_DASHBOARD: "returnToDashboard",
  TALENT_NOMINATIONS_BUTTON: "talentNominationsButton",
  REVIEW_NOMINATION_HEADING: "reviewNominationHeading",
  OPEN_EVALUATION: "openEvaluation",
  ADVANCEMENT_NOT_SUPPORTED: "advancementNotSupported",
  ADVANCEMENT_APPROVED: "advancementApproved",
  LATERAL_MOVEMENT_NOT_SUPPORTED: "lateralMovementNotSupported",
  LATERAL_MOVEMENT_APPROVED: "lateralMovementApproved",
  DEVELOPMENT_PROGRAMS_NOT_SUPPORTED: "developmentProgramsNotSupported",
  DEVELOPMENT_PROGRAMS_APPROVED: "developmentProgramsApproved",
  NOT_SUPPORTED_REASON: "notSupportedReason",
  ELIGIBILITY_CONFIRMED: "eligibilityConfirmed",
  ADVANCEMENT_CLASSIFICATIONS: "advancementClassifications",
  OPTION: "option",
  REFERRAL_EQUIVALENCIES: "referralEquivalencies",
  REFERRAL_EXPIRY_DATE: "referralExpiryDate",
  SUBMIT_EVALUATION: "submitEvaluation",
  NOMINATION_HISTORY_TAB: "nominationHistoryTab",
  EXPAND_ALL_NOMINATIONS: "expandAllNominations",
  NOMINATION_HISTORY_EVENTS: "nominationHistoryEvents",
  CREATE_TALENT_EVENT_LINK: "createTalentEventLink",
  FUNCTIONAL_COMMUNITY: "functionalCommunity",
  EVENT_NAME_EN: "eventNameEn",
  EVENT_NAME_FR: "eventNameFr",
  EVENT_DESCRIPTION_EN: "eventDescriptionEn",
  EVENT_DESCRIPTION_FR: "eventDescriptionFr",
  EVENT_CONTACT_EMAIL: "eventContactEmail",
  NOMINATION_START_DATE: "nominationStartDate",
  NOMINATION_CLOSE_DATE: "nominationCloseDate",
  INCLUDE_NINE_BOX: "includeNineBox",
  CREATE_TALENT_EVENT: "createTalentEvent",
  EDIT_TALENT_EVENT_LINK: "editTalentEventLink",
  SAVE_CHANGES: "saveChanges",
  CLOSED_EVENT_DIALOG: "closedEventDialog",
} as const;

type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

/**
 * Nomination options with their label and the matching TalentNomination / TalentNominationGroup fields.
 * Labels are the front-end ones; the API's TalentNominationOption labels differ ("development program").
 */
const nominationOptions = [
  {
    label: "Advancement",
    nominated: "nominateForAdvancement",
    count: "advancementNominationCount",
    decision: "advancementDecision",
  },
  {
    label: "Lateral movement",
    nominated: "nominateForLateralMovement",
    count: "lateralMovementNominationCount",
    decision: "lateralMovementDecision",
  },
  {
    label: "Development",
    nominated: "nominateForDevelopmentPrograms",
    count: "developmentProgramsNominationCount",
    decision: "developmentProgramsDecision",
  },
] as const;

/** What a test enters when nominating; the nomination history is validated against it */
export interface TalentNominationDetails {
  /** Users with workEmail, currentClassification and department */
  nominator: User;
  nominee: User;
  /** The advancement reference must be a verified government employee */
  reference: User;
  /** Option labels as the form shows them */
  submitterRelationship: string;
  nomineeRelationship: string;
  lateralMovementOptions: string[];
  recommendedClassification: Classification;
  rationale: string;
  additionalComments: string;
  /** Only asked when the event includes them */
  nineBox?: { performance: string; leadershipPotential: string };
  developmentProgram?: string;
  skills: Skill[];
}

/** A nomination as a spec describes it: option enum values instead of labels */
export type TalentNominationInput = Omit<
  TalentNominationDetails,
  | "submitterRelationship"
  | "nomineeRelationship"
  | "lateralMovementOptions"
  | "nineBox"
> & {
  submitterRelationship: TalentNominationSubmitterRelationshipToNominator;
  nomineeRelationship: TalentNominationNomineeRelationshipToNominator;
  lateralMovementOptions: TalentNominationLateralMovementOption[];
  /** Only for events that include the nine box questions */
  performance?: NineBoxRating;
  leadershipPotential?: NineBoxRating;
};

/** One nomination as the nominee's nomination history shows it */
export interface NominationHistoryEntry {
  eventName: string;
  details: TalentNominationDetails;
  /** With workEmail, currentClassification and department */
  submitter: User;
  status: string;
  received: string;
  /** The nominee's classification is recorded once the nomination is evaluated */
  evaluated: boolean;
}

const fullName = (user: User) => `${user.firstName} ${user.lastName}`;

// Always advancement and lateral movement; development only when the event offers programs
const nominatedFor = (details: TalentNominationDetails) =>
  nominationOptions.filter(
    ({ nominated }) =>
      nominated !== "nominateForDevelopmentPrograms" ||
      !!details.developmentProgram,
  );

/** Builds the nomination details with the option labels the form and history show */
export const buildTalentNominationDetails = async (
  ctx: GraphQLContext,
  {
    submitterRelationship,
    nomineeRelationship,
    lateralMovementOptions,
    performance,
    leadershipPotential,
    ...details
  }: TalentNominationInput,
): Promise<TalentNominationDetails> => {
  const options = await getTalentNominationOptions(ctx, {});
  const labelOf = <T extends { value: unknown; label: { en?: string | null } }>(
    list: T[],
    value: T["value"],
  ) => list.find((option) => option.value === value)?.label.en ?? "";

  return {
    ...details,
    submitterRelationship: labelOf(
      options.submitterRelationships,
      submitterRelationship,
    ),
    nomineeRelationship: labelOf(
      options.nomineeRelationships,
      nomineeRelationship,
    ),
    lateralMovementOptions: lateralMovementOptions.map((option) =>
      labelOf(options.lateralMovementOptions, option),
    ),
    nineBox:
      performance && leadershipPotential
        ? {
            performance: labelOf(options.nineBoxRatings, performance),
            leadershipPotential: labelOf(
              options.nineBoxRatings,
              leadershipPotential,
            ),
          }
        : undefined,
  };
};

/**
 * Talent Management
 *
 * Page containing utilities to interact with talent management
 */
class TalentManagement extends AppPage {
  readonly locators: Record<Field, Locator>;

  constructor(page: Page) {
    super(page);
    this.locators = {
      [FIELD.TALENT_MANAGEMENT_LINK]: page.getByRole("link", {
        name: /talent management/i,
      }),
      [FIELD.TALENT_MANAGEMENT_HEADING]: page.getByRole("heading", {
        name: /talent management/i,
        level: 1,
      }),
      [FIELD.STATUS_FILTER]: page.getByRole("button", { name: /status/i }),
      [FIELD.PAGE_SIZE]: page.getByRole("button", { name: /show 10/i }),
      [FIELD.PAGE_SIZE_500]: page.getByRole("menuitemradio", {
        name: /^500$/i,
      }),
      [FIELD.NEXT_PAGE]: page.getByRole("button", {
        name: /go to next page/i,
      }),
      [FIELD.NOMINATIONS_LINK]: page.getByRole("link", {
        name: /nominations/i,
      }),
      [FIELD.TALENT_NOMINATIONS_HEADING]: page.getByRole("heading", {
        name: /talent nominations/i,
        level: 2,
      }),
      [FIELD.TALENT_NOMINATIONS_REGION]: page.getByRole("region", {
        name: /talent nominations/i,
      }),
      [FIELD.LEARN_MORE_LINK]: page.getByRole("link", {
        name: /learn more about talent management/i,
      }),
      [FIELD.NOMINATE_TALENT_LINK]: page.getByRole("link", {
        name: /nominate talent/i,
      }),
      [FIELD.ALERT_MESSAGE]: page.getByRole("alert"),
      [FIELD.NEXT_STEP]: page.getByRole("button", { name: /next step/i }),
      [FIELD.ON_NOMINATORS_BEHALF]: page.getByRole("radio", {
        name: /I’m submitting the nomination on the nominator’s behalf/i,
      }),
      [FIELD.NOMINATOR_RELATIONSHIP]: page.getByRole("group", {
        name: /relationship to the nominator/i,
      }),
      [FIELD.NOMINEE_RELATIONSHIP]: page.getByRole("group", {
        name: /relationship to nominator/i,
      }),
      [FIELD.NOMINATOR_EMAIL_SEARCH]: page.getByRole("textbox", {
        name: /Search nominator's work email/i,
      }),
      [FIELD.NOMINEE_EMAIL_SEARCH]: page.getByRole("textbox", {
        name: /Search nominee's work email/i,
      }),
      [FIELD.REFERENCE_EMAIL_SEARCH]: page.getByRole("textbox", {
        name: /Search reference's work email/i,
      }),
      [FIELD.SEARCH_WORK_EMAIL]: page.getByRole("button", {
        name: /Search work email/i,
      }),
      [FIELD.USER_FOUND]: page.getByText(
        /we found a user with this email address/i,
      ),
      [FIELD.INFORMATION_CORRECT]: page.getByRole("radio", {
        name: /the information provided is correct/i,
      }),
      [FIELD.ADVANCEMENT]: page.getByRole("checkbox", {
        name: /advancement/i,
      }),
      [FIELD.LATERAL_MOVEMENT]: page.getByRole("checkbox", {
        name: /lateral movement/i,
      }),
      [FIELD.DEVELOPMENT_OPPORTUNITIES]: page.getByRole("checkbox", {
        name: /development opportunities/i,
      }),
      [FIELD.PERFORMANCE]: page.getByRole("group", {
        name: /nominee's performance assessment/i,
      }),
      [FIELD.LEADERSHIP_POTENTIAL]: page.getByRole("group", {
        name: /nominee's leadership potential/i,
      }),
      [FIELD.RECOMMENDED_CLASSIFICATIONS]: page.getByRole("combobox", {
        name: /classification options recommended/i,
      }),
      [FIELD.LATERAL_MOVEMENT_OPTIONS]: page.getByRole("group", {
        name: /lateral movement options/i,
      }),
      [FIELD.DEVELOPMENT_PROGRAMS]: page.getByRole("group", {
        name: /development opportunities/i,
      }),
      [FIELD.NOMINATION_RATIONALE]: page.getByRole("textbox", {
        name: /nomination rationale/i,
      }),
      [FIELD.LEADERSHIP_COMPETENCIES]: page.getByRole("combobox", {
        name: /top 3 key leadership competencies/i,
      }),
      [FIELD.ADDITIONAL_COMMENTS]: page.getByRole("textbox", {
        name: /additional comments/i,
      }),
      [FIELD.SUBMIT_NOMINATION]: page.getByRole("button", {
        name: /submit nomination/i,
      }),
      [FIELD.NOMINATION_RECEIVED_HEADING]: page.getByRole("heading", {
        name: /We’ve received your nomination/i,
        level: 2,
      }),
      [FIELD.RETURN_TO_DASHBOARD]: page.getByRole("link", {
        name: /return to your dashboard/i,
      }),
      [FIELD.TALENT_NOMINATIONS_BUTTON]: page.getByRole("button", {
        name: /talent nominations/i,
      }),
      [FIELD.REVIEW_NOMINATION_HEADING]: page.getByRole("heading", {
        name: /review a nomination/i,
      }),
      [FIELD.OPEN_EVALUATION]: page.getByRole("button", {
        name: /submit the evaluation of this nomination/i,
      }),
      [FIELD.ADVANCEMENT_NOT_SUPPORTED]: page
        .getByRole("group", { name: /advancement approval/i })
        .getByRole("radio", {
          name: /this nomination for advancement is not supported./i,
        }),
      [FIELD.ADVANCEMENT_APPROVED]: page
        .getByRole("group", { name: /advancement approval/i })
        .getByRole("radio", {
          name: /this nomination for advancement is approved./i,
        }),
      [FIELD.LATERAL_MOVEMENT_NOT_SUPPORTED]: page
        .getByRole("group", { name: /Lateral movement approval/i })
        .getByRole("radio", {
          name: /this nomination for lateral movement is not supported./i,
        }),
      [FIELD.LATERAL_MOVEMENT_APPROVED]: page
        .getByRole("group", { name: /Lateral movement approval/i })
        .getByRole("radio", {
          name: /this nomination for lateral movement is approved./i,
        }),
      [FIELD.DEVELOPMENT_PROGRAMS_NOT_SUPPORTED]: page
        .getByRole("group", { name: /Development programs approval/i })
        .getByRole("radio", {
          name: /this nomination for development programs is not supported./i,
        }),
      [FIELD.DEVELOPMENT_PROGRAMS_APPROVED]: page
        .getByRole("group", { name: /Development programs approval/i })
        .getByRole("radio", {
          name: /this nomination for development programs is approved./i,
        }),
      [FIELD.NOT_SUPPORTED_REASON]: page.getByRole("textbox", {
        name: /reason for not supporting this nomination/i,
      }),
      [FIELD.ELIGIBILITY_CONFIRMED]: page.getByRole("checkbox", {
        name: /I’ve confirmed this nominee’s eligibility by contacting the secondary reference provided by the nominator./i,
      }),
      [FIELD.ADVANCEMENT_CLASSIFICATIONS]: page.getByRole("combobox", {
        name: /classifications this nominee is eligible to advance to/i,
      }),
      [FIELD.OPTION]: page.getByRole("option"),
      [FIELD.REFERRAL_EQUIVALENCIES]: page.getByRole("combobox", {
        name: /relevant referral equivalencies/i,
      }),
      [FIELD.REFERRAL_EXPIRY_DATE]: page.getByRole("group", {
        name: /referral expiry date/i,
      }),
      [FIELD.SUBMIT_EVALUATION]: page.getByRole("button", {
        name: /submit evaluation/i,
      }),
      [FIELD.NOMINATION_HISTORY_TAB]: page.getByRole("link", {
        name: /nomination history/i,
      }),
      [FIELD.EXPAND_ALL_NOMINATIONS]: page.getByRole("button", {
        name: /expand all/i,
      }),
      // Each expanded event is a region named after its trigger, e.g. "Event name (2)"
      [FIELD.NOMINATION_HISTORY_EVENTS]: page.getByRole("region", {
        name: /\(\d+\)/,
      }),
      [FIELD.CREATE_TALENT_EVENT_LINK]: page.getByRole("link", {
        name: /create talent nomination event/i,
      }),
      [FIELD.FUNCTIONAL_COMMUNITY]: page.getByRole("combobox", {
        name: /functional community/i,
      }),
      [FIELD.EVENT_NAME_EN]: page.getByRole("textbox", {
        name: /name \(english\)/i,
      }),
      [FIELD.EVENT_NAME_FR]: page.getByRole("textbox", {
        name: /name \(french\)/i,
      }),
      [FIELD.EVENT_DESCRIPTION_EN]: page.getByRole("textbox", {
        name: /description \(english\)/i,
      }),
      [FIELD.EVENT_DESCRIPTION_FR]: page.getByRole("textbox", {
        name: /description \(french\)/i,
      }),
      [FIELD.EVENT_CONTACT_EMAIL]: page.getByRole("textbox", {
        name: /event contact email/i,
      }),
      [FIELD.NOMINATION_START_DATE]: page.getByRole("group", {
        name: /nomination start date/i,
      }),
      [FIELD.NOMINATION_CLOSE_DATE]: page.getByRole("group", {
        name: /nomination close date/i,
      }),
      // "Leadership performance questions" checkbox
      [FIELD.INCLUDE_NINE_BOX]: page.getByRole("checkbox", {
        name: /performance and leadership potential/i,
      }),
      [FIELD.CREATE_TALENT_EVENT]: page.getByRole("button", {
        name: /create talent nomination event/i,
      }),
      [FIELD.EDIT_TALENT_EVENT_LINK]: page.getByRole("link", {
        name: /edit talent nomination event/i,
      }),
      [FIELD.SAVE_CHANGES]: page.getByRole("button", { name: /save changes/i }),
      [FIELD.CLOSED_EVENT_DIALOG]: page.getByRole("dialog", {
        name: /closed nomination event/i,
      }),
    };
  }

  async goToTalentManagementTable() {
    await this.locators[FIELD.TALENT_MANAGEMENT_LINK].click();
    await this.waitForGraphqlResponse("TalentEvents");
    await this.locators[FIELD.STATUS_FILTER].click();
    await expect(this.locators[FIELD.TALENT_MANAGEMENT_HEADING]).toBeVisible();
  }

  async viewTalentNominationEvent(eventName: string) {
    await this.locators[FIELD.PAGE_SIZE].click();
    await this.locators[FIELD.PAGE_SIZE_500].click();
    await this.page.keyboard.press("Escape");
    const link = this.page.getByRole("link", { name: eventName, exact: true });
    while (!(await link.isVisible())) {
      await this.locators[FIELD.NEXT_PAGE].click();
    }
    await link.click();
    await this.waitForGraphqlResponse("TalentEventDetails");
    await expect(
      this.page.getByRole("heading", { name: eventName, level: 1 }),
    ).toBeVisible();
  }

  async viewNominations() {
    await this.locators[FIELD.NOMINATIONS_LINK].click();
    await this.waitForGraphqlResponse("TalentEventNominations");
    await expect(this.locators[FIELD.TALENT_NOMINATIONS_HEADING]).toBeVisible();
  }

  async viewNominee(nomineeIdentifier: string) {
    await this.locators[FIELD.TALENT_NOMINATIONS_REGION]
      .getByRole("link", { name: nomineeIdentifier })
      .click();
    await this.waitForGraphqlResponse("TalentNominationGroupDetails");
  }

  async startTalentNomination(talentEvent: string) {
    await this.locators[FIELD.LEARN_MORE_LINK].click();
    await this.locators[FIELD.NOMINATE_TALENT_LINK].click();
    await this.waitForGraphqlResponse("TalentManagementEventsPage");
    await this.page
      .getByRole("link", {
        name: `Start a nomination for ${talentEvent}`,
      })
      .click();
  }

  async fillNominatorStep(details: TalentNominationDetails) {
    await this.locators[FIELD.NEXT_STEP].click();
    await this.locators[FIELD.ON_NOMINATORS_BEHALF].click();
    await this.locators[FIELD.NOMINATOR_RELATIONSHIP]
      .getByRole("radio", { name: details.submitterRelationship, exact: true })
      .click();
    await this.locators[FIELD.NOMINATOR_EMAIL_SEARCH].fill(
      details.nominator.workEmail ?? "",
    );
    await this.locators[FIELD.SEARCH_WORK_EMAIL].click();
    await this.waitForGraphqlResponse("EmployeeSearch");
    await expect(this.locators[FIELD.USER_FOUND]).toBeVisible();
    await this.locators[FIELD.INFORMATION_CORRECT].click();
    await this.locators[FIELD.NEXT_STEP].click();
  }

  async fillNomineeStep(details: TalentNominationDetails) {
    await this.locators[FIELD.NOMINEE_EMAIL_SEARCH].fill(
      details.nominee.workEmail ?? "",
    );
    await this.locators[FIELD.SEARCH_WORK_EMAIL].click();
    await this.waitForGraphqlResponse("EmployeeSearch");
    await expect(this.locators[FIELD.USER_FOUND]).toBeVisible();
    await this.locators[FIELD.INFORMATION_CORRECT].click();
    await this.locators[FIELD.NOMINEE_RELATIONSHIP]
      .getByRole("radio", { name: details.nomineeRelationship, exact: true })
      .click();
    await this.locators[FIELD.NEXT_STEP].click();
  }

  async fillNominationDetailsStep(details: TalentNominationDetails) {
    if (details.nineBox) {
      // The radios read e.g. "High performance"; the API label is "High"
      await this.locators[FIELD.PERFORMANCE]
        .getByRole("radio", {
          name: new RegExp(`^${details.nineBox.performance}`),
        })
        .click();
      await this.locators[FIELD.LEADERSHIP_POTENTIAL]
        .getByRole("radio", {
          name: new RegExp(`^${details.nineBox.leadershipPotential}`),
        })
        .click();
    }
    await this.locators[FIELD.ADVANCEMENT].click();
    await this.locators[FIELD.LATERAL_MOVEMENT].click();
    await this.locators[FIELD.REFERENCE_EMAIL_SEARCH].fill(
      details.reference.workEmail ?? "",
    );
    await this.locators[FIELD.SEARCH_WORK_EMAIL].click();
    await this.waitForGraphqlResponse("EmployeeSearch");
    await expect(this.locators[FIELD.USER_FOUND]).toBeVisible();
    await this.locators[FIELD.INFORMATION_CORRECT].click();
    const classifications = this.locators[FIELD.RECOMMENDED_CLASSIFICATIONS];
    await classifications.fill(details.recommendedClassification.groupAndLevel);
    await classifications.press("ArrowDown");
    await classifications.press("Enter");
    // Option labels are followed by a description
    for (const option of details.lateralMovementOptions) {
      await this.locators[FIELD.LATERAL_MOVEMENT_OPTIONS]
        .getByRole("checkbox", { name: new RegExp(`^${escapeRegExp(option)}`) })
        .click();
    }
    if (details.developmentProgram) {
      await this.locators[FIELD.DEVELOPMENT_OPPORTUNITIES].click();
      await this.locators[FIELD.DEVELOPMENT_PROGRAMS]
        .getByRole("checkbox", {
          name: new RegExp(`^${escapeRegExp(details.developmentProgram)}`),
        })
        .click();
    }
    await this.locators[FIELD.NEXT_STEP].click();
  }

  async fillRationaleStep(details: TalentNominationDetails) {
    await this.locators[FIELD.NOMINATION_RATIONALE].fill(details.rationale);
    const skillCombobox = this.locators[FIELD.LEADERSHIP_COMPETENCIES];
    for (const skill of details.skills) {
      await skillCombobox.fill(skill.name.en ?? "");
      await skillCombobox.press("ArrowDown");
      await skillCombobox.press("Enter");
    }
    await this.locators[FIELD.ADDITIONAL_COMMENTS].fill(
      details.additionalComments,
    );
    await this.locators[FIELD.NEXT_STEP].click();
  }

  /** The "Review and submit" step shows everything that was entered */
  async validateNominationReview(details: TalentNominationDetails) {
    const fields: [string, string][] = [
      ["Your role", "I’m submitting the nomination on the nominator’s behalf"],
      ["Nominator’s name", fullName(details.nominator)],
      ["Nominator’s work email", details.nominator.workEmail ?? ""],
      [
        "Nominator's classification",
        details.nominator.currentClassification?.groupAndLevel ?? "",
      ],
      [
        "Nominator’s department or agency",
        details.nominator.department?.name.en ?? "",
      ],
      ["Nominee's name", fullName(details.nominee)],
      ["Nominee's work email", details.nominee.workEmail ?? ""],
      [
        "Nominee's classification",
        details.nominee.currentClassification?.groupAndLevel ?? "",
      ],
      [
        "Nominee's department or agency",
        details.nominee.department?.name.en ?? "",
      ],
      ...nominatedFor(details).map(({ label }): [string, string] => [
        "Nomination options",
        label,
      ]),
      ["Reference’s name", fullName(details.reference)],
      ["Reference's work email", details.reference.workEmail ?? ""],
      [
        "Reference's classification",
        details.reference.currentClassification?.groupAndLevel ?? "",
      ],
      [
        "Reference's department or agency",
        details.reference.department?.name.en ?? "",
      ],
      [
        "Recommended classifications for advancement",
        details.recommendedClassification.groupAndLevel,
      ],
      ...details.lateralMovementOptions.map((option): [string, string] => [
        "Lateral movement options",
        option,
      ]),
      ["Nomination rationale", details.rationale],
      ...details.skills.map((skill): [string, string] => [
        "Top 3 key leadership competencies",
        skill.name.en ?? "",
      ]),
      ["Additional comments", details.additionalComments],
    ];
    if (details.nineBox) {
      fields.push(
        ["Nominee's performance assessment", details.nineBox.performance],
        ["Nominee's leadership potential", details.nineBox.leadershipPotential],
      );
    }
    if (details.developmentProgram) {
      fields.push([
        "Recommended development opportunities",
        details.developmentProgram,
      ]);
    }
    await this.expectFields(this.page, fields);
  }

  async submitTalentNomination() {
    await this.locators[FIELD.SUBMIT_NOMINATION].click();
    await this.waitForGraphqlResponse("NominateTalentSubmit");
    await this.waitForGraphqlResponse("NominateTalent");
    await expect(
      this.locators[FIELD.NOMINATION_RECEIVED_HEADING],
    ).toBeVisible();
  }

  async viewSubmittedTalentNomination(nomineeName: string) {
    await this.locators[FIELD.RETURN_TO_DASHBOARD].click();
    await this.locators[FIELD.TALENT_NOMINATIONS_BUTTON].click();
    await this.page
      .getByRole("button", { name: `${nomineeName} talent nomination` })
      .click();
    await expect(this.locators[FIELD.REVIEW_NOMINATION_HEADING]).toBeVisible();
  }

  async evaluateNomineeNotSupported() {
    await this.locators[FIELD.OPEN_EVALUATION].click();
    await this.waitForGraphqlResponse(
      "NominationGroupEvaluationDialogFormOptions",
    );

    await this.locators[FIELD.ADVANCEMENT_NOT_SUPPORTED].click();
    await this.locators[FIELD.NOT_SUPPORTED_REASON]
      .first()
      .fill("Additional details");

    await this.locators[FIELD.LATERAL_MOVEMENT_NOT_SUPPORTED].click();
    await this.locators[FIELD.NOT_SUPPORTED_REASON]
      .nth(1)
      .fill("Additional details");

    await this.locators[FIELD.DEVELOPMENT_PROGRAMS_NOT_SUPPORTED].click();
    await this.locators[FIELD.NOT_SUPPORTED_REASON]
      .nth(2)
      .fill("Additional details");

    await this.locators[FIELD.SUBMIT_EVALUATION].click();
  }

  async evaluateNomineePartiallySupported() {
    await this.locators[FIELD.OPEN_EVALUATION].click();
    await this.waitForGraphqlResponse(
      "NominationGroupEvaluationDialogFormOptions",
    );

    await this.locators[FIELD.ADVANCEMENT_NOT_SUPPORTED].click();
    await this.locators[FIELD.NOT_SUPPORTED_REASON]
      .first()
      .fill("Additional details");

    await this.locators[FIELD.LATERAL_MOVEMENT_APPROVED].click();

    const lateralClassificationsCombobox =
      this.locators[FIELD.REFERRAL_EQUIVALENCIES];
    await lateralClassificationsCombobox.click();
    await lateralClassificationsCombobox.press("ArrowDown");
    await lateralClassificationsCombobox.press("Enter");
    await this.page.keyboard.press("Tab");

    const lateralReferralExpiryDate = this.locators[FIELD.REFERRAL_EXPIRY_DATE];
    await lateralReferralExpiryDate
      .getByRole("spinbutton", { name: /year/i })
      .fill("2099");
    await lateralReferralExpiryDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("12");
    await lateralReferralExpiryDate
      .getByRole("spinbutton", { name: /day/i })
      .fill("31");

    await this.locators[FIELD.DEVELOPMENT_PROGRAMS_APPROVED].click();

    await this.locators[FIELD.SUBMIT_EVALUATION].click();
  }

  async evaluateNomineeApproved() {
    await this.locators[FIELD.OPEN_EVALUATION].click();
    await this.waitForGraphqlResponse(
      "NominationGroupEvaluationDialogFormOptions",
    );

    await this.locators[FIELD.ADVANCEMENT_APPROVED].click();

    await this.locators[FIELD.ELIGIBILITY_CONFIRMED].click();

    await this.locators[FIELD.ADVANCEMENT_CLASSIFICATIONS].click();
    await this.locators[FIELD.OPTION].first().click();
    await this.page.keyboard.press("Tab");

    const advancementReferralExpiryDate =
      this.locators[FIELD.REFERRAL_EXPIRY_DATE].first();
    await advancementReferralExpiryDate
      .getByRole("spinbutton", { name: /year/i })
      .fill("2099");
    await advancementReferralExpiryDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("12");
    await advancementReferralExpiryDate
      .getByRole("spinbutton", { name: /day/i })
      .fill("31");

    await this.locators[FIELD.LATERAL_MOVEMENT_APPROVED].click();

    const lateralClassificationsCombobox =
      this.locators[FIELD.REFERRAL_EQUIVALENCIES];
    await lateralClassificationsCombobox.click();
    await lateralClassificationsCombobox.press("ArrowDown");
    await lateralClassificationsCombobox.press("Enter");
    await this.page.keyboard.press("Tab");

    const lateralReferralExpiryDate =
      this.locators[FIELD.REFERRAL_EXPIRY_DATE].last();
    await lateralReferralExpiryDate
      .getByRole("spinbutton", { name: /year/i })
      .fill("2099");
    await lateralReferralExpiryDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("12");
    await lateralReferralExpiryDate
      .getByRole("spinbutton", { name: /day/i })
      .fill("31");

    await this.locators[FIELD.DEVELOPMENT_PROGRAMS_APPROVED].click();

    await this.locators[FIELD.SUBMIT_EVALUATION].click();
  }

  async verifyErrorMessageOnSubmitTalentNomination() {
    await expect(this.locators.alertMessage.first()).toContainText(
      /you must be a verified employee to perform this action/i,
    );

    await expect(this.locators.alertMessage.last()).toContainText(
      /sorry, we encountered an error/i,
    );
  }

  /** Opens the event's "Copy nomination link" URL, which creates a draft nomination */
  /** Creates a nomination from the event's nomination link and returns its id */
  async startTalentNominationFromLink(eventId: string) {
    await Promise.all([
      this.waitForGraphqlResponse("CreateTalentNomination"),
      this.page.goto(
        `/en/communities/talent-events/${eventId}/create-talent-nomination`,
      ),
    ]);
    // Lands on the new nomination: /communities/talent-nominations/<id>
    await this.page.waitForURL(/talent-nominations\/[0-9a-f-]{36}/);
    return new URL(this.page.url()).pathname.split("/").pop() ?? "";
  }

  /** Creates a talent event from the talent management table and returns its id */
  async createTalentEvent(event: {
    name: string;
    communityId: string;
    openDate: string;
    closeDate: string;
  }) {
    await this.locators[FIELD.CREATE_TALENT_EVENT_LINK].click();
    await this.locators[FIELD.FUNCTIONAL_COMMUNITY].selectOption(
      event.communityId,
    );
    await this.locators[FIELD.EVENT_NAME_EN].fill(event.name);
    await this.locators[FIELD.EVENT_NAME_FR].fill(event.name);
    await this.locators[FIELD.EVENT_DESCRIPTION_EN].fill(
      "Playwright talent event description",
    );
    await this.locators[FIELD.EVENT_DESCRIPTION_FR].fill(
      "Playwright talent event description",
    );
    await this.locators[FIELD.EVENT_CONTACT_EMAIL].fill("example@example.org");
    await this.fillDate(
      this.locators[FIELD.NOMINATION_START_DATE],
      event.openDate,
    );
    await this.fillDate(
      this.locators[FIELD.NOMINATION_CLOSE_DATE],
      event.closeDate,
    );
    await this.locators[FIELD.INCLUDE_NINE_BOX].click();
    await this.locators[FIELD.CREATE_TALENT_EVENT].click();
    // Lands on the new event's page: /admin/talent-events/<id>
    await this.page.waitForURL(/talent-events\/[0-9a-f-]{36}$/);
    await expect(this.locators[FIELD.ALERT_MESSAGE].last()).toContainText(
      /created successfully/i,
    );
    return this.page.url().split("/").pop() ?? "";
  }

  async updateTalentEventStartDate(openDate: string) {
    await this.locators[FIELD.EDIT_TALENT_EVENT_LINK].click();
    await this.fillDate(this.locators[FIELD.NOMINATION_START_DATE], openDate);
    await this.locators[FIELD.SAVE_CHANGES].click();
    await expect(this.locators[FIELD.ALERT_MESSAGE].last()).toContainText(
      /updated successfully/i,
    );
  }

  /** The status chip on a talent event's page, e.g. "Past" */
  talentEventStatus(status: string) {
    return this.page.getByText(status, { exact: true });
  }

  /** Fills a date input group from a yyyy-MM-dd date */
  private async fillDate(dateGroup: Locator, date: string) {
    const [year, month, day] = date.split("-");
    await dateGroup.getByRole("spinbutton", { name: /year/i }).fill(year);
    await dateGroup
      .getByRole("combobox", { name: /month/i })
      .selectOption(month);
    await dateGroup.getByRole("spinbutton", { name: /day/i }).fill(day);
  }

  async viewNominationHistory() {
    await this.locators[FIELD.NOMINATION_HISTORY_TAB].click();
    await this.waitForGraphqlResponse("TalentNominationGroupsByNominee");
  }

  async validateNominationHistory(entries: NominationHistoryEntry[]) {
    await this.locators[FIELD.EXPAND_ALL_NOMINATIONS].click();

    for (const { details, ...entry } of entries) {
      const nominatorName = fullName(details.nominator);
      // Event heading reads "<event name> (<number of nominations>)"
      const eventName = new RegExp(
        `^${escapeRegExp(entry.eventName)}\\s*\\(${entries.filter((e) => e.eventName === entry.eventName).length}\\)`,
      );
      const eventHeading = this.page.getByRole("heading", {
        level: 3,
        name: eventName,
      });
      const options = nominatedFor(details);
      // A chip for each option the nominee was nominated for in this event
      for (const option of nominationOptions) {
        await expect(
          eventHeading.getByText(option.label, { exact: true }),
        ).toHaveCount(options.includes(option) ? 1 : 0);
      }

      const row = this.page
        .getByRole("region", { name: eventName })
        .getByRole("listitem")
        .filter({
          has: this.page.getByRole("heading", {
            name: `Nominated for ${options.map(({ label }) => label.toLowerCase()).join(", ")} by ${nominatorName}`,
            exact: true,
          }),
        });
      await expect(row.getByText(entry.status, { exact: true })).toBeVisible();
      await expect(row).toContainText(entry.received);

      // The nomination details dialog shows what was entered when nominating
      await row
        .getByRole("button", {
          name: `View nomination details for ${nominatorName}`,
        })
        .click();
      const dialog = this.page.getByRole("dialog", {
        name: `${details.nominee.firstName}’s nomination to ${entry.eventName}`,
      });
      const fields: [string, string][] = [
        ["Date received", entry.received],
        ["Submitter's name", fullName(entry.submitter)],
        ["Submitter's work email", entry.submitter.workEmail ?? ""],
        [
          "Submitter's classification",
          entry.submitter.currentClassification?.groupAndLevel ?? "",
        ],
        [
          "Submitter's department or agency",
          entry.submitter.department?.name.en ?? "",
        ],
        [
          "Submitter’s relationship to the nominator",
          details.submitterRelationship,
        ],
        ["Nominator’s name", nominatorName],
        ["Nominator’s work email", details.nominator.workEmail ?? ""],
        [
          "Nominator's classification",
          details.nominator.currentClassification?.groupAndLevel ?? "",
        ],
        [
          "Nominator’s department or agency",
          details.nominator.department?.name.en ?? "",
        ],
        ["Reference’s name", fullName(details.reference)],
        ["Reference’s work email", details.reference.workEmail ?? ""],
        [
          "Reference's classification",
          details.reference.currentClassification?.groupAndLevel ?? "",
        ],
        [
          "Reference's department or agency",
          details.reference.department?.name.en ?? "",
        ],
        ["Nomination rationale", details.rationale],
        ...details.skills.map((skill): [string, string] => [
          "Top 3 key leadership competencies",
          skill.name.en ?? "",
        ]),
        ["Additional comments", details.additionalComments],
      ];
      if (entry.evaluated) {
        fields.push([
          "Nominee’s classification at the time of nomination",
          details.nominee.currentClassification?.groupAndLevel ?? "",
        ]);
      }
      await this.expectFields(dialog, fields);
      await dialog.getByRole("button", { name: "Okay" }).click();
    }
  }

  /** Each field shows its label followed by its value */
  private async expectFields(
    container: Page | Locator,
    fields: [string, string][],
  ) {
    for (const [label, value] of fields) {
      await expect(
        container.getByText(label, { exact: true }).locator(".."),
      ).toContainText(value);
    }
  }
}
export default TalentManagement;
