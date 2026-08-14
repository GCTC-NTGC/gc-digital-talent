import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import type { Client } from "urql";
import { Provider as GraphqlProvider, CombinedError } from "urql";
import { fromValue } from "wonka";

import { Providers } from "@gc-digital-talent/vitest-helpers";
import { toast } from "@gc-digital-talent/toast";

import useCandidateBookmarkToggle from "./useCandidateBookmarkToggle";

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

const renderBookmarkToggle = (client: Client, defaultValue = false) =>
  renderHook(
    (props: { defaultValue: boolean; id: string }) =>
      useCandidateBookmarkToggle({
        id: props.id,
        defaultValue: props.defaultValue,
        name: "Test Candidate",
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

describe("useCandidateBookmarkToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("bookmarks the candidate and confirms with a toast", async () => {
    const { result } = renderBookmarkToggle(
      mockClient({ data: { togglePoolCandidateUserBookmark: true } }),
    );

    expect(result.current[0].isBookmarked).toBe(false);

    await act(async () => {
      await result.current[1]();
    });

    expect(result.current[0].isBookmarked).toBe(true);
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("removes the bookmark", async () => {
    const { result } = renderBookmarkToggle(
      mockClient({ data: { togglePoolCandidateUserBookmark: false } }),
      true,
    );

    await act(async () => {
      await result.current[1]();
    });

    expect(result.current[0].isBookmarked).toBe(false);
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("keeps the new bookmark when a stale cached value is re-delivered", async () => {
    const { result, rerender } = renderBookmarkToggle(
      mockClient({ data: { togglePoolCandidateUserBookmark: true } }),
    );

    await act(async () => {
      await result.current[1]();
    });

    // The document cache still holds the pre-toggle bookmark list.
    rerender({ defaultValue: false, id: "candidate-id" });
    expect(result.current[0].isBookmarked).toBe(true);

    // ... and then the network result catches up.
    rerender({ defaultValue: true, id: "candidate-id" });
    expect(result.current[0].isBookmarked).toBe(true);
  });

  it("adopts a bookmark set elsewhere without a toggle (#16166)", () => {
    const { result, rerender } = renderBookmarkToggle(
      mockClient({ data: { togglePoolCandidateUserBookmark: true } }),
    );

    // Mounted from a stale cached document, then the refetch arrives.
    expect(result.current[0].isBookmarked).toBe(false);
    rerender({ defaultValue: true, id: "candidate-id" });

    expect(result.current[0].isBookmarked).toBe(true);
  });

  it("discards the local bookmark when rendered for a different candidate", async () => {
    const { result, rerender } = renderBookmarkToggle(
      mockClient({ data: { togglePoolCandidateUserBookmark: true } }),
    );

    await act(async () => {
      await result.current[1]();
    });
    expect(result.current[0].isBookmarked).toBe(true);

    // Navigating to an unbookmarked candidate: same server value, different candidate.
    rerender({ defaultValue: false, id: "other-candidate-id" });

    expect(result.current[0].isBookmarked).toBe(false);
  });

  it("leaves the bookmark untouched when the mutation fails", async () => {
    const { result } = renderBookmarkToggle(
      mockClient({
        data: null,
        error: new CombinedError({ graphQLErrors: ["Something went wrong"] }),
      }),
    );

    await act(async () => {
      await result.current[1]();
    });

    expect(result.current[0].isBookmarked).toBe(false);
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it("reports an error when the mutation returns no value", async () => {
    const { result } = renderBookmarkToggle(
      mockClient({ data: { togglePoolCandidateUserBookmark: null } }),
    );

    await act(async () => {
      await result.current[1]();
    });

    expect(result.current[0].isBookmarked).toBe(false);
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledTimes(1);
  });
});
