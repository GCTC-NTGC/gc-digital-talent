import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { vi } from "vitest";

import { renderWithProviders } from "@gc-digital-talent/vitest-helpers";
import type { SearchResultCard_PoolFragment } from "@gc-digital-talent/graphql";

import type { FormValues } from "~/types/talentRequestForm";

import CommunityResultCard from "./CommunityResultCard";
import SearchResultCard from "./SearchResultCard";

const community = { id: "privacy-community", name: { localized: "Privacy" } };

const pool: SearchResultCard_PoolFragment = {
  id: "privacy-pool",
  name: { en: "Privacy analyst", fr: "Analyste de la confidentialité" },
  community,
  poolSkills: [],
};

const onSubmit = vi.fn<(values: FormValues) => void>();

const Harness = ({ children }: { children: ReactNode }) => {
  const methods = useForm<FormValues>();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
        <button type="submit">Submit from elsewhere</button>
      </form>
    </FormProvider>
  );
};

const submitFromElsewhere = async () => {
  await userEvent.click(
    screen.getByRole("button", { name: "Submit from elsewhere" }),
  );

  return onSubmit.mock.calls[0][0];
};

describe("result cards", () => {
  beforeEach(() => {
    onSubmit.mockReset();
  });

  it("sets communityId when the community result card is submitted", async () => {
    renderWithProviders(
      <Harness>
        <CommunityResultCard
          community={community}
          qualifiedInPoolCount={5}
          atLevelCount={0}
          count={5}
          showQualifiedInPool
          showAtLevel={false}
        />
      </Harness>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /request all matching candidates/i }),
    );

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ communityId: community.id }),
    );
  });

  it("leaves communityId unset while a community result card is rendered", async () => {
    renderWithProviders(
      <Harness>
        <CommunityResultCard
          community={community}
          qualifiedInPoolCount={5}
          atLevelCount={0}
          count={5}
          showQualifiedInPool
          showAtLevel={false}
        />
      </Harness>,
    );

    expect((await submitFromElsewhere()).communityId).toBeFalsy();
  });

  it("sets pool when the process result card is submitted", async () => {
    renderWithProviders(
      <Harness>
        <SearchResultCard candidateCount={5} pool={pool} />
      </Harness>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /request candidates/i }),
    );

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ pool: pool.id }),
    );
  });

  it("leaves pool unset while a process result card is rendered", async () => {
    renderWithProviders(
      <Harness>
        <SearchResultCard candidateCount={5} pool={pool} />
      </Harness>,
    );

    expect((await submitFromElsewhere()).pool).toBeFalsy();
  });
});
