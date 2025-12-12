const LOGOUT_MESSAGE = "LOGOUT";

let channel: BroadcastChannel | undefined;
let hasListener = false;

/**
 * Sets up the logout channel if not already done,
 * attaches the onLogout side effect,
 * and returns a function to broadcast the logout message.
 */
export function getLogoutChannel(onLogout: () => void): () => void {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    channel ??= new BroadcastChannel("logoutChannel");
    if (!hasListener) {
      channel.onmessage = (event: MessageEvent) => {
        if (event.data === LOGOUT_MESSAGE) {
          onLogout();
        }
      };
      hasListener = true;
    }
  }

  return function broadcastLogout() {
    if (channel) {
      channel.postMessage(LOGOUT_MESSAGE);
    }
  };
}
