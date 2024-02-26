import { useCallback, useEffect, useRef } from "react";

const LOGOUT_MESSAGE = "LOGOUT";
let singleChannel: BroadcastChannel;

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
    channel?.postMessage(LOGOUT_MESSAGE);
  }, [channel]);

  return {
    postLogoutMessage,
  };
};

export default useLogoutChannel;
