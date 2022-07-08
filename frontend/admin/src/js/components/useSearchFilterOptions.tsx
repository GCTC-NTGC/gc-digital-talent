import {
  getWorkRegion,
  getEmploymentDuration,
  getLanguageAbility,
  getOperationalRequirement,
  // getEducationType,
} from "@common/constants/localizedConstants";
import { enumToOptions } from "@common/helpers/formUtils";
import mapValues from "lodash/mapValues";
import { useIntl } from "react-intl";
import useLocale from "./useLocale";
import {
  WorkRegion,
  OperationalRequirement,
  // EducationType,
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

export default function useSearchFilterOptions() {
  const intl = useIntl();
  const locale = useLocale();
  // TODO: Implement way to return `fetching` states from hook, so that can pass
  // to react-select's `isLoading` prop on <Select />.
  // See: https://react-select.com/props#select-props
  const [{ data: skillsData }] = useAllSkillsQuery();
  const [{ data: classificationsData }] = useGetClassificationsQuery();
  const [{ data: poolsData }] = useGetPoolsQuery();

  const yesOption = {
    value: "true",
    // No description since common term that can be de-duplicated by FormatJS.
    label: intl.formatMessage({ defaultMessage: "Yes" }),
  };

  const optionsData = {
    pools: poolsData?.pools.filter(notNullOrUndefined).map(({ id, name }) => ({
      value: id,
      // TODO: Must name and translations be optional in types?
      label: name?.[locale] || "Error: name not loaded",
    })),
    languages: enumToOptions(LanguageAbility).map(({ value }) => ({
      value,
      label: intl.formatMessage(getLanguageAbility(value)),
    })),
    classifications: classificationsData?.classifications
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
    // educationTypes: enumToOptions(EducationType).map(({ value }) => ({
    //   value,
    //   label: intl.formatMessage(getEducationType(value)),
    // })),
    durationPreferences: ["term", "indeterminate"].map((value) => ({
      value,
      label: intl.formatMessage(getEmploymentDuration(value, "short")),
    })),
    // TODO: Localize these.
    availability: enumToOptions(JobLookingStatus),
    skillFilter: skillsData?.skills
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

  return { optionsData, emptyFormValues };
}
