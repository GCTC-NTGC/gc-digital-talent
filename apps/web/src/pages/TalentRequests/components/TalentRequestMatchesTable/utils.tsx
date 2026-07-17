import type { SortingState } from "@tanstack/react-table";
import type { IntlShape } from "react-intl";

import {
  getFragment,
  graphql,
  SortOrder,
  type AdvancedOrderByInput,
  type FragmentType,
  type LocalizedProvinceOrTerritory,
  type TalentRequestMatchFilterInput,
} from "@gc-digital-talent/graphql";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { getLocale } from "@gc-digital-talent/i18n";

import {
  durationToEnumPositionDuration,
  positionDurationToEmploymentDuration,
} from "~/utils/userUtils";

import type { FormValues } from "./TalentRequestMatchesFilterDialog";

export const locationAccessor = (
  city?: string | null,
  provinceOrTerritory?: Partial<LocalizedProvinceOrTerritory> | null,
): string | null => {
  if (!city && !provinceOrTerritory) return null;
  const strings: string[] = [];

  if (city) {
    strings.push(city);
  }

  if (provinceOrTerritory?.label?.localized) {
    strings.push(provinceOrTerritory.label.localized);
  }

  return strings.join(", ");
};

export const TalentRequestMatchesApplicantFilter_Fragment = graphql(
  /** GraphQL */ `
    fragment TalentRequestMatchesApplicantFilter on ApplicantFilter {
      languageAbility {
        value
      }
      locationPreferences {
        value
      }
      operationalRequirements {
        value
      }
      flexibleWorkLocations {
        value
      }
      equity {
        isWoman
        hasDisability
        isIndigenous
        isVisibleMinority
      }
      qualifiedInClassifications {
        group
        level
      }
      qualifiedInWorkStreams {
        id
      }
      pools {
        id
      }
      skills {
        id
      }
      positionDuration
      talentSources {
        value
      }
    }
  `,
);

export function transformApplicantFilterToFormValues(
  query:
    | FragmentType<typeof TalentRequestMatchesApplicantFilter_Fragment>
    | null
    | undefined,
): FormValues {
  const applicantFilter = getFragment(
    TalentRequestMatchesApplicantFilter_Fragment,
    query,
  );

  return {
    classifications: unpackMaybes(
      applicantFilter?.qualifiedInClassifications,
    ).map(({ group, level }) => `${group}-${level}`),
    streams: unpackMaybes(applicantFilter?.qualifiedInWorkStreams).map(
      ({ id }) => id,
    ),
    pools: unpackMaybes(applicantFilter?.pools).map(({ id }) => id),
    languageAbility: applicantFilter?.languageAbility?.value ?? "",
    equity: applicantFilter?.equity
      ? [
          ...(applicantFilter.equity.isWoman ? ["isWoman"] : []),
          ...(applicantFilter.equity.hasDisability ? ["hasDisability"] : []),
          ...(applicantFilter.equity.isIndigenous ? ["isIndigenous"] : []),
          ...(applicantFilter.equity.isVisibleMinority
            ? ["isVisibleMinority"]
            : []),
        ]
      : [],
    operationalRequirements: unpackMaybes(
      applicantFilter?.operationalRequirements,
    ).map(({ value }) => value),
    flexibleWorkLocations: unpackMaybes(
      applicantFilter?.flexibleWorkLocations,
    ).map(({ value }) => value),
    workRegions: unpackMaybes(applicantFilter?.locationPreferences).map(
      ({ value }) => value,
    ),
    skills: unpackMaybes(applicantFilter?.skills).map(({ id }) => id),
    priorityWeight: [],
    govEmployee: [],
    departments: [],
    employmentDuration:
      positionDurationToEmploymentDuration(applicantFilter?.positionDuration) ??
      "",
    talentSources: unpackMaybes(applicantFilter?.talentSources).map(
      ({ value }) => value,
    ),
  };
}

export function transformWhereToFormValues(
  input: TalentRequestMatchFilterInput | undefined,
): FormValues {
  const applicantFilter = input?.applicantFilter;

  return {
    classifications:
      applicantFilter?.qualifiedInClassifications
        ?.filter(notEmpty)
        .map(({ group, level }) => `${group}-${level}`) ?? [],
    streams:
      applicantFilter?.qualifiedInWorkStreams
        ?.filter(notEmpty)
        .map(({ id }) => id) ?? [],
    pools: applicantFilter?.pools?.filter(notEmpty).map(({ id }) => id) ?? [],
    languageAbility: applicantFilter?.languageAbility ?? "",
    equity: applicantFilter?.equity
      ? [
          ...(applicantFilter.equity.isWoman ? ["isWoman"] : []),
          ...(applicantFilter.equity.hasDisability ? ["hasDisability"] : []),
          ...(applicantFilter.equity.isIndigenous ? ["isIndigenous"] : []),
          ...(applicantFilter.equity.isVisibleMinority
            ? ["isVisibleMinority"]
            : []),
        ]
      : [],
    operationalRequirements: unpackMaybes(
      applicantFilter?.operationalRequirements,
    ),
    flexibleWorkLocations: unpackMaybes(applicantFilter?.flexibleWorkLocations),
    workRegions: unpackMaybes(applicantFilter?.locationPreferences),
    skills: applicantFilter?.skills?.filter(notEmpty).map(({ id }) => id) ?? [],
    priorityWeight: unpackMaybes(input?.priorityWeight),
    govEmployee: unpackMaybes(input?.employeeVerification),
    departments: unpackMaybes(input?.departments),
    employmentDuration:
      positionDurationToEmploymentDuration(applicantFilter?.positionDuration) ??
      "",
    talentSources: unpackMaybes(applicantFilter?.talentSources),
  };
}

export function transformFormValuesToWhere(
  data: FormValues,
): TalentRequestMatchFilterInput {
  return {
    applicantFilter: {
      // NOTE: we do want to treat an empty string as unset
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      languageAbility: data.languageAbility || undefined,
      operationalRequirements: data.operationalRequirements,
      locationPreferences: data.workRegions,
      flexibleWorkLocations: data.flexibleWorkLocations,
      equity: {
        ...(data.equity?.includes("isWoman") && { isWoman: true }),
        ...(data.equity?.includes("hasDisability") && { hasDisability: true }),
        ...(data.equity?.includes("isIndigenous") && { isIndigenous: true }),
        ...(data.equity?.includes("isVisibleMinority") && {
          isVisibleMinority: true,
        }),
      },
      pools: data.pools?.map((id) => ({ id })),
      skills: data.skills?.map((id) => ({ id })),
      qualifiedInClassifications: data.classifications?.map(
        (classification) => {
          const [group, level] = classification.split("-");
          return { group, level: Number(level) };
        },
      ),
      qualifiedInWorkStreams: data.streams?.map((id) => ({ id })),
      positionDuration: data.employmentDuration
        ? unpackMaybes([
            durationToEnumPositionDuration(data.employmentDuration),
          ])
        : undefined,
      talentSources: data.talentSources,
    },
    priorityWeight: data.priorityWeight,
    employeeVerification: data.govEmployee,
    departments: data.departments,
  };
}

// Merge the search bar term into the filter state, routing it to the scope
// matching the selected column (search type === column id); no type → general search.
export function addSearchToWhere(
  where: TalentRequestMatchFilterInput,
  term: string | undefined,
  type: string | undefined,
): TalentRequestMatchFilterInput {
  const hasTerm = !!term;

  return {
    ...where,
    generalSearch: hasTerm && !type ? term : undefined,
    name: hasTerm && type === "name" ? term : undefined,
    email: hasTerm && type === "email" ? term : undefined,
  };
}

export function transformSortStateToOrderBy(
  sortState: SortingState,
  intl: IntlShape,
): AdvancedOrderByInput[] | undefined {
  if (!sortState.length) return undefined;

  const [rule] = sortState;
  const direction = rule.desc ? SortOrder.Desc : SortOrder.Asc;

  switch (rule.id) {
    case "skillCount":
      return [{ scope: "orderBySkillCount", direction }];
    case "name":
      return [
        { column: "first_name", direction },
        { column: "last_name", direction },
      ];
    case "email":
      return [{ column: "email", direction }];
    case "location":
      return [{ column: "current_city", direction }];
    case "department":
      return [
        {
          relation: { name: "department", column: `name->${getLocale(intl)}` },
          direction,
        },
      ];
    default:
      return undefined;
  }
}
