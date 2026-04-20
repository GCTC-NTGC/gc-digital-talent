import { type ReactNode, useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

import { useAuthentication } from "@gc-digital-talent/auth";
import { useFeatureFlags } from "@gc-digital-talent/env";

import InactivityDialog from "./InactivityDialog";

const timeout = 10_000;
const promptBeforeIdle = 4_000;

interface InnerActivityContainerProps {
  logout: ReturnType<typeof useAuthentication>["logout"];
  children?: ReactNode;
}

// The inner container is only swapped in when the user is logged in
const InnerActivityContainer = ({
  logout,
  children,
}: InnerActivityContainerProps) => {
  const [remainingMinutes, setRemainingMinutes] = useState<number>(timeout);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const onIdle = () => {
    console.debug("onIdle");
    setDialogOpen(false);
    logout();
  };

  const onActive = () => {
    console.debug("onActive");
    setDialogOpen(false);
  };

  const onPrompt = () => {
    console.debug("onPrompt");
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
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMinutes(Math.ceil(getRemainingTime() / 1000 / 60)); // milliseconds to minutes
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  const handleOpenChange = () => {
    console.debug("handleOpenChange");
    activate();
  };
  const handleStaySignedIn = () => {
    console.debug("handleStaySignedIn");
    activate();
  };
  const handleSignOut = () => {
    console.debug("handleSignOut");
    logout();
  };

  return (
    <>
      <InactivityDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        remainingMinutes={remainingMinutes}
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

  // bypass if not logged in
  return <>{children}</>;
};

export default ActivityContainer;
