/**
 * @jest-environment jsdom
 */

import React from "react";
import { axeTest, render } from "../../helpers/testUtils";
import { fakeUsers, fakePoolAdvertisements } from "../../fakeData";

import MissingLanguageRequirements, {
  type MissingLanguageRequirementsProps,
} from "./MissingLanguageRequirements";
import {
  Applicant,
  PoolAdvertisement,
  PoolAdvertisementLanguage,
} from "../../api/generated";

const fakeApplicant = fakeUsers(1)[0] as Applicant;
const unilingualApplicant: Applicant = {
  ...fakeApplicant,
  lookingForEnglish: true,
  lookingForFrench: false,
  lookingForBilingual: false,
};
const bilingualApplicant: Applicant = {
  ...fakeApplicant,
  lookingForEnglish: true,
  lookingForFrench: true,
  lookingForBilingual: true,
};

const fakePoolAdvertisement = fakePoolAdvertisements(1)[0];
const unilingualPoolAdvertisement: PoolAdvertisement = {
  ...fakePoolAdvertisement,
  advertisementLanguage: PoolAdvertisementLanguage.English,
};
const bilingualIntermediatePoolAdvertisement: PoolAdvertisement = {
  ...fakePoolAdvertisement,
  advertisementLanguage: PoolAdvertisementLanguage.BilingualIntermediate,
};
const bilingualAdvancedPoolAdvertisement: PoolAdvertisement = {
  ...fakePoolAdvertisement,
  advertisementLanguage: PoolAdvertisementLanguage.BilingualAdvanced,
};

const errorMessage = "There is a missing language requirement";

// This should always make the component visible
const defaultProps: MissingLanguageRequirementsProps = {
  applicant: unilingualApplicant,
  poolAdvertisement: bilingualAdvancedPoolAdvertisement,
};

const renderMissingLanguageRequirements = (
  overrideProps?: MissingLanguageRequirementsProps,
) => {
  const props = {
    ...defaultProps,
    ...overrideProps,
  };
  return render(<MissingLanguageRequirements {...props} />);
};

describe("MissingLanguageRequirements", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderMissingLanguageRequirements();

    await axeTest(container);
  });

  it("should show error message if a unilingual applicant applies to a bilingual intermediate pool", () => {
    const element = renderMissingLanguageRequirements({
      applicant: unilingualApplicant,
      poolAdvertisement: bilingualIntermediatePoolAdvertisement,
    });

    const heading = element.getByRole("heading");
    expect(heading.textContent).toMatch(errorMessage);
  });

  it("should show error message if a unilingual applicant applies to a bilingual advanced pool", () => {
    const element = renderMissingLanguageRequirements({
      applicant: unilingualApplicant,
      poolAdvertisement: bilingualAdvancedPoolAdvertisement,
    });

    const heading = element.getByRole("heading");
    expect(heading.textContent).toMatch(errorMessage);
  });

  it("should show nothing if a unilingual applicant applies to a unilingual pool", () => {
    const element = renderMissingLanguageRequirements({
      applicant: unilingualApplicant,
      poolAdvertisement: unilingualPoolAdvertisement,
    });

    const headings = element.queryByRole("heading");
    expect(headings).toBeNull();
  });

  it("should show nothing if a bilingual applicant applies to a bilingual pool", () => {
    const element = renderMissingLanguageRequirements({
      applicant: bilingualApplicant,
      poolAdvertisement: bilingualAdvancedPoolAdvertisement,
    });

    const headings = element.queryByRole("heading");
    expect(headings).toBeNull();
  });

  it("should show nothing if a bilingual applicant applies to a unilingual pool", () => {
    const element = renderMissingLanguageRequirements({
      applicant: bilingualApplicant,
      poolAdvertisement: unilingualPoolAdvertisement,
    });

    const headings = element.queryByRole("heading");
    expect(headings).toBeNull();
  });
});
