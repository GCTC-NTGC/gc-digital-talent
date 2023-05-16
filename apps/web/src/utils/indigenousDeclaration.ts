import { IndigenousCommunity } from "@gc-digital-talent/graphql";

// constrained list of community form values to avoid typos
type FormCommunity = "firstNations" | "inuk" | "metis" | "other";

interface FormCommunityFields {
  communities: Array<FormCommunity>;
  isStatusFirstNations: "yes" | "no" | null;
}

// for use with forms with a radio button, like the application self-declaration
export interface FormValuesWithYesNo extends FormCommunityFields {
  isIndigenous: "yes" | "no" | null;
}

// for use with forms with a checkbox, like the profile dialog
export interface FormValuesWithBoolean extends FormCommunityFields {
  isIndigenous: boolean;
}

function apiCommunitiesToFormCommunityFields(
  apiCommunities: Array<IndigenousCommunity>,
): FormCommunityFields {
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
  let isStatusFirstNations: FormCommunityFields["isStatusFirstNations"];
  if (apiCommunities.includes(IndigenousCommunity.StatusFirstNations))
    isStatusFirstNations = "yes";
  else if (apiCommunities.includes(IndigenousCommunity.NonStatusFirstNations))
    isStatusFirstNations = "no";
  else isStatusFirstNations = null;

  // assemble object from pre-computed values
  return {
    communities: formCommunities,
    isStatusFirstNations,
  };
}

export function apiCommunitiesToFormValuesWithYesNo(
  apiCommunities: Array<IndigenousCommunity>,
): FormValuesWithYesNo {
  // assemble object from pre-computed values
  return {
    ...apiCommunitiesToFormCommunityFields(apiCommunities),
    isIndigenous: apiCommunities.length > 0 ? "yes" : "no",
  };
}

export function apiCommunitiesToFormValuesWithBoolean(
  apiCommunities: Array<IndigenousCommunity>,
): FormValuesWithBoolean {
  // assemble object from pre-computed values
  return {
    ...apiCommunitiesToFormCommunityFields(apiCommunities),
    isIndigenous: apiCommunities.length > 0,
  };
}

export function formValuesToApiCommunities(
  formValues: FormValuesWithYesNo | FormValuesWithBoolean,
): Array<IndigenousCommunity> {
  // short-circuit if isIndigenous is not checked
  let normalizedIsIndigenous: boolean;
  if (typeof formValues.isIndigenous === "string") {
    normalizedIsIndigenous = formValues.isIndigenous === "yes";
  } else {
    normalizedIsIndigenous = formValues.isIndigenous ?? false;
  }

  if (!normalizedIsIndigenous) return [];

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
