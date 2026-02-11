import {
  ApplicantFilter,
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
} from "@gc-digital-talent/graphql";

import { transformFormValuesToFilterState } from "./helpers";
import { FormValues } from "./types";

const defaultFormValues: FormValues = {
  publishingGroups: [],
  classifications: [],
  stream: [],
  departments: [],
  workRegion: [],
  flexibleWorkLocations: [],
  operationalRequirement: [],
  equity: [],
  pools: [],
  skills: [],
  priorityWeight: [],
  expiryStatus: CandidateExpiryFilter.Active,
  suspendedStatus: CandidateSuspendedFilter.Active,
  govEmployee: "",
  community: "",
  assessmentSteps: [],
  statuses: [],
  placementTypes: [],
  removalReasons: [],
  screeningStages: [],
};

describe("Transform form values to filter state", () => {
  test("Single equity item", () => {
    const hasDisabilityFilters = transformFormValuesToFilterState({
      ...defaultFormValues,
      equity: ["hasDisability"],
    });

    expect(hasDisabilityFilters).toEqual(
      expect.objectContaining<{ applicantFilter: Partial<ApplicantFilter> }>({
        applicantFilter: expect.objectContaining({
          equity: { hasDisability: true },
        }) as Partial<ApplicantFilter>,
      }),
    );

    const isWomanFilters = transformFormValuesToFilterState({
      ...defaultFormValues,
      equity: ["isWoman"],
    });

    expect(isWomanFilters).toEqual(
      expect.objectContaining({
        applicantFilter: expect.objectContaining({
          equity: { isWoman: true },
        }) as Partial<ApplicantFilter>,
      }),
    );

    const isVisibleMinorityFilters = transformFormValuesToFilterState({
      ...defaultFormValues,
      equity: ["isVisibleMinority"],
    });

    expect(isVisibleMinorityFilters).toEqual(
      expect.objectContaining({
        applicantFilter: expect.objectContaining({
          equity: { isVisibleMinority: true },
        }) as Partial<ApplicantFilter>,
      }),
    );

    const isIndigenousFilters = transformFormValuesToFilterState({
      ...defaultFormValues,
      equity: ["isIndigenous"],
    });

    expect(isIndigenousFilters).toEqual(
      expect.objectContaining({
        applicantFilter: expect.objectContaining({
          equity: { isIndigenous: true },
        }) as Partial<ApplicantFilter>,
      }),
    );
  });

  test("Multiple equity filters", () => {
    const multipleEquityFilters = transformFormValuesToFilterState({
      ...defaultFormValues,
      equity: ["hasDisability", "isIndigenous"],
    });

    expect(multipleEquityFilters).toEqual(
      expect.objectContaining({
        applicantFilter: expect.objectContaining({
          equity: { hasDisability: true, isIndigenous: true },
        }) as Partial<ApplicantFilter>,
      }),
    );

    const allEquityFilters = transformFormValuesToFilterState({
      ...defaultFormValues,
      equity: ["hasDisability", "isIndigenous", "isWoman", "isVisibleMinority"],
    });

    expect(allEquityFilters).toEqual(
      expect.objectContaining({
        applicantFilter: expect.objectContaining({
          equity: {
            hasDisability: true,
            isIndigenous: true,
            isWoman: true,
            isVisibleMinority: true,
          },
        }) as Partial<ApplicantFilter>,
      }),
    );
  });
});
