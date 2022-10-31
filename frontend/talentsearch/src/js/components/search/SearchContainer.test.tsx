/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import React from "react";
import { fakeClassifications, fakePools } from "@common/fakeData";
import { axeTest, render } from "@common/helpers/testUtils";
import { SearchContainer } from "./SearchContainer";
import type { SearchContainerProps } from "./SearchContainer";

const mockClassifications = fakeClassifications();

type MockSearchContainerProps = Pick<
  SearchContainerProps,
  "poolCandidateResults"
>;

const renderSearchContainer = ({
  poolCandidateResults,
}: MockSearchContainerProps) => {
  const mockUpdate = jest.fn();
  const mockSubmit = jest.fn();
  return render(
    <SearchContainer
      poolCandidateResults={poolCandidateResults}
      classifications={mockClassifications}
      onUpdateApplicantFilter={mockUpdate}
      onSubmit={mockSubmit}
    />,
  );
};

const poolCandidateResults = [
  {
    candidateCount: 4,
    pool: fakePools()[0],
  },
  {
    candidateCount: 6,
    pool: fakePools()[1],
  },
];

describe("SearchContainer", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderSearchContainer({ poolCandidateResults });

    await axeTest(container);
  });

  it("should render request button with candidates", async () => {
    renderSearchContainer({ poolCandidateResults });
    const buttons = screen.getAllByRole("button", {
      name: /request candidates/i,
    });
    buttons.forEach((button) => {
      expect(button).toBeInTheDocument();
    });
  });

  it("should not render request button with no candidates", async () => {
    renderSearchContainer({ poolCandidateResults: [] });
    await expect(
      screen.queryByRole("button", { name: /request candidates/i }),
    ).not.toBeInTheDocument();
  });

  it("should render number of candidates", async () => {
    renderSearchContainer({ poolCandidateResults });

    const candidateCounts = await screen.queryAllByTestId("candidateCount");
    expect(candidateCounts.length).toEqual(4);
  });

  it("should render proper value for candidates", async () => {
    renderSearchContainer({ poolCandidateResults });

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
