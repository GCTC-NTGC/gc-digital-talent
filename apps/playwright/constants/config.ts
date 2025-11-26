/* eslint-disable turbo/no-undeclared-env-vars */
const testConfig = {
  allSignInEmails: {
    adminSignIn: process.env.ADMIN ?? `admin@test.com`,
    platformAdminSignIn: process.env.PLATFORM_ADMIN ?? `platform@test.com`,
    applicantSignIn: process.env.APPLICANT ?? `applicant@test.com`,
  },
};
export default testConfig;
