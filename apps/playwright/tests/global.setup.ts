import { test as setup } from "@playwright/test";

import graphql from "~/utils/graphql";
import { apiCache } from "~/utils/cache";
import { getClassifications } from "~/utils/classification";
import { getCommunities } from "~/utils/communities";
import { getDepartments } from "~/utils/departments";
import { getRoles } from "~/utils/roles";
import { getSkills } from "~/utils/skills";

setup("Cache API", async ({}) => {
  const adminCtx = await graphql.newContext();

  apiCache.set("classifications", await getClassifications(adminCtx, {}));
  apiCache.set("communities", await getCommunities(adminCtx, {}));
  apiCache.set("departments", await getDepartments(adminCtx, {}));
  apiCache.set("roles", await getRoles(adminCtx));
  apiCache.set("skills", await getSkills(adminCtx, {}));
});
