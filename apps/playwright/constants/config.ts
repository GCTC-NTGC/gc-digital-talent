/* eslint-disable turbo/no-undeclared-env-vars */
const testConfig = {
  signInSubs: {
    adminSignIn: process.env.ADMIN ?? `admin@test.com`,
    platformAdminSignIn: process.env.PLATFORM_ADMIN ?? `platform@test.com`,
    applicantSignIn: process.env.APPLICANT ?? `applicant@test.com`,
    recruiterSignIn: process.env.RECRUITER ?? `recruiter@test.com`,
    communityAdminSignIn: process.env.COMMUNITY_ADMIN ?? `community@test.com`,
  },
};
export default testConfig;
