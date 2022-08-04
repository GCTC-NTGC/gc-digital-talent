const TALENTSEARCH_APP_DIR =
  (process.env.TALENTSEARCH_APP_DIR as string) ?? "/search"; // fallback used by storybook
export default TALENTSEARCH_APP_DIR;
export const DIGITAL_CAREERS_POOL_KEY =
  (process.env.DIGITAL_CAREERS_POOL_KEY as string) ?? "digital_careers";
export const DIRECTINTAKE_APP_DIR =
  (process.env.DIRECTINTAKE_APP_DIR as string) ?? "/browse";
export const TALENTSEARCH_RECRUITMENT_EMAIL =
  (process.env.TALENTSEARCH_RECRUITMENT_EMAIL as string) ??
  "recruitmentimit-recrutementgiti@tbs-sct.gc.ca";
