/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/react";
import React from "react";
import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";
import { faker } from "@faker-js/faker/locale/en";

import { renderWithProviders } from "@gc-digital-talent/jest-helpers";
import {
  fakeApplicantFilters,
  fakePoolCandidates,
  fakePools,
  fakeSkills,
} from "@gc-digital-talent/fake-data";

import SingleSearchRequestTableApi from "./SearchRequestCandidatesTable";

faker.seed(0);

const mockApplicantFilters = fakeApplicantFilters();
const mockPoolCandidates = fakePoolCandidates();
const mockSkills = fakeSkills();
const mockPools = fakePools(1);

const mockPoolCandidatesWithSkillCount = mockPoolCandidates.map(
  (poolCandidate) => {
    const skillCount = faker.number.int({
      min: 0,
      max: 10,
    });
    return {
      id: poolCandidate.id,
      poolCandidate,
      skillCount: skillCount || null,
    };
  },
);

const mockPaginatorInfo = {
  count: 20,
  currentPage: 1,
  firstItem: 1,
  hasMorePages: false,
  lastItem: 20,
  lastPage: 1,
  perPage: 20,
  total: 20,
};

const mockClient = {
  executeQuery: () =>
    fromValue({
      data: {
        poolCandidatesPaginated: {
          data: [mockPoolCandidatesWithSkillCount[0]],
          paginatorInfo: mockPaginatorInfo,
        },
        skills: mockSkills,
        poolsPaginated: {
          data: [mockPools[0]],
          paginatorInfo: mockPaginatorInfo,
        },
      },
    }),
  // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const render = () => {
  return renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <SingleSearchRequestTableApi filter={mockApplicantFilters[0]} />,
    </GraphqlProvider>,
  );
};

describe("Search Request Candidates Table", () => {
  const user = userEvent.setup();

  it("should have default status filters", async () => {
    render();

    await user.click(screen.getByRole("button", { name: /filters/i }));

    const filters = screen.getByRole("dialog", { name: /filters/i });

    // Checking for 2 of each due to option and chip in combobox
    expect(await within(filters).findAllByText(/placed casual/i)).toHaveLength(
      2,
    );
    expect(
      await within(filters).findAllByText(/qualified available/i),
    ).toHaveLength(2);

    expect(
      await within(filters).findAllByText(/offer in progress/i),
    ).toHaveLength(2);
  });
});
