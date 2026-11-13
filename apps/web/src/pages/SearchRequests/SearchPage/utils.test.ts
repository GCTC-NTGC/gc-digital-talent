import type { ApplicantFilterInput } from "@gc-digital-talent/graphql";
import {
  FlexibleWorkLocation,
  LanguageAbility,
  OperationalRequirement,
  PositionDuration,
  TalentRequestSource,
  WorkRegion,
} from "@gc-digital-talent/graphql";

import { hasSearchFilters } from "./utils";

const allTalentSources = [
  TalentRequestSource.QualifiedInPool,
  TalentRequestSource.Advancement,
  TalentRequestSource.LateralMovement,
];

// Shape of the filter produced by an untouched form
const blankFormFilter: ApplicantFilterInput = {
  qualifiedInClassifications: [],
  skills: [],
  operationalRequirements: [],
  hasDiploma: false,
  positionDuration: undefined,
  locationPreferences: [],
  flexibleWorkLocations: [],
  qualifiedInWorkStreams: undefined,
  talentSources: allTalentSources,
};

describe("hasSearchFilters", () => {
  it("should be false for a missing or empty filter", () => {
    expect(hasSearchFilters(undefined)).toBe(false);
    expect(hasSearchFilters({})).toBe(false);
  });

  it("should be false for an untouched form", () => {
    expect(hasSearchFilters(blankFormFilter)).toBe(false);
  });

  it("should be false when no talent sources are selected", () => {
    expect(hasSearchFilters({ ...blankFormFilter, talentSources: [] })).toBe(
      false,
    );
  });

  it("should be true when only some talent sources are selected", () => {
    expect(
      hasSearchFilters({
        ...blankFormFilter,
        talentSources: [TalentRequestSource.Advancement],
      }),
    ).toBe(true);
    expect(
      hasSearchFilters({
        ...blankFormFilter,
        talentSources: [
          TalentRequestSource.QualifiedInPool,
          TalentRequestSource.LateralMovement,
        ],
      }),
    ).toBe(true);
  });

  it("should ignore hasDiploma since it is not sent with the query", () => {
    expect(hasSearchFilters({ ...blankFormFilter, hasDiploma: true })).toBe(
      false,
    );
  });

  it("should ignore equity when no group is selected", () => {
    expect(
      hasSearchFilters({
        ...blankFormFilter,
        equity: { hasDisability: false, isWoman: false },
      }),
    ).toBe(false);
  });

  it.each<[string, ApplicantFilterInput]>([
    [
      "classification",
      { qualifiedInClassifications: [{ group: "IT", level: 1 }] },
    ],
    ["work stream", { qualifiedInWorkStreams: [{ id: "stream-id" }] }],
    ["skills", { skills: [{ id: "skill-id" }] }],
    ["language ability", { languageAbility: LanguageAbility.English }],
    ["equity", { equity: { isIndigenous: true } }],
    ["position duration", { positionDuration: [PositionDuration.Permanent] }],
    ["location preferences", { locationPreferences: [WorkRegion.Ontario] }],
    [
      "flexible work locations",
      { flexibleWorkLocations: [FlexibleWorkLocation.Remote] },
    ],
    [
      "operational requirements",
      { operationalRequirements: [OperationalRequirement.OvertimeOccasional] },
    ],
  ])("should be true when %s is set", (_, filter) => {
    expect(hasSearchFilters({ ...blankFormFilter, ...filter })).toBe(true);
  });
});
