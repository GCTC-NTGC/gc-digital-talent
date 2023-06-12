const TALENTSEARCH_APP_DIR =
  (process.env.TALENTSEARCH_APP_DIR as string) ?? "/talent"; // fallback used by storybook
export default TALENTSEARCH_APP_DIR;
export const TALENTSEARCH_RECRUITMENT_EMAIL =
  (process.env.TALENTSEARCH_RECRUITMENT_EMAIL as string) ??
  "recruitmentimit-recrutementgiti@tbs-sct.gc.ca";
export const TALENTSEARCH_SUPPORT_EMAIL =
  (process.env.TALENTSEARCH_SUPPORT_EMAIL as string) ??
  "gctalent-talentgc@support-soutien.gc.ca";
export const API_SUPPORT_ENDPOINT =
  (process.env.API_SUPPORT_ENDPOINT as string) ?? "/api/support/tickets";
