import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, screen } from "@testing-library/react";

import type * as GcdtAuth from "@gc-digital-talent/auth";
import type * as GcdtEnv from "@gc-digital-talent/env";
import { renderWithProviders } from "@gc-digital-talent/vitest-helpers";

import ActivityContainer from "./ActivityContainer";

const mocks = vi.hoisted(() => ({
  logout: vi.fn(),
  loggedIn: true,
  activityTimer: true,
  // A stable object identity, distinct from any real timers implementation,
  // so the test can prove this exact value was the one passed through.
  workerTimersSentinel: { __mock: "workerTimers" },
  idleTimerOptions: undefined as Record<string, unknown> | undefined,
}));

vi.mock("react-idle-timer", () => ({
  workerTimers: mocks.workerTimersSentinel,
  useIdleTimer: (options: Record<string, unknown>) => {
    mocks.idleTimerOptions = options;
    return { getRemainingTime: () => 0, activate: vi.fn() };
  },
}));

vi.mock("@gc-digital-talent/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof GcdtAuth>();
  return {
    ...actual,
    useAuthentication: () => ({
      loggedIn: mocks.loggedIn,
      logout: mocks.logout,
    }),
  };
});

vi.mock("@gc-digital-talent/env", async (importOriginal) => {
  const actual = await importOriginal<typeof GcdtEnv>();
  return {
    ...actual,
    useFeatureFlags: () => ({ activityTimer: mocks.activityTimer }),
  };
});

const renderActivityContainer = () =>
  renderWithProviders(
    <ActivityContainer>
      <div>child content</div>
    </ActivityContainer>,
  );

describe("ActivityContainer", () => {
  beforeEach(() => {
    mocks.logout.mockReset();
    mocks.loggedIn = true;
    mocks.activityTimer = true;
    mocks.idleTimerOptions = undefined;
  });

  it("does not wire up the idle timer when the feature flag is off", () => {
    mocks.activityTimer = false;

    renderActivityContainer();

    expect(mocks.idleTimerOptions).toBeUndefined();
  });

  it("configures react-idle-timer with worker timers, not the main-thread default", () => {
    // Main thread timers get throttled or suspended by the browser once the
    // tab is backgrounded, which can silently stall onIdle for a real ~60
    // minute inactivity window. This locks in the fix so it can't regress.
    renderActivityContainer();

    expect(mocks.idleTimerOptions?.timers).toBe(mocks.workerTimersSentinel);
  });

  it("signs the user out when the idle timer fires onIdle", () => {
    renderActivityContainer();

    const onIdle = mocks.idleTimerOptions?.onIdle as () => void;
    act(() => onIdle());

    expect(mocks.logout).toHaveBeenCalledTimes(1);
  });

  it("shows the inactivity dialog on prompt and dismisses it once idle fires", () => {
    renderActivityContainer();

    const onPrompt = mocks.idleTimerOptions?.onPrompt as () => void;
    const onIdle = mocks.idleTimerOptions?.onIdle as () => void;

    act(() => onPrompt());
    expect(
      screen.getByText(/your session is about to end due to inactivity/i),
    ).toBeInTheDocument();

    act(() => onIdle());
    expect(
      screen.queryByText(/your session is about to end due to inactivity/i),
    ).not.toBeInTheDocument();
  });
});
