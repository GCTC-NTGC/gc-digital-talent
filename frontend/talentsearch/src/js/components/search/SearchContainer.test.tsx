/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import React from "react";
import { fakeClassifications, fakeCmoAssets } from "@common/fakeData";

import { render } from "../../tests/testUtils";
import { SearchContainer } from "./SearchContainer";
import type { SearchContainerProps } from "./SearchContainer";

const mockClassifications = fakeClassifications();
const mockCmoAssets = fakeCmoAssets();

type MockSearchContainerProps = Pick<SearchContainerProps, "candidateCount">;

const renderSearchContainer = ({
  candidateCount,
}: MockSearchContainerProps) => {
  const mockUpdate = jest.fn();
  const mockValues = jest.fn();
  const mockSubmit = jest.fn();
  return (
    <>
      {render(
        <SearchContainer
          classifications={mockClassifications}
          cmoAssets={mockCmoAssets}
          candidateCount={candidateCount}
          updateCandidateFilter={mockUpdate}
          updateInitialValues={mockValues}
          handleSubmit={mockSubmit}
        />,
      )}
    </>
  );
};

describe("SearchContainer", () => {
  it("should render request button with candidates", async () => {
    renderSearchContainer({ candidateCount: 10 });
    await expect(
      screen.getByRole("button", { name: /request candidates/i }),
    ).toBeInTheDocument();
  });

  it("should not render request button with no candidates", async () => {
    renderSearchContainer({ candidateCount: 0 });
    await expect(
      screen.queryByRole("button", { name: /request candidates/i }),
    ).not.toBeInTheDocument();
  });

  it("should render number of candidates", async () => {
    renderSearchContainer({ candidateCount: 10 });

    const candidateCounts = await screen.queryAllByTestId("candidateCount");
    expect(candidateCounts.length).toEqual(3);
  });

  it("should render proper value for candidates", async () => {
    renderSearchContainer({ candidateCount: 10 });

    const candidateCounts = await screen.queryAllByTestId("candidateCount");
    const pattern = /10/i;

    candidateCounts.forEach((count) => {
      const text = count.textContent;
      expect(text).toBeTruthy();
      if (text) {
        expect(pattern.test(text)).toBeTruthy();
      }
    });
  });
});
