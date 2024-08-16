import fs from "node:fs";

import {
  Classification,
  Community,
  Department,
  Role,
  Skill,
  Team,
} from "@gc-digital-talent/graphql";

import DATA from "~/constants/data";
import graphql from "~/utils/graphql";
import { getRoles } from "~/utils/roles";
import { getSkills } from "~/utils/skills";
import { getDepartments } from "~/utils/departments";
import { getClassifications } from "~/utils/classification";
import { getDCM } from "~/utils/teams";
import { getCommunities } from "~/utils/communities";

export const readCache = <T>(path: string): T | undefined => {
  let data: T;
  try {
    const json = fs.readFileSync(path, "utf8");
    data = JSON.parse(json);
  } catch (error) {
    console.error(error);
  }
  return data;
};

export const writeCache = (path: string, data: unknown): void => {
  try {
    if (!fs.existsSync(DATA.ROOT)) {
      fs.mkdirSync(DATA.ROOT);
    }
  } catch (error) {
    console.error(error);
    return;
  }

  fs.writeFile(path, JSON.stringify(data), (err) => {
    if (err) console.error(err);
  });
};

export const writeApiDataCache = async () => {
  const ctx = await graphql.newContext();

  try {
    if (!fs.existsSync(DATA.ROOT)) {
      fs.mkdirSync(DATA.ROOT);
    }
  } catch (error) {
    console.error(error);
    return;
  }

  await getClassifications(ctx).then((classifications) => {
    writeCache(DATA.CLASSIFICATIONS, classifications);
  });

  await getCommunities(ctx).then((communities) => {
    writeCache(DATA.COMMUNITES, communities);
  });

  await getDepartments(ctx).then((departments) => {
    writeCache(DATA.DEPARTNENTS, departments);
  });

  await getRoles(ctx).then((roles) => {
    writeCache(DATA.ROLES, roles);
  });

  await getSkills(ctx).then((skills) => {
    writeCache(DATA.SKILLS, skills);
  });

  await getDCM(ctx).then((dcm) => {
    writeCache(DATA.DCM, dcm);
  });
};

export type ApiData = {
  classifications?: Classification[];
  communities?: Community[];
  dcm?: Team;
  departments?: Department[];
  roles?: Role[];
  skills?: Skill[];
};

export const readApiDataCache = () => {
  let apiData: ApiData = {};

  try {
    apiData = {
      classifications: readCache(DATA.CLASSIFICATIONS) ?? [],
      communities: readCache(DATA.COMMUNITES) ?? [],
      dcm: readCache(DATA.DCM),
      departments: readCache(DATA.DEPARTNENTS) ?? [],
      roles: readCache(DATA.ROLES) ?? [],
      skills: readCache(DATA.SKILLS) ?? [],
    };
  } catch (error) {
    console.error(error);
  }

  return apiData;
};
