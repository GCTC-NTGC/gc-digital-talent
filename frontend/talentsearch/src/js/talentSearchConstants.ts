const TALENTSEARCH_APP_DIR =
  (process.env.TALENTSEARCH_APP_DIR as string) ?? "/talent"; // fallback used by storybook
export default TALENTSEARCH_APP_DIR;
export const DIGITAL_CAREERS_POOL_KEY =
  (process.env.DIGITAL_CAREERS_POOL_KEY as string) ?? "digital_careers";
export const APPLICANTPROFILE_APP_DIR =
  (process.env.APPLICANTPROFILE_APP_DIR as string) ?? "/talent/profile";
