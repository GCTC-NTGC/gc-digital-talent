import { jwtDecode, JwtPayload } from "jwt-decode";

import { allowableClockSkewSeconds } from "../constants";

const isTokenProbablyExpired = (accessToken: string | null): boolean => {
  let tokenProbablyExpired = false;
  if (accessToken) {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    if (decoded.exp) {
      const tokenExpiryDateSeconds = decoded.exp;
      const safeTokenExpiryDateSeconds =
        tokenExpiryDateSeconds - allowableClockSkewSeconds; // allow for the client's machine to be a bit off
      tokenProbablyExpired = Date.now() > safeTokenExpiryDateSeconds * 1000; // JWT expiry date in seconds to milliseconds
    }
  }

  return tokenProbablyExpired;
};

export default isTokenProbablyExpired;
