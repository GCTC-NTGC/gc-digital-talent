/**
 * @jest-environment jsdom
 */
import {
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
} from "@gc-digital-talent/graphql";

import { transformFormValuesToFilterState } from "./helpers";
import { FormValues } from "./types";

const defaultFormValues: FormValues = {
  publishingGroups: [],
  classifications: [],
  stream: [],
  languageAbility: "",
  workRegion: [],
  operationalRequirement: [],
  equity: [],
  pools: [],
  skills: [],
  priorityWeight: [],
  poolCandidateStatus: [],
  expiryStatus: CandidateExpiryFilter.Active,
  suspendedStatus: CandidateSuspendedFilter.Active,
  govEmployee: "",
  community: "",
};

describe("Transform form values to filter state", () => {
  test("Single equity item", () => {
    const hasDisabilityFilters = transformFormValuesToFilterState({
      ...defaultFormValues,
      equity: ["hasDisability"],
    });

    expect(hasDisabilityFilters).toEqual(
      expect.objectContaining({
        applicantFilter: expect.objectContaining({
          equity: { hasDisability: true },
        }),
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
        }),
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
        }),
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
        }),
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
        }),
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
        }),
      }),
    );
  });
});
