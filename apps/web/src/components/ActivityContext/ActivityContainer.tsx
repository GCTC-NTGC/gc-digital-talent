import { type ReactNode, createContext, useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

import { useAuthentication } from "@gc-digital-talent/auth";

import type { ActivityState } from "./types";
import InactivityDialog from "./InactivityDialog";

const timeout = 10_000;
const promptBeforeIdle = 4_000;

const defaultActivityState: ActivityState = {
  state: "Active",
  remaining: timeout,
  open: false,
};

export const ActivityContext =
  createContext<ActivityState>(defaultActivityState);

interface AuthenticationContainerProps {
  children?: ReactNode;
}

const ActivityContainer = ({ children }: AuthenticationContainerProps) => {
  const [userState, setUserState] = useState<"Idle" | "Active" | "Prompted">(
    "Active",
  );
  const [remainingMinutes, setRemainingMinutes] = useState<number>(timeout);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { logout } = useAuthentication();

  const onIdle = () => {
    // console.debug("onIdle");
    setUserState("Idle");
    setDialogOpen(false);
  };

  const onActive = () => {
    // console.debug("onActive");
    setUserState("Active");
    setDialogOpen(false);
  };

  const onPrompt = () => {
    // console.debug("onPrompt");
    setUserState("Prompted");
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
    // console.debug("handleOpenChange");
    activate();
  };
  const handleStaySignedIn = () => {
    // console.debug("handleStaySignedIn");
    activate();
  };
  const handleSignOut = () => {
    // console.debug("handleSignOut");
    logout();
  };

  return (
    <ActivityContext.Provider
      value={{
        state: userState,
        remaining: remainingMinutes,
        open: dialogOpen,
      }}
    >
      <InactivityDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        remainingMinutes={remainingMinutes}
        onStaySignedIn={handleStaySignedIn}
        onSignOut={handleSignOut}
      />
      {children}
    </ActivityContext.Provider>
  );
};

export default ActivityContainer;
