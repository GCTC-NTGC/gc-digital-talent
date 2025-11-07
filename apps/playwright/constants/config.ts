/* eslint-disable turbo/no-undeclared-env-vars */
const testConfig = {
  allSignInEmails: {
    adminSignIn: process.env.ADMIN ?? `admin@test.com`,
    platformAdminSignIn: process.env.PLATFORM_ADMIN ?? `platform@test.com`,
    applicantSignIn: process.env.APPLICANT ?? `applicant@test.com`,
  },

  departments: {
    url: "/en/admin/settings/departments",
  },

  users: {
    url: "/en/admin/users",
  },

  locationPreferenceConfig: {
    url: "/en/applicant/personal-information",
  },
};
export default testConfig;
