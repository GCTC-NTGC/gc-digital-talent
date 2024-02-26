import { useCallback, useEffect, useRef } from "react";

import { useLogger } from "@gc-digital-talent/logger";

const LOGOUT_MESSAGE = "LOGOUT";
let singleChannel: BroadcastChannel | undefined;

/**
 * Create a single broadcast channel
 * to emit logout message to all tabs
 *
 * @returns
 */
const getChannel = () => {
  if (!singleChannel) {
    singleChannel = new BroadcastChannel("logoutChannel");
  }

  return singleChannel;
};

const useLogoutChannel = (onLogout: () => void) => {
  const logger = useLogger();
  const channel = getChannel();
  // Prevents channel from being closed/reopened
  const isSubscribed = useRef(false);

  useEffect(() => {
    if (!isSubscribed.current) {
      channel.onmessage = (event) => {
        if (event.data === LOGOUT_MESSAGE) {
          onLogout();
        }
      };
    }

    return () => {
      if (isSubscribed.current) {
        channel.close();
        isSubscribed.current = false;
      }
    };
    // We only want this to run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postLogoutMessage = useCallback(() => {
    if (!channel) {
      logger.error("No logout channel open to post to.");
      return;
    }
    channel.postMessage(LOGOUT_MESSAGE);
  }, [channel, logger]);

  return {
    postLogoutMessage,
  };
};

export default useLogoutChannel;
