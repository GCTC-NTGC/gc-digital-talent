/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import {
  fakeUsers,
  fakePools,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { Pool, PoolLanguage, User } from "@gc-digital-talent/graphql";

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
  language: toLocalizedEnum(PoolLanguage.English),
};
const bilingualIntermediatePool: Pool = {
  ...fakePool,
  language: toLocalizedEnum(PoolLanguage.BilingualIntermediate),
};
const bilingualAdvancedPool: Pool = {
  ...fakePool,
  language: toLocalizedEnum(PoolLanguage.BilingualAdvanced),
};

const errorMessage = /there is a missing language requirement/i;

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
    renderMissingLanguageRequirements({
      user: unilingualApplicant,
      pool: bilingualIntermediatePool,
    });

    expect(
      screen.getByRole("heading", { name: errorMessage }),
    ).toBeInTheDocument();
  });

  it("should show error message if a unilingual applicant applies to a bilingual advanced pool", () => {
    renderMissingLanguageRequirements({
      user: unilingualApplicant,
      pool: bilingualAdvancedPool,
    });

    expect(
      screen.getByRole("heading", { name: errorMessage }),
    ).toBeInTheDocument();
  });

  it("should show nothing if a unilingual applicant applies to a unilingual pool", () => {
    renderMissingLanguageRequirements({
      user: unilingualApplicant,
      pool: unilingualPool,
    });

    expect(
      screen.queryByRole("heading", { name: errorMessage }),
    ).not.toBeInTheDocument();
  });

  it("should show nothing if a bilingual applicant applies to a bilingual pool", () => {
    renderMissingLanguageRequirements({
      user: bilingualApplicant,
      pool: bilingualAdvancedPool,
    });

    const headings = screen.queryByRole("heading");
    expect(headings).toBeNull();
  });

  it("should show nothing if a bilingual applicant applies to a unilingual pool", () => {
    renderMissingLanguageRequirements({
      user: bilingualApplicant,
      pool: unilingualPool,
    });

    expect(
      screen.queryByRole("heading", { name: errorMessage }),
    ).not.toBeInTheDocument();
  });
});
