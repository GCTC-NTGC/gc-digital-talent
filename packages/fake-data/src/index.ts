import fakeClassifications from "./fakeClassifications";
import fakeDepartments from "./fakeDepartments";
import fakeExperiences, { experienceGenerators } from "./fakeExperiences";
import fakeApplicantFilters from "./fakeApplicantFilters";
import fakePoolCandidates from "./fakePoolCandidates";
import fakePools from "./fakePools";
import fakeRoles from "./fakeRoles";
import fakeSearchRequests from "./fakeSearchRequests";
import fakeSkillFamilies, { getStaticSkillFamilies } from "./fakeSkillFamilies";
import fakeSkills, { getStaticSkills } from "./fakeSkills";
import fakeTeams from "./fakeTeams";
import fakeUsers, { fakeApplicants } from "./fakeUsers";
import fakeUserSkills from "./fakeUserSkills";

// Faker Generated Data
export {
  fakeApplicants,
  fakeClassifications,
  fakeDepartments,
  fakeExperiences,
  fakePools,
  fakeRoles,
  fakePoolCandidates,
  fakeSearchRequests,
  fakeApplicantFilters,
  fakeSkillFamilies,
  fakeSkills,
  fakeTeams,
  fakeUsers,
  fakeUserSkills,
};

// Static Data
export { getStaticSkillFamilies, getStaticSkills };

// Generators
export { experienceGenerators };
