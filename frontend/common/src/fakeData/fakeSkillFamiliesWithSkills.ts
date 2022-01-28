import faker from "faker";
import { fakeSkillFamilies, fakeSkills } from ".";
import { Skill, SkillFamily } from "../api/generated";

// This helper function generates the Skill Families and Skills separately then combines them together.
// This avoids the issue of each fake dataset simultaneously needing the other to fully generate.

export default (): { skillFamilies: SkillFamily[]; skills: Skill[] } => {
  const skillFamilies = fakeSkillFamilies(4);
  const skills = fakeSkills(20);

  skillFamilies.forEach((skillFamily) => {
    const skillsToAttach = faker.random.arrayElements(skills);
    // eslint-disable-next-line no-param-reassign
    skillFamily.skills = skillsToAttach;
    skillsToAttach.forEach((skill) => skill.families?.push(skillFamily));
  });

  return { skillFamilies, skills };
};
