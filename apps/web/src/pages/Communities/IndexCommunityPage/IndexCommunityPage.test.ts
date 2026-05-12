import { describe, test, expect, vi, beforeEach } from "vitest";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { UnauthorizedError } from "@gc-digital-talent/helpers";

import { clientMiddleware } from "./IndexCommunityPage";
import { createMockRoleAssignment } from "../testUtils";

// Mock the userContext and intlContext to return our test values
vi.mock("~/routing/context", () => ({
  userContext: "userContext",
  intlContext: "intlContext",
  graphqlClientContext: "graphqlClientContext",
}));

describe("IndexCommunityPage clientMiddleware", () => {
  const mockRequest = {
    url: "http://localhost:3000/en/admin/communities",
  } as Request;

  const mockNext = vi.fn(() => Promise.resolve("next-result"));

  const createContext = (user: unknown, intl: unknown) => ({
    get: vi.fn((token: unknown) => {
      if (token === "userContext") return user;
      if (token === "intlContext") return intl;
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

  describe("allows access for authorized roles", () => {
    test("allows PlatformAdmin access", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(ROLE_NAME.PlatformAdmin),
          ],
        },
        mockIntl,
      );

      await clientMiddleware[0]({ context, request: mockRequest, params: {} }, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test("allows CommunityAdmin access", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(ROLE_NAME.CommunityAdmin, "team-123"),
          ],
        },
        mockIntl,
      );

      await clientMiddleware[0]({ context, request: mockRequest, params: {} }, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test("allows CommunityRecruiter access", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(ROLE_NAME.CommunityRecruiter, "team-123"),
          ],
        },
        mockIntl,
      );

      await clientMiddleware[0]({ context, request: mockRequest, params: {} }, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test("allows CommunityTalentCoordinator access", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(ROLE_NAME.CommunityTalentCoordinator, "team-123"),
          ],
        },
        mockIntl,
      );

      await clientMiddleware[0]({ context, request: mockRequest, params: {} }, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("denies access for unauthorized roles", () => {
    test("throws UnauthorizedError for Applicant role", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(ROLE_NAME.Applicant),
          ],
        },
        mockIntl,
      );

      await expect(
        clientMiddleware[0]({ context, request: mockRequest, params: {} }, mockNext),
      ).rejects.toThrow(UnauthorizedError);
    });

    test("throws UnauthorizedError for BaseUser role", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(ROLE_NAME.BaseUser),
          ],
        },
        mockIntl,
      );

      await expect(
        clientMiddleware[0]({ context, request: mockRequest, params: {} }, mockNext),
      ).rejects.toThrow(UnauthorizedError);
    });

    test("throws UnauthorizedError for Guest role", async () => {
      const context = createContext(
        {
          roleAssignments: [
            createMockRoleAssignment(ROLE_NAME.Guest),
          ],
        },
        mockIntl,
      );

      await expect(
        clientMiddleware[0]({ context, request: mockRequest, params: {} }, mockNext),
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
        clientMiddleware[0]({ context, request: mockRequest, params: {} }, mockNext),
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("redirects when user is not logged in", () => {
    test("throws redirect when user is null", async () => {
      const context = createContext(null, mockIntl);

      // requireUser throws a redirect Response when user is null
      await expect(
        clientMiddleware[0]({ context, request: mockRequest, params: {} }, mockNext),
      ).rejects.toBeDefined();

      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
