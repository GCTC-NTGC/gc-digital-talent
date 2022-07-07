import {
  getLanguage,
  getWorkRegion,
} from "@common/constants/localizedConstants";
import { enumToOptions } from "@common/helpers/formUtils";
import mapValues from "lodash/mapValues";
import { useIntl } from "react-intl";
import {
  WorkRegion,
  OperationalRequirement,
  JobLookingStatus,
  GovEmployeeType,
  Language,
} from "../api/generated";

const generateOptionsFromValues = (item: string) => ({
  label: item,
  value: item.toLowerCase().replace(" ", "-"),
});

export default function useSearchFilterOptions() {
  const { formatMessage } = useIntl();

  const optionsData = {
    pools: [
      "Digital Talent",
      "Women in STEM",
      "Indigenous Apprenticeship Program",
    ].map(generateOptionsFromValues),
    languages: enumToOptions(Language).map(({ value }) => ({
      value,
      label: formatMessage(getLanguage(value)),
    })),
    classifications: ["CS-01", "CS-02", "CS-03", "CS-04", "CS-05"].map(
      generateOptionsFromValues,
    ),
    workPreferences: enumToOptions(OperationalRequirement),
    workLocations: enumToOptions(WorkRegion).map(({ value }) => ({
      value,
      label: formatMessage(getWorkRegion(value)),
    })),
    durationPreferences: ["Term", "Indeterminate"].map(
      generateOptionsFromValues,
    ),
    availability: enumToOptions(JobLookingStatus),
    skillFilter: ["Data Analysis", "Data Cleaning", "Database Design"].map(
      generateOptionsFromValues,
    ),
    profileComplete: ["Yes", "No"].map(generateOptionsFromValues),
    govEmployee: enumToOptions(GovEmployeeType),
  };

  const emptyFormValues = mapValues(optionsData, (val) => []);

  return { optionsData, emptyFormValues };
}
