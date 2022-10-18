const TALENTSEARCH_APP_DIR =
  (process.env.TALENTSEARCH_APP_DIR as string) ?? "/talent"; // fallback used by storybook
export default TALENTSEARCH_APP_DIR;
export const DIGITAL_CAREERS_POOL_KEY =
  (process.env.DIGITAL_CAREERS_POOL_KEY as string) ?? "digital_careers";
export const DIRECTINTAKE_APP_DIR =
  (process.env.DIRECTINTAKE_APP_DIR as string) ?? "/browse";
export const TALENTSEARCH_RECRUITMENT_EMAIL =
  (process.env.TALENTSEARCH_RECRUITMENT_EMAIL as string) ??
  "recruitmentimit-recrutementgiti@tbs-sct.gc.ca";
export const FRESHDESK_API_TICKETS_ENDPOINT =
  (process.env.FRESHDESK_API_TICKETS_ENDPOINT as string) ?? "";
export const FRESHDESK_API_KEY =
  (process.env.FRESHDESK_API_KEY as string) ?? "";
export const FRESHDESK_API_TICKET_TAG =
  (process.env.FRESHDESK_API_TICKET_TAG as string) ?? "";
