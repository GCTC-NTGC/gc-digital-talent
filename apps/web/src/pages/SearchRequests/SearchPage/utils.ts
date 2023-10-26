import pick from "lodash/pick";
import { IntlShape, MessageDescriptor } from "react-intl";

import { unpackMaybes } from "@gc-digital-talent/forms";
import {
  ApplicantFilterInput,
  Classification,
  CountApplicantsQueryVariables,
  LanguageAbility,
  Maybe,
  Pool,
  PositionDuration,
} from "@gc-digital-talent/graphql";
import { EmploymentDuration } from "@gc-digital-talent/i18n";
import { hasKey, notEmpty } from "@gc-digital-talent/helpers";

import { SimpleClassification, SimplePool } from "~/types/pool";
import { FormValues, NullSelection } from "~/types/searchRequest";
import { poolMatchesClassification } from "~/utils/poolUtils";
import nonExecutiveITClassifications from "~/constants/nonExecutiveITClassifications";

export const positionDurationToEmploymentDuration = (
  durations: Maybe<PositionDuration>[],
): string => {
  if (durations && durations.includes(PositionDuration.Temporary)) {
    return EmploymentDuration.Term;
  }
  return EmploymentDuration.Indeterminate;
};

export const applicantFilterToQueryArgs = (
  filter?: ApplicantFilterInput,
  poolId?: string,
): CountApplicantsQueryVariables => {
  /* We must pick only the fields belonging to ApplicantFilterInput, because its possible
     the data object contains other props at runtime, and this will cause the
     graphql operation to fail.
  */
  // Apply pick to each element of an array.
  function pickMap<T, K extends keyof T>(
    list: Maybe<Maybe<T>[]> | null | undefined,
    keys: K | K[],
  ): Pick<T, K>[] | undefined {
    return unpackMaybes(list).map(
      (item) => pick(item, keys) as Pick<T, K>, // I think this type coercion is safe? But I'm not sure why its not the default...
    );
  }

  if (filter !== null || undefined)
    return {
      where: {
        ...filter,
        equity: { ...filter?.equity },
        qualifiedClassifications: filter?.qualifiedClassifications
          ? pickMap(filter.qualifiedClassifications, ["group", "level"])
          : undefined,
        skills: filter?.skills ? pickMap(filter.skills, "id") : undefined,
        hasDiploma: null, // disconnect education selection for useCountApplicantsAndCountPoolCandidatesByPoolQuery

        // Override the filter's pool if one is provided separately.
        pools: poolId ? [{ id: poolId }] : pickMap(filter?.pools, "id"),
      },
    };
  return {};
};

export const dataToFormValues = (
  data: ApplicantFilterInput,
  selectedClassifications?: Maybe<SimpleClassification[]>,
  pools?: SimplePool[],
): FormValues => {
  const dataPoolsSafe = data.pools ? data.pools : [];
  const poolsSafe = pools ? pools.filter(notEmpty) : [];

  const poolMap = new Map(poolsSafe.map((pool) => [pool.id, pool]));
  return {
    classification: selectedClassifications
      ? `${selectedClassifications[0].group}-0${selectedClassifications[0].level}`
      : "",
    languageAbility: data?.languageAbility
      ? data?.languageAbility
      : "NULL_SELECTION",
    employmentEquity: data.equity
      ? [
          ...(data.equity.hasDisability ? ["hasDisability"] : []),
          ...(data.equity.isIndigenous ? ["isIndigenous"] : []),
          ...(data.equity.isVisibleMinority ? ["isVisibleMinority"] : []),
          ...(data.equity.isWoman ? ["isWoman"] : []),
        ]
      : [],
    educationRequirement: data.hasDiploma ? "has_diploma" : "no_diploma",
    skills: data.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    stream: dataPoolsSafe[0]
      ? poolMap.get(dataPoolsSafe[0].id)?.stream || ""
      : "",
    locationPreferences: data.locationPreferences?.filter(notEmpty) ?? [],
    operationalRequirements:
      data.operationalRequirements?.filter(notEmpty) ?? [],
    employmentDuration: data.positionDuration
      ? positionDurationToEmploymentDuration(data.positionDuration)
      : "",
  };
};

export function mapObjectsByKey<T>(
  keyFunction: (t: T) => string,
  objects: T[],
): Map<string, T> {
  return objects.reduce((map, obj) => {
    map.set(keyFunction(obj), obj);
    return map;
  }, new Map());
}

export const classificationToKey = (classification: SimpleClassification) =>
  `${classification.group}-0${classification.level}`;

export const durationSelectionToEnum = (
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

export const formValuesToData = (
  values: FormValues,
  pools: Pool[],
  classificationMap: Map<string, SimpleClassification>,
): ApplicantFilterInput => {
  const selectedClassification = values.classification
    ? classificationMap.get(values.classification)
    : undefined;

  return {
    qualifiedClassifications: [selectedClassification],
    skills: values.skills
      ? values.skills
          .filter((id) => !!id)
          .map((id) => ({
            id,
          }))
      : [],
    operationalRequirements: values.operationalRequirements
      ? unpackMaybes(values.operationalRequirements)
      : [],
    hasDiploma: values.educationRequirement === "has_diploma",
    equity: {
      hasDisability:
        values.employmentEquity &&
        values.employmentEquity?.includes("hasDisability"),
      isIndigenous:
        values.employmentEquity &&
        values.employmentEquity?.includes("isIndigenous"),
      isVisibleMinority:
        values.employmentEquity &&
        values.employmentEquity?.includes("isVisibleMinority"),
      isWoman:
        values.employmentEquity && values.employmentEquity?.includes("isWoman"),
    },
    ...(values.languageAbility !== NullSelection
      ? { languageAbility: values.languageAbility as LanguageAbility }
      : {}), // Ensure null in FormValues is converted to undefined
    positionDuration: values.employmentDuration
      ? durationSelectionToEnum(values.employmentDuration)
      : null,
    locationPreferences: values.locationPreferences || [],
    qualifiedStreams: values.stream ? [values.stream] : undefined,
    pools: pools
      ? pools
          .filter(notEmpty)
          .filter(
            (pool) =>
              selectedClassification === undefined || // If a classification hasn't been selected yet, do not filter out any pools.
              poolMatchesClassification(pool, selectedClassification),
          )
          .filter(
            (pool) =>
              values.stream === "" || // If a stream hasn't been selected yet, do not filter out any pools.
              pool.stream === values.stream,
          )
      : [],
  };
};

export const getAvailableClassifications = (
  pools: Pool[],
): Classification[] => {
  const availableClassifications = pools
    ?.flatMap((pool) => pool?.classifications)
    .filter(notEmpty)
    .reduce((currentClassifications, classification) => {
      let newClassifications = [...currentClassifications];
      const includesClassification = newClassifications.find(
        (c) => c.id === classification.id,
      );
      if (!includesClassification) {
        newClassifications = [...newClassifications, classification];
      }

      return newClassifications;
    }, [] as Classification[]);

  const ITClassifications = nonExecutiveITClassifications();

  return availableClassifications.filter((classification) => {
    return ITClassifications.some(
      (x) =>
        x?.group === classification?.group &&
        x?.level === classification?.level,
    );
  });
};

export const applicantFilterIncludesPools = (
  filter: ApplicantFilterInput,
): boolean => {
  return (
    notEmpty(filter) &&
    notEmpty(filter.pools) &&
    filter.pools.filter(notEmpty).length > 0
  );
};

export const getClassificationLabel = (
  { group, level }: Classification,
  labels: Record<string, MessageDescriptor>,
  intl: IntlShape,
) => {
  const key = `${group}-0${level}`;
  return !hasKey(labels, key) ? key : intl.formatMessage(labels[key]);
};
