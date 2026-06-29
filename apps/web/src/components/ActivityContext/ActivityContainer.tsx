import { type ReactNode, useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

import { useAuthentication } from "@gc-digital-talent/auth";
import { useFeatureFlags } from "@gc-digital-talent/env";

import InactivityDialog, {
  type InactivityDialogProps,
} from "./InactivityDialog";

const timeout = 1000 * 60 * 60; // 60 minutes to milliseconds
const promptBeforeIdle = 1000 * 60 * 5; // prompt five minutes before timing out

interface InnerActivityContainerProps {
  logout: ReturnType<typeof useAuthentication>["logout"];
  children?: ReactNode;
}

// The inner container is only swapped in when the user is logged in and the feature flag is active
const InnerActivityContainer = ({
  logout,
  children,
}: InnerActivityContainerProps) => {
  const [remainingTimeValue, setRemainingTimeValue] =
    useState<InactivityDialogProps["remainingTimeValue"]>(0);
  const [remainingTimeUnit, setRemainingTimeUnit] =
    useState<InactivityDialogProps["remainingTimeUnit"]>("m");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const onIdle = () => {
    // console.debug("onIdle");
    setDialogOpen(false);
    logout();
  };

  const onActive = () => {
    // console.debug("onActive");
    setDialogOpen(false);
  };

  const onPrompt = () => {
    // console.debug("onPrompt");
    setDialogOpen(true);
  };

  // This is how the example is written: https://idletimer.dev/docs/features/confirm-prompt#example
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500,
    crossTab: true,
    leaderElection: true,
    syncTimers: 200,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTimeMs = getRemainingTime();
      if (remainingTimeMs >= 60_000) {
        setRemainingTimeValue(Math.ceil(remainingTimeMs / 60_000)); // milliseconds to minutes
        setRemainingTimeUnit("m");
      } else {
        setRemainingTimeValue(Math.ceil(remainingTimeMs / 1_000)); // milliseconds to seconds
        setRemainingTimeUnit("s");
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  const handleOpenChange = () => {
    // console.debug("handleOpenChange");
    setDialogOpen(false); // shouldn't be necessary as `activate()` should call onActive but this covers a condition where a new tab is opened and the old tab is stuck with the dialog open
    activate();
  };
  const handleStaySignedIn = () => {
    // console.debug("handleStaySignedIn");
    setDialogOpen(false); // shouldn't be necessary as `activate()` should call onActive but this covers a condition where a new tab is opened and the old tab is stuck with the dialog open
    activate();
  };
  const handleSignOut = () => {
    // console.debug("handleSignOut");
    logout();
  };

  return (
    <>
      <InactivityDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        remainingTimeValue={remainingTimeValue}
        remainingTimeUnit={remainingTimeUnit}
        onStaySignedIn={handleStaySignedIn}
        onSignOut={handleSignOut}
      />
      {children}
    </>
  );
};

interface ActivityContainerProps {
  children?: ReactNode;
}

const ActivityContainer = ({ children }: ActivityContainerProps) => {
  const { loggedIn, logout } = useAuthentication();
  const featureFlags = useFeatureFlags();

  if (loggedIn && featureFlags.activityTimer) {
    return (
      <InnerActivityContainer logout={logout}>
        {children}
      </InnerActivityContainer>
    );
  }

  // bypass if not logged in or feature flag not enabled
  return <>{children}</>;
};

export default ActivityContainer;
