/**
 * Shared test utilities for middleware authorization testing
 */
import { vi } from "vitest";

import type { RoleAssignment } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RoleNameValues = Object.values(ROLE_NAME);

// Re-usable mock role assignments
export const createMockRoleAssignment = (
  roleName: (typeof RoleNameValues)[number],
  teamId?: string,
): RoleAssignment => {
  const teamRoleArray: string[] = [
    ROLE_NAME.CommunityAdmin,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityTalentCoordinator,
    ROLE_NAME.ProcessOperator,
    ROLE_NAME.DepartmentAdmin,
    ROLE_NAME.DepartmentHRAdvisor,
  ];

  const isTeamBased = teamRoleArray.includes(roleName);

  return {
    id: `assignment-${roleName}`,
    role: {
      id: `role-${roleName}`,
      name: roleName,
      isTeamBased,
    },
    team: teamId ? { id: teamId, name: `Team ${teamId}` } : null,
  };
};

interface CreateMockContextOptions {
  roleAssignments?: RoleAssignment[];
  locale?: string;
}

/**
 * Creates a mock context for middleware testing
 * Simulates the router context with user, intl, and graphql client
 */
export const createMockContext = (options: CreateMockContextOptions = {}) => {
  const { roleAssignments = [], locale = "en" } = options;

  const mockUser = roleAssignments.length > 0 ? { roleAssignments } : null;

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
    locale,
  };

  // We need to simulate context.get() calls by token reference
  // The order is: userContext, intlContext (for redirect path)
  const contextValues: Record<string, unknown> = {
    user: mockUser,
    intl: mockIntl,
    graphql: {},
  };

  return {
    get: vi.fn((token: unknown) => {
      // Match based on what the token represents
      // In production, these are actual context objects
      const tokenStr = String(token);
      if (
        tokenStr.includes("user") ||
        tokenStr.includes("User") ||
        token === "userContext"
      ) {
        return contextValues.user;
      }
      if (
        tokenStr.includes("intl") ||
        tokenStr.includes("Intl") ||
        token === "intlContext"
      ) {
        return contextValues.intl;
      }
      // Default - return user for the first context call in requireUser
      return contextValues.user;
    }),
    _values: contextValues,
  };
};

/**
 * Creates a mock Request object for middleware testing
 */
export const createMockRequest = (path = "/en/admin/communities") => {
  return {
    url: `http://localhost:3000${path}`,
  } as Request;
};

/**
 * Creates a mock next function for middleware testing
 */
export const createMockNext = () => vi.fn(() => Promise.resolve("next-result"));

/**
 * Test helper to verify middleware allows access
 */
export const expectMiddlewareToAllow = async (
  middleware: (
    args: {
      context: ReturnType<typeof createMockContext>;
      request: Request;
      params: Record<string, string>;
    },
    next: ReturnType<typeof createMockNext>,
  ) => Promise<unknown>,
  context: ReturnType<typeof createMockContext>,
  request: Request,
  params: Record<string, string> = {},
) => {
  const mockNext = createMockNext();
  const result = await middleware({ context, request, params }, mockNext);
  return { result, mockNext };
};
