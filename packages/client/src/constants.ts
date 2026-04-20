export const apiHost = typeof API_HOST !== "undefined" ? API_HOST : "";
export const apiUri = typeof API_URI !== "undefined" ? API_URI : "/graphql";
export const protectedUrl =
  typeof API_PROTECTED_URI !== "undefined"
    ? API_PROTECTED_URI
    : "/admin/graphql";
export const reverbAppKey =
  typeof REVERB_APP_KEY !== "undefined" ? REVERB_APP_KEY : "";
export const allowableClockSkewSeconds = 20;
