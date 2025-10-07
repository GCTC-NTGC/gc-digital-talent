import { IntlShape } from "react-intl";

import {
  unpackMaybes,
  empty,
  notEmpty,
  emptyToNull,
} from "@gc-digital-talent/helpers";
import { commonMessages, EmploymentDuration } from "@gc-digital-talent/i18n";
import {
  ApplicantFilterInput,
  Classification,
  CandidateCountQueryVariables,
  Maybe,
  PositionDuration,
  FlexibleWorkLocation,
} from "@gc-digital-talent/graphql";

import { FormValues, NullSelection } from "~/types/searchRequest";
import {
  formatClassificationAriaString,
  formatClassificationString,
} from "~/utils/poolUtils";
import { positionDurationToEmploymentDuration } from "~/utils/searchRequestUtils";

export const getClassificationLabel = (
  {
    group,
    level,
    name: genericName,
    displayName,
  }: Pick<Classification, "group" | "level" | "name" | "displayName">,
  intl: IntlShape,
) => {
  const groupAndLevel = formatClassificationString({ group, level });
  const separator = intl.formatMessage(commonMessages.dividingColon);
  const name =
    emptyToNull(displayName?.localized) ?? emptyToNull(genericName?.localized);

  if (name) {
    return `${groupAndLevel}${separator}${name}`;
  }
  return groupAndLevel;
};

export const getClassificationAriaLabel = ({
  group,
  level,
  name: genericName,
  displayName,
}: Pick<Classification, "group" | "level" | "name" | "displayName">) => {
  const groupAndLevel = formatClassificationAriaString({ group, level });
  const separator = " ";
  const name =
    emptyToNull(displayName?.localized) ?? emptyToNull(genericName?.localized);

  if (name) {
    return `${name}${separator}${groupAndLevel}`;
  }
  return groupAndLevel;
};

/**
 * Derive the currently selected classification
 * from applicant filters and location state.
 *
 * As well as transforming it to a useable string.
 * @param {Maybe<Classification[]>} selectedClassifications
 * @returns {string}
 */
const getCurrentClassification = (
  selectedClassifications?: Maybe<Pick<Classification, "group" | "level">[]>,
): string => {
  return selectedClassifications && selectedClassifications?.length > 0
    ? formatClassificationString(selectedClassifications[0])
    : "";
};

const durationSelectionToEnum = (
  selection: string | null,
): PositionDuration[] | null => {
  if (selection && selection === EmploymentDuration.Term) {
    return [PositionDuration.Temporary];
  }
  if (selection && selection === EmploymentDuration.Indeterminate) {
    return [PositionDuration.Permanent];
  }
  return null;
};

/**
 * Massage the current filters into a shape
 * that will be accepted by the API.
 *
 * Omits some fields we do not want impacting results.
 */
export const applicantFilterToQueryArgs = (
  filter?: ApplicantFilterInput,
  poolId?: string,
): CandidateCountQueryVariables => {
  if (empty(filter)) {
    return {};
  }

  // always append ONSITE to the flexible locations region
  const adjustedFlexibleWorkLocations = [
    ...(filter.flexibleWorkLocations ?? []),
    FlexibleWorkLocation.Onsite,
  ];

  /* We must pick only the fields belonging to ApplicantFilterInput, because its possible
     the data object contains other props at runtime, and this will cause the
     graphql operation to fail.
  */
  return {
    where: {
      ...filter,
      equity: filter?.equity,
      qualifiedInClassifications: filter?.qualifiedInClassifications
        ? unpackMaybes(filter.qualifiedInClassifications).flatMap(
            ({ group, level }) => ({ group, level }),
          )
        : undefined,
      skills: filter?.skills
        ? unpackMaybes(filter.skills).flatMap(({ id }) => ({ id }))
        : undefined,
      hasDiploma: undefined, // disconnect education selection for CountApplicants_Query

      // Override the filter's pool if one is provided separately.
      flexibleWorkLocations: unpackMaybes(adjustedFlexibleWorkLocations),
      pools: poolId
        ? [{ id: poolId }]
        : unpackMaybes(filter?.pools).flatMap(({ id }) => ({ id })),
    },
  };
};

/**
 * Transform data from location state, API and filters
 * to a shape useable by `react-hook-form`
 *
 * @param data
 * @param selectedClassifications
 * @param pools
 * @returns {FormValues}
 */
export const dataToFormValues = (
  data: ApplicantFilterInput,
  selectedClassifications?: Maybe<Pick<Classification, "group" | "level">[]>,
): FormValues => {
  const stream = data?.qualifiedInWorkStreams?.find(notEmpty);

  return {
    classification: getCurrentClassification(selectedClassifications),
    languageAbility: data?.languageAbility ?? "NULL_SELECTION",
    employmentEquity: [
      ...(data?.equity?.hasDisability ? ["hasDisability"] : []),
      ...(data?.equity?.isIndigenous ? ["isIndigenous"] : []),
      ...(data?.equity?.isVisibleMinority ? ["isVisibleMinority"] : []),
      ...(data?.equity?.isWoman ? ["isWoman"] : []),
    ],
    educationRequirement: data.hasDiploma ? "has_diploma" : "no_diploma",
    skills: data.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    stream: stream?.id ?? "",
    locationPreferences: data.locationPreferences?.filter(notEmpty) ?? [],
    flexibleWorkLocations: data.flexibleWorkLocations?.filter(notEmpty) ?? [],
    operationalRequirements:
      data.operationalRequirements?.filter(notEmpty) ?? [],
    employmentDuration: data.positionDuration
      ? positionDurationToEmploymentDuration(data.positionDuration)
      : "",
    allPools: false,
  };
};

/**
 * Massage the current filters into a shape
 * that will be accepted by the API. (full object)
 *
 * @param values
 * @param pools
 * @param classifications
 * @returns
 */
export const formValuesToData = (
  values: FormValues,
  classifications: Pick<Classification, "group" | "level" | "id">[],
): ApplicantFilterInput => {
  const selectedClassification = classifications.find((classification) => {
    return formatClassificationString(classification) === values.classification;
  });

  return {
    qualifiedInClassifications: [selectedClassification].filter(notEmpty),
    skills: values.skills
      ? values.skills
          .filter((id) => !!id)
          .map((id) => ({
            id,
          }))
      : [],
    operationalRequirements: unpackMaybes(values.operationalRequirements),
    hasDiploma: values.educationRequirement === "has_diploma",
    ...(values.employmentEquity?.length && {
      equity: {
        hasDisability: values.employmentEquity?.includes("hasDisability"),
        isIndigenous: values.employmentEquity?.includes("isIndigenous"),
        isVisibleMinority:
          values.employmentEquity?.includes("isVisibleMinority"),
        isWoman: values.employmentEquity?.includes("isWoman"),
      },
    }),
    ...(values.languageAbility !== NullSelection
      ? { languageAbility: values.languageAbility }
      : {}), // Ensure null in FormValues is converted to undefined
    positionDuration: values.employmentDuration
      ? durationSelectionToEnum(values.employmentDuration)
      : undefined,
    locationPreferences: values.locationPreferences ?? [],
    flexibleWorkLocations: values.flexibleWorkLocations ?? [],
    qualifiedInWorkStreams: values.stream ? [{ id: values.stream }] : undefined,
  };
};
