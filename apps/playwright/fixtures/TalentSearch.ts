import type { Locator, Page } from "playwright/test";
import { expect } from "playwright/test";

import type {
  Classification,
  EquitySelectionsInput,
  Skill,
  WorkRegion,
  WorkStream,
} from "@gc-digital-talent/graphql";
import {
  FlexibleWorkLocation,
  LanguageAbility,
  OperationalRequirement,
  PositionDuration,
  TalentRequestReason,
} from "@gc-digital-talent/graphql";

import { generateUniqueTestId } from "~/utils/id";

import AppPage from "./AppPage";
// regionsMap is identical to the applicant-facing personal-information page's
// region list -- reused from there instead of a second copy of all 7 entries.
import LocationPreferenceUpdatePage, {
  regionsMap,
} from "./locationPreferenceUpdatePage";

export { regionsMap };
export interface TalentRequestFormDetails {
  positionJobTitle: string;
  comments: string;
  reason?: TalentRequestReason;
}
export interface TalentRequestContact {
  fullName: string;
  governmentEmail: string;
  jobTitle: string;
}
export interface TalentRequestCandidateCriteria {
  skill?: Skill;
  flexibleWorkLocations: FlexibleWorkLocation[];
  onSiteLocations: WorkRegion[];
  languageAbility: LanguageAbility;
  hasDiploma: boolean;
  employmentDuration: PositionDuration;
  conditionsOfEmployment: OperationalRequirement[];
  employmentEquity: (keyof EquitySelectionsInput)[];
}
export const reasonMap = new Map<TalentRequestReason, string>([
  [TalentRequestReason.ImmediateHire, "Looking for immediate hire"],
  [TalentRequestReason.UpcomingNeed, "For upcoming need"],
  [TalentRequestReason.GeneralInterest, "General interest"],
  [
    TalentRequestReason.RequiredByDirective,
    "Required under the Directive on Digital Talent",
  ],
]);
export const optionsMap = new Map<FlexibleWorkLocation, string>([
  [FlexibleWorkLocation.Hybrid, "Hybrid work"],
  [FlexibleWorkLocation.Remote, "Remote work"],
]);
export const languageAbilityMap = new Map<LanguageAbility, string>([
  [LanguageAbility.English, "English only"],
  [LanguageAbility.French, "French only"],
  [LanguageAbility.Bilingual, "Bilingual"],
]);
export const educationRequirementMap = new Map<boolean, string>([
  [true, "Required diploma from post-secondary institution"],
  [false, "Can accept a combination of work experience and education"],
]);
export const employmentDurationMap = new Map<PositionDuration, string>([
  [PositionDuration.Temporary, "Term duration (short term or long term)"],
  [PositionDuration.Permanent, "Indeterminate duration (permanent)"],
]);
export const employmentEquityGroupMap = new Map<
  keyof EquitySelectionsInput,
  string
>([
  ["isWoman", "Woman"],
  ["isIndigenous", "Indigenous identity"],
  ["isVisibleMinority", "Visible minority"],
  ["hasDisability", "Person with a disability"],
]);
export const operationalRequirementMap = new Map<
  OperationalRequirement,
  string
>([
  [
    OperationalRequirement.ShiftWork,
    "Availability, willingness and ability to work shift-work",
  ],
  [
    OperationalRequirement.OnCall,
    "Availability, willingness and ability to work 24/7 on-call status",
  ],
  [
    OperationalRequirement.Travel,
    "Availability, willingness and ability to travel as required",
  ],
  [
    OperationalRequirement.TransportEquipment,
    "Availability, willingness and ability to transport, lift and set down equipment weighing up to 20kg",
  ],
  [
    OperationalRequirement.DriversLicense,
    "Must possess a valid driver's license or personal mobility to the degree normally associated with possession of a valid driver's license",
  ],
  [
    OperationalRequirement.OvertimeOccasional,
    "Availability, willingness and ability to work overtime (occasionally)",
  ],
  [
    OperationalRequirement.OvertimeRegular,
    "Availability, willingness and ability to work overtime (regularly)",
  ],
]);

// Short labels, as shown on the talent request "Candidate criteria" card
// (api/lang/en/operational_requirement.php), distinct from the long-form
// checkbox descriptions used on the search form above.
export const operationalRequirementShortMap = new Map<
  OperationalRequirement,
  string
>([
  [OperationalRequirement.ShiftWork, "Shift-work"],
  [OperationalRequirement.OnCall, "24/7 on-call"],
  [OperationalRequirement.Travel, "Travel as required"],
  [OperationalRequirement.TransportEquipment, "Transport equipment up to 20kg"],
  [OperationalRequirement.DriversLicense, "Driver's license"],
  [OperationalRequirement.OvertimeRegular, "Overtime (regular)"],
  [OperationalRequirement.OvertimeOccasional, "Overtime (occasional)"],
]);

class TalentSearch extends AppPage {
  readonly baseUrl: string = "/en/search";
  readonly classification?: Classification;
  readonly workStream?: WorkStream;
  readonly skill?: Skill;
  readonly optionsMap = optionsMap;
  readonly regionsMap = regionsMap;
  readonly reasonMap = reasonMap;
  readonly locationPrefUpdate = new LocationPreferenceUpdatePage(this.page);

  constructor(page: Page) {
    super(page);
  }

  async goToIndex() {
    await this.page.goto(this.baseUrl);
    await this.waitForGraphqlResponse("SearchForm");
  }

  expectNoCandidates(poolName: string) {
    const noCandidates = async (page: Page) => {
      await expect(
        page.getByRole("article", { name: new RegExp(poolName, "i") }),
      ).toBeHidden();
    };
    return noCandidates;
  }

  async poolCardVisibility(poolName: string) {
    const poolCard = this.page.getByRole("article", {
      name: new RegExp(poolName, "i"),
    });

    await expect(poolCard).toBeVisible();
    await expect(poolCard).toContainText(/\d+ approximate match(es)?/i);
    return poolCard;
  }

  async fillSearchFormAndRequestCandidates(
    poolName: string,
    classification: Classification,
    workStream: WorkStream,
    criteria: TalentRequestCandidateCriteria,
  ) {
    const poolCard = await this.poolCardVisibility(poolName);

    const selectedClassification = classification.groupAndLevel;
    const classificationFilter = this.page.getByRole("combobox", {
      name: /classification/i,
    });
    await classificationFilter.selectOption({ index: 2 });
    this.expectNoCandidates(poolName);

    await classificationFilter.selectOption({
      value: selectedClassification,
    });

    const streamFilter = this.page.getByRole("combobox", {
      name: /stream/i,
    });

    await streamFilter.selectOption({ label: "Database Management" });
    this.expectNoCandidates(poolName);

    await streamFilter.selectOption({
      label: workStream.name?.en ?? "",
    });

    await expect(poolCard).toBeVisible();

    await this.locationPrefUpdate.locPrefUpdateForTalentPage(
      this.optionsMap,
      criteria.flexibleWorkLocations,
    );
    await expect(poolCard).toBeVisible();

    await expect(
      this.page.getByRole("listitem", {
        name: /Telework/i,
      }),
    ).toBeHidden();

    await this.locationPrefUpdate.locPrefUpdateForTalentPage(
      this.regionsMap,
      criteria.onSiteLocations,
    );

    await expect(poolCard).toBeVisible();

    for (const group of criteria.employmentEquity) {
      await this.page
        .getByRole("checkbox", {
          name: employmentEquityGroupMap.get(group) ?? "",
        })
        .click();
    }

    const skillFilter = this.page.getByRole("combobox", {
      name: /^skill$/i,
    });

    await skillFilter.fill(`${criteria.skill?.name.en}`);
    await skillFilter.press("ArrowDown");
    await skillFilter.press("Enter");

    await this.page
      .getByRole("radio", {
        name: languageAbilityMap.get(criteria.languageAbility) ?? "",
      })
      .click();

    await this.page
      .getByRole("button", { name: /expand all advanced filters/i })
      .click();

    await this.page
      .getByRole("radio", {
        name: educationRequirementMap.get(criteria.hasDiploma) ?? "",
      })
      .click();

    await this.page
      .getByRole("radio", {
        name: employmentDurationMap.get(criteria.employmentDuration) ?? "",
      })
      .click();

    for (const requirement of criteria.conditionsOfEmployment) {
      await this.page
        .getByRole("checkbox", {
          name: operationalRequirementMap.get(requirement) ?? "",
        })
        .click();
    }

    await this.waitForGraphqlResponse("CountTalentRequestMatches");
    await expect(poolCard).toBeVisible();
    await poolCard.getByRole("button", { name: /request candidates/i }).click();
  }

  private async fillIfBlank(locator: Locator, generateValue: () => string) {
    const existingValue = await locator.inputValue();
    if (existingValue) {
      return existingValue;
    }

    const value = generateValue();
    await locator.fill(value);
    return value;
  }

  async submitSearchForm(
    classification: Classification,
    workStream: WorkStream,
    requestDetails: TalentRequestFormDetails,
    criteria: TalentRequestCandidateCriteria,
  ): Promise<TalentRequestContact> {
    const fullName = await this.fillIfBlank(
      this.page.getByRole("textbox", { name: /full name/i }),
      () => `Test user ${generateUniqueTestId()}`,
    );
    const governmentEmail = await this.fillIfBlank(
      this.page.getByRole("textbox", {
        name: /government of canada email/i,
      }),
      () => `${generateUniqueTestId()}@cfp-psc.gc.ca`,
    );
    await this.fillIfBlank(
      this.page.getByRole("textbox", { name: /what is your job title/i }),
      () => `Test job title ${generateUniqueTestId()}`,
    );

    await this.page
      .getByRole("textbox", {
        name: /what is the job title for this position/i,
      })
      .fill(requestDetails.positionJobTitle);

    await this.page
      .getByRole("radio", {
        name: this.reasonMap.get(
          requestDetails.reason ?? TalentRequestReason.GeneralInterest,
        ),
      })
      .click();
    await this.page
      .getByRole("textbox", { name: /additional comments/i })
      .fill(requestDetails.comments);

    const departmentInput = this.page.getByRole("combobox", {
      name: /department/i,
    });
    if (!(await departmentInput.inputValue())) {
      await departmentInput.press("ArrowDown");
      await departmentInput.press("Enter");
    }

    await expect(
      this.page.getByText(
        new RegExp(`${classification.groupAndLevel}: search pool`, "i"),
      ),
    ).toBeVisible();

    await expect(
      this.page.getByText(workStream?.name?.en ?? "", { exact: true }),
    ).toBeVisible();

    await expect(
      this.page.getByText(new RegExp(criteria.skill?.name.en ?? "")),
    ).toBeVisible();

    await this.locationPrefUpdate.validateSelectedFlexWorkLocOptions();
    await expect(
      this.page.getByText(
        educationRequirementMap.get(criteria.hasDiploma) ?? "",
      ),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        languageAbilityMap.get(criteria.languageAbility) ?? "",
      ),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        employmentDurationMap.get(criteria.employmentDuration) ?? "",
      ),
    ).toBeVisible();
    for (const requirement of criteria.conditionsOfEmployment) {
      await expect(
        this.page.getByText(operationalRequirementMap.get(requirement) ?? ""),
      ).toBeVisible();
    }
    for (const group of criteria.employmentEquity) {
      await expect(
        this.page.getByText(employmentEquityGroupMap.get(group) ?? ""),
      ).toBeVisible();
    }
    for (const region of criteria.onSiteLocations) {
      await expect(
        this.page.getByText(regionsMap.get(region) ?? ""),
      ).toBeVisible();
    }

    await expect(this.page.getByText(/1 estimated candidate/i)).toBeVisible();

    await this.page.getByRole("button", { name: /submit request/i }).click();
    await this.waitForGraphqlResponse("CreateTalentRequest");
    await expect(
      this.page.getByRole("heading", {
        name: /we have received your request/i,
        level: 2,
      }),
    ).toBeVisible();

    return {
      fullName,
      governmentEmail,
      jobTitle: requestDetails.positionJobTitle,
    };
  }
}
export default TalentSearch;
