export interface AuthenticationState {
  loggedIn: boolean;
  logout: (postLogoutUri?: string) => void;
  refreshTokenSet: () => Promise<void>;
}
