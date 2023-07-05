/**
 * @jest-environment jsdom
 */

import React from "react";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import { Pool, PoolLanguage, User } from "~/api/generated";

import { fakeUsers, fakePools } from "@gc-digital-talent/fake-data";

import MissingLanguageRequirements, {
  type MissingLanguageRequirementsProps,
} from "./MissingLanguageRequirements";

const fakeApplicant = fakeUsers(1)[0];
const unilingualApplicant: User = {
  ...fakeApplicant,
  lookingForEnglish: true,
  lookingForFrench: false,
  lookingForBilingual: false,
};
const bilingualApplicant: User = {
  ...fakeApplicant,
  lookingForEnglish: true,
  lookingForFrench: true,
  lookingForBilingual: true,
};

const fakePool = fakePools(1)[0];
const unilingualPool: Pool = {
  ...fakePool,
  language: PoolLanguage.English,
};
const bilingualIntermediatePool: Pool = {
  ...fakePool,
  language: PoolLanguage.BilingualIntermediate,
};
const bilingualAdvancedPool: Pool = {
  ...fakePool,
  language: PoolLanguage.BilingualAdvanced,
};

const errorMessage = "There is a missing language requirement";

// This should always make the component visible
const defaultProps: MissingLanguageRequirementsProps = {
  user: unilingualApplicant,
  pool: bilingualAdvancedPool,
};

const renderMissingLanguageRequirements = (
  overrideProps?: MissingLanguageRequirementsProps,
) => {
  const props = {
    ...defaultProps,
    ...overrideProps,
  };
  return renderWithProviders(<MissingLanguageRequirements {...props} />);
};

describe("MissingLanguageRequirements", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderMissingLanguageRequirements();

    await axeTest(container);
  });

  it("should show error message if a unilingual applicant applies to a bilingual intermediate pool", () => {
    const element = renderMissingLanguageRequirements({
      user: unilingualApplicant,
      pool: bilingualIntermediatePool,
    });

    const heading = element.getByRole("heading");
    expect(heading.textContent).toMatch(errorMessage);
  });

  it("should show error message if a unilingual applicant applies to a bilingual advanced pool", () => {
    const element = renderMissingLanguageRequirements({
      user: unilingualApplicant,
      pool: bilingualAdvancedPool,
    });

    const heading = element.getByRole("heading");
    expect(heading.textContent).toMatch(errorMessage);
  });

  it("should show nothing if a unilingual applicant applies to a unilingual pool", () => {
    const element = renderMissingLanguageRequirements({
      user: unilingualApplicant,
      pool: unilingualPool,
    });

    const headings = element.queryByRole("heading");
    expect(headings).toBeNull();
  });

  it("should show nothing if a bilingual applicant applies to a bilingual pool", () => {
    const element = renderMissingLanguageRequirements({
      user: bilingualApplicant,
      pool: bilingualAdvancedPool,
    });

    const headings = element.queryByRole("heading");
    expect(headings).toBeNull();
  });

  it("should show nothing if a bilingual applicant applies to a unilingual pool", () => {
    const element = renderMissingLanguageRequirements({
      user: bilingualApplicant,
      pool: unilingualPool,
    });

    const headings = element.queryByRole("heading");
    expect(headings).toBeNull();
  });
});
