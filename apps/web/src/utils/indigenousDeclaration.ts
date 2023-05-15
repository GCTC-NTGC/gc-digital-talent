import { IndigenousCommunity } from "@gc-digital-talent/graphql";

// constrained list of community form values to avoid typos
type FormCommunity = "firstNations" | "inuk" | "metis" | "other";

export interface FormValues {
  isIndigenous: "yes" | "no" | null;
  communities: Array<FormCommunity>;
  isStatusFirstNations: "yes" | "no" | null;
}

export function apiCommunitiesToFormValues(
  apiCommunities: Array<IndigenousCommunity>,
): FormValues {
  // array of form communities that will be built and returned
  const formCommunities: Array<FormCommunity> = [];

  if (
    apiCommunities.includes(IndigenousCommunity.StatusFirstNations) ||
    apiCommunities.includes(IndigenousCommunity.NonStatusFirstNations)
  )
    formCommunities.push("firstNations");
  if (apiCommunities.includes(IndigenousCommunity.Inuit))
    formCommunities.push("inuk");
  if (apiCommunities.includes(IndigenousCommunity.Metis))
    formCommunities.push("metis");
  if (apiCommunities.includes(IndigenousCommunity.Other))
    formCommunities.push("other");

  // Figure out if isStatusFirstNations should be yes/no/null
  let isStatusFirstNations: FormValues["isStatusFirstNations"];
  if (apiCommunities.includes(IndigenousCommunity.StatusFirstNations))
    isStatusFirstNations = "yes";
  else if (apiCommunities.includes(IndigenousCommunity.NonStatusFirstNations))
    isStatusFirstNations = "no";
  else isStatusFirstNations = null;

  // assemble object from pre-computed values
  return {
    isIndigenous: apiCommunities.length > 0 ? "yes" : "no",
    communities: formCommunities,
    isStatusFirstNations,
  };
}

export function formValuesToApiCommunities(
  formValues: FormValues,
): Array<IndigenousCommunity> {
  // short-circuit if isIndigenous is not checked
  if (!formValues.isIndigenous) return [];

  // array of API communities that will be built and returned
  const apiCommunities: Array<IndigenousCommunity> = [];

  if (
    formValues.communities.includes("firstNations") &&
    formValues.isStatusFirstNations === "yes"
  )
    apiCommunities.push(IndigenousCommunity.StatusFirstNations);
  if (
    formValues.communities.includes("firstNations") &&
    formValues.isStatusFirstNations === "no"
  )
    apiCommunities.push(IndigenousCommunity.NonStatusFirstNations);
  if (formValues.communities.includes("inuk"))
    apiCommunities.push(IndigenousCommunity.Inuit);
  if (formValues.communities.includes("metis"))
    apiCommunities.push(IndigenousCommunity.Metis);
  if (formValues.communities.includes("other"))
    apiCommunities.push(IndigenousCommunity.Other);

  return apiCommunities;
}
