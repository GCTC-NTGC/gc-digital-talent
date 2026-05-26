import { describe, test, expect, vi } from "vitest";

import { NotFoundError } from "@gc-digital-talent/helpers";

import { getCommunityTeamIdInMiddleware } from "./utils";

// Mock the graphqlClientContext and intlContext
const createMockContext = (queryResult: {
  data?: { community?: { teamIdForRoleAssignment?: string | null } | null };
  error?: Error;
}) => {
  const mockQuery = vi.fn().mockReturnValue({
    toPromise: () => Promise.resolve(queryResult),
  });

  const mockClient = {
    query: mockQuery,
  };

  const mockIntl = {
    formatMessage: (
      descriptor: { defaultMessage: string },
      values?: Record<string, string>,
    ) => {
      let message = descriptor.defaultMessage;
      if (values) {
        Object.entries(values).forEach(([key, value]) => {
          message = message.replace(`{${key}}`, value);
        });
      }
      return message;
    },
    locale: "en",
  };

  const mockContext = {
    get: vi.fn((token: unknown) => {
      if (token === "graphqlClientContext") {
        return mockClient;
      }
      if (token === "intlContext") {
        return mockIntl;
      }
      // Return appropriate mock based on the token reference
      // Since we can't access the actual context symbols, we match by order
      return mockClient;
    }),
  };

  // Override get to work with the actual context tokens
  let callCount = 0;
  mockContext.get = vi.fn(() => {
    callCount++;
    // First call is for intlContext, second is for graphqlClientContext
    if (callCount === 1) {
      return mockIntl;
    }
    return mockClient;
  });

  return mockContext;
};

describe("getCommunityTeamIdInMiddleware", () => {
  const communityId = "test-community-id";
  const teamId = "test-team-id";

  test("returns teamIdForRoleAssignment when community exists", async () => {
    const mockContext = createMockContext({
      data: {
        community: {
          teamIdForRoleAssignment: teamId,
        },
      },
    });

    const result = await getCommunityTeamIdInMiddleware(
      mockContext as never,
      communityId,
    );

    expect(result).toBe(teamId);
  });

  test("throws NotFoundError when community is null", async () => {
    const mockContext = createMockContext({
      data: {
        community: null,
      },
    });

    await expect(
      getCommunityTeamIdInMiddleware(mockContext as never, communityId),
    ).rejects.toThrow(NotFoundError);
  });

  test("throws NotFoundError when teamIdForRoleAssignment is null", async () => {
    const mockContext = createMockContext({
      data: {
        community: {
          teamIdForRoleAssignment: null,
        },
      },
    });

    await expect(
      getCommunityTeamIdInMiddleware(mockContext as never, communityId),
    ).rejects.toThrow(NotFoundError);
  });

  test("throws NotFoundError when data is undefined", async () => {
    const mockContext = createMockContext({
      data: undefined,
    });

    await expect(
      getCommunityTeamIdInMiddleware(mockContext as never, communityId),
    ).rejects.toThrow(NotFoundError);
  });

  test("error message includes communityId", async () => {
    const specificCommunityId = "specific-test-id";
    const mockContext = createMockContext({
      data: {
        community: null,
      },
    });

    await expect(
      getCommunityTeamIdInMiddleware(mockContext as never, specificCommunityId),
    ).rejects.toThrow(specificCommunityId);
  });
});
