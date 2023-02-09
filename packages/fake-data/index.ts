import fakeClassifications from "./src/fakeClassifications";
import fakeDepartments from "./src/fakeDepartments";
import fakeExperiences, { experienceGenerators } from "./src/fakeExperiences";
import fakePoolAdvertisements from "./src/fakePoolAdvertisements";
import fakePoolCandidateFilters from "./src/fakePoolCandidateFilters";
import fakePoolCandidates from "./src/fakePoolCandidates";
import fakePools from "./src/fakePools";
import fakeSearchRequests from "./src/fakeSearchRequests";
import fakeSkillFamilies, {
  getStaticSkillFamilies,
} from "./src/fakeSkillFamilies";
import fakeSkills, { getStaticSkills } from "./src/fakeSkills";
import fakeTeams from "./src/fakeTeams";
import fakeUsers, { fakeApplicants } from "./src/fakeUsers";

// Faker Generated Data
export {
  fakeApplicants,
  fakeClassifications,
  fakeDepartments,
  fakeExperiences,
  fakePoolAdvertisements,
  fakePoolCandidateFilters,
  fakePoolCandidates,
  fakePools,
  fakeSearchRequests,
  fakeSkillFamilies,
  fakeSkills,
  fakeTeams,
  fakeUsers,
};

// Static Data
export { getStaticSkillFamilies, getStaticSkills };

// Generators
export { experienceGenerators };
