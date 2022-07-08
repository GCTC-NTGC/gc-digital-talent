import {
  getWorkRegion,
  getEmploymentDuration,
  getLanguageAbility,
  getOperationalRequirement,
  getEducationType,
  getJobLookingStatus,
} from "@common/constants/localizedConstants";
import { enumToOptions } from "@common/helpers/formUtils";
import mapValues from "lodash/mapValues";
import { useIntl } from "react-intl";
import useLocale from "./useLocale";
import {
  WorkRegion,
  OperationalRequirement,
  EducationType,
  JobLookingStatus,
  LanguageAbility,
  useAllSkillsQuery,
  useGetClassificationsQuery,
  useGetPoolsQuery,
} from "../api/generated";

// This is use way to remove null and undefined values from list types, which
// makes working with them simpler (e.g. `arr.map( ... )`)
// Source: https://stackoverflow.com/a/46700791
function notNullOrUndefined<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}

// TODO: Remove this toggle after data model settles.
// See: https://www.figma.com/proto/XS4Ag6GWcgdq2dBlLzBkay?node-id=1064:5862#224617157
export default function useSearchFilterOptions(enableEducationType = false) {
  const intl = useIntl();
  const locale = useLocale();
  // TODO: Implement way to return `fetching` states from hook, so that can pass
  // to react-select's `isLoading` prop on <Select />.
  // See: https://react-select.com/props#select-props
  const [skillsRes] = useAllSkillsQuery();
  const [classificationsRes] = useGetClassificationsQuery();
  const [poolsRes] = useGetPoolsQuery();

  const yesOption = {
    value: "true",
    // No description since common term that can be de-duplicated by FormatJS.
    label: intl.formatMessage({ defaultMessage: "Yes" }),
  };

  const optionsData = {
    pools: poolsRes.data?.pools
      .filter(notNullOrUndefined)
      .map(({ id, name }) => ({
        value: id,
        // TODO: Must name and translations be optional in types?
        label: name?.[locale] || "Error: name not loaded",
      })),
    languages: enumToOptions(LanguageAbility).map(({ value }) => ({
      value,
      label: intl.formatMessage(getLanguageAbility(value)),
    })),
    classifications: classificationsRes.data?.classifications
      .filter(notNullOrUndefined)
      .map(({ id, group, level }) => ({
        value: id,
        label: `${group}-${level}`,
      })),
    workPreferences: enumToOptions(OperationalRequirement).map(({ value }) => ({
      value,
      label: intl.formatMessage(getOperationalRequirement(value, "short")),
    })),
    workLocations: enumToOptions(WorkRegion).map(({ value }) => ({
      value,
      label: intl.formatMessage(getWorkRegion(value)),
    })),
    ...(enableEducationType
      ? {
          educationTypes: enumToOptions(EducationType).map(({ value }) => ({
            value,
            label: intl.formatMessage(getEducationType(value)),
          })),
        }
      : {}),
    durationPreferences: ["term", "indeterminate"].map((value) => ({
      value,
      label: intl.formatMessage(getEmploymentDuration(value, "short")),
    })),
    availability: enumToOptions(JobLookingStatus).map(({ value }) => ({
      value,
      label: intl.formatMessage(getJobLookingStatus(value, "short")),
    })),
    skillFilter: skillsRes.data?.skills
      .filter(notNullOrUndefined)
      .map(({ id, name }) => ({
        value: id,
        // TODO: Must name and translations be optional in types?
        label: name[locale] || "Error: name not loaded",
      })),
    profileComplete: [yesOption],
    govEmployee: [yesOption],
  };

  // Creates an object keyed with all fields, each with empty array.
  // Unlike Array.prototype.reduce(), creates clear type. Used for defaults.
  const emptyFormValues = mapValues(optionsData, () => []);

  return {
    optionsData,
    emptyFormValues,
    apiResults: {
      skills: skillsRes,
      classifications: classificationsRes,
      pools: poolsRes,
    },
  };
}
