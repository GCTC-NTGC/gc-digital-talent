import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";

import { renderWithProviders } from "@gc-digital-talent/vitest-helpers";
import {
  fakeClassifications,
  fakeWorkStreams,
} from "@gc-digital-talent/fake-data";
import { WorkRegion } from "@gc-digital-talent/graphql";
import { setInSessionStorage } from "@gc-digital-talent/storage";

import { TALENT_REQUEST_STATE_KEY } from "~/constants/storageKeys";

import { SearchForm } from "./SearchForm";

const classifications = fakeClassifications();
const workStreams = fakeWorkStreams(1);
const community = { id: "privacy-community", name: { localized: "Privacy" } };

const matches = {
  countTalentRequestMatches: 5,
  countTalentRequestMatchesByPool: [],
  countTalentRequestMatchesByCommunity: [
    { community, qualifiedInPoolCount: 5, atLevelCount: 0, count: 5 },
  ],
};

const noMatches = {
  countTalentRequestMatches: 0,
  countTalentRequestMatchesByPool: [],
  countTalentRequestMatchesByCommunity: [],
};

interface Variables {
  where?: {
    applicantFilter?: {
      qualifiedInClassifications?: { level?: number }[] | null;
    } | null;
  } | null;
}

// IT-01 returns the community card, IT-04 returns the no-results card.
const mockClient = {
  executeQuery: ({ variables }: { variables?: Variables }) =>
    fromValue({
      data:
        variables?.where?.applicantFilter?.qualifiedInClassifications?.[0]
          ?.level === 4
          ? noMatches
          : matches,
    }),
};

describe("SearchForm", () => {
  beforeEach(() => {
    setInSessionStorage(TALENT_REQUEST_STATE_KEY, {
      applicantFilter: {
        qualifiedInClassifications: [{ group: "IT", level: 1 }],
        qualifiedInWorkStreams: [{ id: workStreams[0].id }],
        locationPreferences: [WorkRegion.Ontario],
      },
      candidateCount: 0,
    });
  });

  it("stores no community when the results empty out before submitting", async () => {
    renderWithProviders(
      <GraphqlProvider value={mockClient}>
        <SearchForm
          classifications={classifications}
          skills={[]}
          workStreams={workStreams}
        />
      </GraphqlProvider>,
    );

    expect(
      await screen.findByRole("article", { name: "Privacy" }),
    ).toBeInTheDocument();

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /classification/i }),
      "IT-04",
    );
    await userEvent.click(
      await screen.findByRole("button", { name: /request candidates/i }),
    );

    const stored = JSON.parse(
      window.sessionStorage.getItem(TALENT_REQUEST_STATE_KEY) ?? "null",
    ) as { applicantFilter?: { community?: { id: string } } };

    expect(stored.applicantFilter?.community).toBeUndefined();
  });
});
