/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import React from "react";
import {
  fakeClassifications,
  fakePools,
  fakeSkills,
} from "@gc-digital-talent/fake-data";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { SearchContainerComponent } from "./SearchContainer";
import type { SearchContainerProps } from "./SearchContainer";

const mockClassifications = fakeClassifications();
const mockSkills = fakeSkills();
const fakedPools = fakePools(2, mockSkills, mockClassifications);

type MockSearchContainerProps = Pick<
  SearchContainerProps,
  "poolCandidateResults" | "totalCandidateCount"
>;

const renderSearchContainer = ({
  poolCandidateResults,
  totalCandidateCount,
}: MockSearchContainerProps) => {
  const mockUpdate = jest.fn();
  const mockSubmit = jest.fn();
  return renderWithProviders(
    <SearchContainerComponent
      updatePending={false}
      pools={[]}
      totalCandidateCount={totalCandidateCount}
      poolCandidateResults={poolCandidateResults}
      classifications={mockClassifications}
      onUpdateApplicantFilter={mockUpdate}
      skills={mockSkills}
      onSubmit={mockSubmit}
    />,
  );
};

const poolCandidateResults = [
  {
    candidateCount: 4,
    pool: fakedPools[0],
  },
  {
    candidateCount: 6,
    pool: fakedPools[1],
  },
];

const totalCandidateCount = 10;

describe("SearchContainer", () => {
  jest.setTimeout(30000); // TODO: remove in #4755
  it("should have no accessibility errors", async () => {
    const { container } = renderSearchContainer({
      poolCandidateResults,
      totalCandidateCount,
    });

    await axeTest(container);
  });

  it("should render request button with candidates", async () => {
    renderSearchContainer({ poolCandidateResults, totalCandidateCount });
    const buttons = screen.getAllByRole("button", {
      name: /request candidates/i,
    });
    buttons.forEach((button) => {
      expect(button).toBeInTheDocument();
    });
  });

  it("should render different results container no candidates", async () => {
    renderSearchContainer({ poolCandidateResults: [], totalCandidateCount });
    await expect(
      screen.queryByRole("heading", { name: /we can still help/i }),
    ).toBeInTheDocument();
  });

  it("should render number of candidates", async () => {
    renderSearchContainer({ poolCandidateResults, totalCandidateCount });

    const candidateCounts = await screen.queryAllByTestId("candidateCount");
    expect(candidateCounts.length).toEqual(4);
  });

  it("should render proper value for candidates", async () => {
    renderSearchContainer({ poolCandidateResults, totalCandidateCount });

    const candidateCounts = await screen.queryAllByTestId("candidateCount");

    const testCandidateCountText = (text: string | null, pattern: RegExp) => {
      expect(text).toBeTruthy();
      if (text) {
        expect(pattern.test(text)).toBeTruthy();
      }
    };

    testCandidateCountText(candidateCounts[0].textContent, /10/i);
    testCandidateCountText(candidateCounts[1].textContent, /10/i);
    testCandidateCountText(candidateCounts[2].textContent, /4/i);
    testCandidateCountText(candidateCounts[3].textContent, /6/i);
  });
});
