export const TALENTSEARCH_SUPPORT_EMAIL =
  (process.env.TALENTSEARCH_SUPPORT_EMAIL as string) ??
  "gctalent-talentgc@support-soutien.gc.ca";
export const API_SUPPORT_ENDPOINT =
  (process.env.API_SUPPORT_ENDPOINT as string) ?? "/api/support/tickets";
export const VERSION = (process.env.VERSION as string) ?? false;
