import { JwtPayload, jwtDecode } from "jwt-decode";

import { allowableClockSkewSeconds } from "../constants";

/**
 * Attempt to determine if an access token is expired
 */
export function isTokenProbablyExpired(accessToken: string | null): boolean {
  let tokenProbablyExpired = false;
  if (accessToken) {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    if (decoded.exp) {
      const tokenExpiryDateSeconds = decoded.exp;
      const safeTokenExpiryDateSeconds =
        tokenExpiryDateSeconds - allowableClockSkewSeconds; // tolerance for the client's machine to be slightly different
      tokenProbablyExpired = Date.now() > safeTokenExpiryDateSeconds * 1000; // JWT expiry date in seconds to milliseconds
    }
  }

  return tokenProbablyExpired;
}
