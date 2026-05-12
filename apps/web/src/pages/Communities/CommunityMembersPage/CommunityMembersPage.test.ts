import { describe, test, expect, vi, beforeEach } from "vitest";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { UnauthorizedError } from "@gc-digital-talent/helpers";

import { clientMiddleware } from "./CommunityMembersPage";
import { createMockRoleAssignment } from "../testUtils";

// Mock the userContext and intlContext to return our test values
vi.mock("~/routing/context", () => ({
  userContext: "userContext",
  intlContext: "intlContext",
  graphqlClientContext: "graphqlClientContext",
}));

// Mock getCommunityTeamIdInMiddleware
vi.mock("../utils", () => ({
  getCommunityTeamIdInMiddleware: vi.fn(() => Promise.resolve("team-123")),
}));

describe("CommunityMembersPage clientMiddleware", () => {
  const mockRequest = {
    url: "http://localhost:3000/en/admin/communities/community-123/members",
  } as Request;

  const mockParams = {
    locale: "en",
    communityId: "community-123",
  };

  const mockNext = vi.fn(() => Promise.resolve("next-result"));

  const createContext = (
    user: unknown,
    intl: unknown,
    graphqlClient: unknown = {},
  ) => ({
    get: vi.fn((token: unknown) => {
      if (token === "userContext") return user;
      if (token === "intlContext") return intl;
      if (token === "graphqlClientContext") return graphqlClient;
      return null;
    }),
  });

  const mockIntl = {
    locale: "en",
    formatMessage: vi.fn(
      (descriptor: { defaultMessage: string }) => descriptor.defaultMessage,
    ),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("allows access for authorized roles with matching team", () => {
    test("allows PlatformAdmin access (global role, no team needed)", async () => {
      const context = createContext(
        {
          roleAssignments: [createMockRoleAssignment(ROLE_NAME.PlatformAdmin)],
        },
        mockIntl,
      );

      await clientMiddleware[0](
        { context, request: mockRequest, params: mockParams },
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
    });

    test("allows CommunityAdmin with matching teamId", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(ROLE_NAME.CommunityAdmin, "team-123"),
          ],
        },
        mockIntl,
      );

      await clientMiddleware[0](
        { context, request: mockRequest, params: mockParams },
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
    });

    test("allows CommunityRecruiter with matching teamId", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(ROLE_NAME.CommunityRecruiter, "team-123"),
          ],
        },
        mockIntl,
      );

      await clientMiddleware[0](
        { context, request: mockRequest, params: mockParams },
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
    });

    test("allows CommunityTalentCoordinator with matching teamId", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(
              ROLE_NAME.CommunityTalentCoordinator,
              "team-123",
            ),
          ],
        },
        mockIntl,
      );

      await clientMiddleware[0](
        { context, request: mockRequest, params: mockParams },
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("denies access for community roles with wrong team", () => {
    test("throws UnauthorizedError for CommunityAdmin with wrong teamId", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(ROLE_NAME.CommunityAdmin, "wrong-team"),
          ],
        },
        mockIntl,
      );

      await expect(
        clientMiddleware[0](
          { context, request: mockRequest, params: mockParams },
          mockNext,
        ),
      ).rejects.toThrow(UnauthorizedError);
    });

    test("throws UnauthorizedError for CommunityRecruiter with wrong teamId", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(
              ROLE_NAME.CommunityRecruiter,
              "wrong-team",
            ),
          ],
        },
        mockIntl,
      );

      await expect(
        clientMiddleware[0](
          { context, request: mockRequest, params: mockParams },
          mockNext,
        ),
      ).rejects.toThrow(UnauthorizedError);
    });

    test("throws UnauthorizedError for CommunityTalentCoordinator with wrong teamId", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(
              ROLE_NAME.CommunityTalentCoordinator,
              "wrong-team",
            ),
          ],
        },
        mockIntl,
      );

      await expect(
        clientMiddleware[0](
          { context, request: mockRequest, params: mockParams },
          mockNext,
        ),
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("denies access for other unauthorized roles", () => {
    test("throws UnauthorizedError for Applicant role", async () => {
      const context = createContext(
        {
          roleAssignments: [createMockRoleAssignment(ROLE_NAME.Applicant)],
        },
        mockIntl,
      );

      await expect(
        clientMiddleware[0](
          { context, request: mockRequest, params: mockParams },
          mockNext,
        ),
      ).rejects.toThrow(UnauthorizedError);
    });

    test("throws UnauthorizedError for ProcessOperator role", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(ROLE_NAME.ProcessOperator, "team-123"),
          ],
        },
        mockIntl,
      );

      await expect(
        clientMiddleware[0](
          { context, request: mockRequest, params: mockParams },
          mockNext,
        ),
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("redirects when user is not logged in", () => {
    test("throws redirect when user is null", async () => {
      const context = createContext(null, mockIntl);

      // requireUser throws a redirect Response when user is null
      await expect(
        clientMiddleware[0](
          { context, request: mockRequest, params: mockParams },
          mockNext,
        ),
      ).rejects.toBeDefined();

      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
