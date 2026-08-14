import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import type { Client } from "urql";
import { Provider as GraphqlProvider, CombinedError } from "urql";
import { fromValue } from "wonka";

import { Providers } from "@gc-digital-talent/vitest-helpers";
import { toast } from "@gc-digital-talent/toast";

import useCandidateFlagToggle from "./useCandidateFlagToggle";

vi.mock("@gc-digital-talent/toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

/**
 * Stub urql client returning a fixed mutation result.
 * Ref: packages/storybook-helpers/decorators/MockGraphqlDecorator.tsx
 */
const mockClient = (result: Record<string, unknown>) =>
  ({
    executeMutation: vi.fn(() => fromValue(result)),
  }) as unknown as Client;

const renderFlagToggle = (client: Client, defaultValue = false) =>
  renderHook(
    (props: { defaultValue: boolean; id: string }) =>
      useCandidateFlagToggle({
        id: props.id,
        defaultValue: props.defaultValue,
        name: "Test Candidate",
        processTitle: "Test Process",
      }),
    {
      initialProps: { defaultValue, id: "candidate-id" },
      wrapper: ({ children }: { children: ReactNode }) => (
        <Providers>
          <GraphqlProvider value={client}>{children}</GraphqlProvider>
        </Providers>
      ),
    },
  );

describe("useCandidateFlagToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("flags the candidate and confirms with a toast", async () => {
    const { result } = renderFlagToggle(
      mockClient({ data: { togglePoolCandidateFlag: true } }),
    );

    expect(result.current[0].isFlagged).toBe(false);

    await act(async () => {
      await result.current[1]();
    });

    expect(result.current[0].isFlagged).toBe(true);
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("un-flags the candidate", async () => {
    const { result } = renderFlagToggle(
      mockClient({ data: { togglePoolCandidateFlag: false } }),
      true,
    );

    await act(async () => {
      await result.current[1]();
    });

    expect(result.current[0].isFlagged).toBe(false);
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("keeps the new flag when a stale cached value is re-delivered", async () => {
    const { result, rerender } = renderFlagToggle(
      mockClient({ data: { togglePoolCandidateFlag: true } }),
    );

    await act(async () => {
      await result.current[1]();
    });

    // The document cache still holds the pre-toggle candidate.
    rerender({ defaultValue: false, id: "candidate-id" });
    expect(result.current[0].isFlagged).toBe(true);

    // ... and then the network result catches up.
    rerender({ defaultValue: true, id: "candidate-id" });
    expect(result.current[0].isFlagged).toBe(true);
  });

  it("adopts a flag set elsewhere without a toggle (#16166)", () => {
    const { result, rerender } = renderFlagToggle(
      mockClient({ data: { togglePoolCandidateFlag: true } }),
    );

    // Mounted from a stale cached document, then the refetch arrives.
    expect(result.current[0].isFlagged).toBe(false);
    rerender({ defaultValue: true, id: "candidate-id" });

    expect(result.current[0].isFlagged).toBe(true);
  });

  it("discards the local flag when rendered for a different candidate", async () => {
    const { result, rerender } = renderFlagToggle(
      mockClient({ data: { togglePoolCandidateFlag: true } }),
    );

    await act(async () => {
      await result.current[1]();
    });
    expect(result.current[0].isFlagged).toBe(true);

    // Navigating to an unflagged candidate: same server value, different candidate.
    rerender({ defaultValue: false, id: "other-candidate-id" });

    expect(result.current[0].isFlagged).toBe(false);
  });

  it("leaves the flag untouched when the mutation fails", async () => {
    const { result } = renderFlagToggle(
      mockClient({
        data: null,
        error: new CombinedError({ graphQLErrors: ["Something went wrong"] }),
      }),
    );

    await act(async () => {
      await result.current[1]();
    });

    expect(result.current[0].isFlagged).toBe(false);
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it("reports an error when the mutation returns no value", async () => {
    const { result } = renderFlagToggle(
      mockClient({ data: { togglePoolCandidateFlag: null } }),
    );

    await act(async () => {
      await result.current[1]();
    });

    expect(result.current[0].isFlagged).toBe(false);
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledTimes(1);
  });
});
