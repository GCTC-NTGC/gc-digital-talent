import { useIntl } from "react-intl";

import {
  notEmpty,
  uniqueItems,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { Chip, Chips } from "@gc-digital-talent/ui";
import {
  getEmploymentDuration,
  getOperationalRequirement,
  getLocale,
  commonMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  ApplicantFilter,
  Classification,
  Maybe,
  Pool,
  PoolCandidateFilter,
} from "@gc-digital-talent/graphql";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import { wrapAbbr } from "~/utils/nameUtils";
import {
  equitySelectionsToDescriptions,
  hasDiplomaToEducationLevel,
  positionDurationToEmploymentDuration,
} from "~/utils/searchRequestUtils";
import talentRequestMessages from "~/messages/talentRequestMessages";

import FilterBlock from "./FilterBlock";

const ApplicantFilters = ({
  applicantFilter,
  selectedClassifications,
}: {
  applicantFilter?: Maybe<ApplicantFilter>;
  selectedClassifications?: Maybe<Pick<Classification, "group" | "level">>[];
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  // else set values if filters prop is of ApplicantFilterInput type
  const classificationsFromBrowserHistory = selectedClassifications?.map(
    (classification) =>
      wrapAbbr(
        `${classification?.group}-${classification && classification?.level < 10 ? "0" : ""}${classification?.level}`,
        intl,
      ),
  );

  const classifications = applicantFilter?.qualifiedClassifications ?? [];
  const classificationsFromApplicantFilter = classifications
    .filter(notEmpty)
    .map((classification) =>
      wrapAbbr(
        `${classification?.group}-${classification?.level < 10 ? "0" : ""}${classification?.level}`,
        intl,
      ),
    );

  const skills: string[] | undefined = applicantFilter?.skills?.map((skill) => {
    return (
      skill?.name[locale] ??
      intl.formatMessage({
        defaultMessage: "Error: skill name not found",
        id: "0T3NB0",
        description:
          "Error message when skill name is not found on request page.",
      })
    );
  });

  const employmentDuration: string | undefined =
    applicantFilter?.positionDuration
      ? intl.formatMessage(
          getEmploymentDuration(
            positionDurationToEmploymentDuration(
              applicantFilter.positionDuration,
            ),
          ),
        )
      : intl.formatMessage({
          defaultMessage: "(None selected)",
          id: "+O6J4u",
          description: "Text shown when the filter was not selected",
        });

  const educationLevel: string | undefined = hasDiplomaToEducationLevel(
    applicantFilter?.hasDiploma,
    intl,
  );

  const employmentEquity = equitySelectionsToDescriptions(
    applicantFilter?.equity,
    intl,
  );

  const operationalRequirementIds = unpackMaybes(
    applicantFilter?.operationalRequirements?.flatMap((req) => req?.value),
  );

  const operationalRequirements: string[] | undefined =
    operationalRequirementIds.map((id) =>
      intl.formatMessage(getOperationalRequirement(id)),
    );
  const languageAbility: string = applicantFilter?.languageAbility?.label
    ? getLocalizedName(applicantFilter.languageAbility.label, intl)
    : intl.formatMessage(commonMessages.anyLanguage);

  const workLocations = unpackMaybes(
    applicantFilter?.locationPreferences?.flatMap(
      (workRegion) => workRegion?.label,
    ),
  ).map((label) => getLocalizedName(label, intl));

  const streams = unpackMaybes(
    applicantFilter?.workStreams?.flatMap((stream) => stream?.name),
  ).map((label) => getLocalizedName(label, intl));

  const communityName: string =
    applicantFilter && applicantFilter.community
      ? getLocalizedName(applicantFilter.community.name, intl)
      : intl.formatMessage({
          defaultMessage: "(None selected)",
          id: "+O6J4u",
          description: "Text shown when the filter was not selected",
        });

  return (
    <section className="grid gap-6 xs:grid-cols-2">
      <div>
        <div>
          <FilterBlock
            title={intl.formatMessage(talentRequestMessages.community)}
            content={communityName}
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Pool requested",
              id: "HXF9GA",
              description:
                "Title for the pool block in the manager info section of the single search request view.",
            })}
            content={
              applicantFilter
                ? applicantFilter?.pools?.filter(notEmpty)?.map((pool) =>
                    getShortPoolTitleHtml(intl, {
                      workStream: pool.workStream,
                      name: pool.name,
                      publishingGroup: pool.publishingGroup,
                      classification: pool.classification,
                    }),
                  )
                : null
            }
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Group and level",
              id: "Rn5e/i",
              description:
                "Title for group and level on summary of filters section",
            })}
            content={uniqueItems(
              classificationsFromBrowserHistory ??
                classificationsFromApplicantFilter,
            )}
          />
          <FilterBlock
            title={intl.formatMessage(talentRequestMessages.stream)}
            content={streams}
          />
          <FilterBlock
            title={intl.formatMessage(
              {
                defaultMessage: "Selected skills ({numOfSkills})",
                id: "159+n7",
                description:
                  "Title for skills section on summary of filters section",
              },
              { numOfSkills: skills?.length ?? 0 },
            )}
            content={
              skills && skills?.length > 0 ? (
                <Chips>
                  {skills.map((skillName) => (
                    <Chip key={skillName} color="secondary">
                      {skillName}
                    </Chip>
                  ))}
                </Chips>
              ) : null
            }
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Education level",
              id: "ftAIM9",
              description:
                "Title for education level on summary of filters section",
            })}
            content={educationLevel}
          />
        </div>
      </div>
      <div>
        <div>
          <FilterBlock
            title={intl.formatMessage(commonMessages.workingLanguageAbility)}
            content={languageAbility}
          />
          {employmentDuration && (
            <FilterBlock
              title={intl.formatMessage(
                talentRequestMessages.employmentDuration,
              )}
              content={employmentDuration}
            />
          )}
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Work location",
              id: "3e965x",
              description:
                "Title for work location section on summary of filters section",
            })}
            content={workLocations}
          />
          <FilterBlock
            title={intl.formatMessage(commonMessages.employmentEquity)}
            content={employmentEquity}
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage:
                "Conditions of employment or operational requirements",
              id: "SNxTm+",
              description:
                "Title for operational requirements section on summary of filters section",
            })}
            content={operationalRequirements}
          />
        </div>
      </div>
    </section>
  );
};

interface SearchRequestFiltersProps {
  filters?: Maybe<ApplicantFilter | PoolCandidateFilter>;
  selectedClassifications?: Maybe<Pick<Classification, "group" | "level">>[];
}

const SearchRequestFilters = ({
  filters,
  selectedClassifications,
}: SearchRequestFiltersProps) => {
  const intl = useIntl();
  let poolCandidateFilter;
  if (filters?.__typename === "ApplicantFilter") {
    return (
      <ApplicantFilters
        applicantFilter={filters}
        selectedClassifications={selectedClassifications}
      />
    );
  }

  if (filters?.__typename === "PoolCandidateFilter") {
    poolCandidateFilter = filters;
  }

  const classifications: string[] | undefined =
    poolCandidateFilter?.classifications?.map(
      (classification) =>
        `${classification?.group.toLocaleUpperCase()}-${classification && classification?.level < 10 ? "0" : ""}${classification?.level}`,
    );

  const pools: Pool[] | undefined = poolCandidateFilter
    ? poolCandidateFilter?.pools?.filter(notEmpty)
    : [];

  const streams = pools?.map(({ workStream }) =>
    getLocalizedName(workStream?.name, intl, true),
  );

  const educationLevel: string | undefined = poolCandidateFilter?.hasDiploma
    ? intl.formatMessage({
        defaultMessage: "Required diploma from post-secondary institution",
        id: "/mFrpj",
        description:
          "Education level message when candidate has a diploma found on the request page.",
      })
    : intl.formatMessage({
        defaultMessage:
          "Can accept a combination of work experience and education",
        id: "9DCx2n",
        description:
          "Education level message when candidate does not have a diploma found on the request page.",
      });
  const employmentEquity: string[] | undefined = [
    ...(poolCandidateFilter?.equity?.isWoman
      ? [
          intl.formatMessage({
            defaultMessage: "Woman",
            id: "/fglL0",
            description:
              "Message for woman option in the employment equity section of the request page.",
          }),
        ]
      : []),
    ...(poolCandidateFilter?.equity?.isVisibleMinority
      ? [
          intl.formatMessage({
            defaultMessage: "Visible Minority",
            id: "4RK/oW",
            description:
              "Message for visible minority option in the employment equity section of the request page.",
          }),
        ]
      : []),
    ...(poolCandidateFilter?.equity?.isIndigenous
      ? [
          intl.formatMessage({
            defaultMessage: "Indigenous",
            id: "YoIRbn",
            description: "Title for Indigenous",
          }),
        ]
      : []),
    ...(poolCandidateFilter?.equity?.hasDisability
      ? [
          intl.formatMessage({
            defaultMessage: "Disability",
            id: "GHlK/f",
            description:
              "Message for disability option in the employment equity section of the request page.",
          }),
        ]
      : []),
  ];

  const operationalRequirementIds = unpackMaybes(
    poolCandidateFilter?.operationalRequirements?.flatMap((req) => req?.value),
  );

  const operationalRequirements: string[] | undefined =
    operationalRequirementIds.map((id) =>
      intl.formatMessage(getOperationalRequirement(id)),
    );

  const workLocations = unpackMaybes(
    poolCandidateFilter?.workRegions
      ?.flatMap((workRegion) => workRegion?.label)
      .map((label) => getLocalizedName(label, intl)),
  );

  const languageAbility = poolCandidateFilter?.languageAbility?.label
    ? getLocalizedName(poolCandidateFilter.languageAbility.label, intl)
    : intl.formatMessage(commonMessages.anyLanguage);

  return (
    <section>
      <div>
        <div className="grid gap-6 xs:grid-cols-2">
          <div>
            <FilterBlock
              title={intl.formatMessage({
                defaultMessage: "Pool requested",
                id: "HXF9GA",
                description:
                  "Title for the pool block in the manager info section of the single search request view.",
              })}
              content={
                pools
                  ? pools.map((pool) =>
                      getShortPoolTitleHtml(intl, {
                        workStream: pool.workStream,
                        name: pool.name,
                        publishingGroup: pool.publishingGroup,
                        classification: pool.classification,
                      }),
                    )
                  : null
              }
            />
            <FilterBlock
              title={intl.formatMessage({
                defaultMessage: "Group and level",
                id: "Rn5e/i",
                description:
                  "Title for group and level on summary of filters section",
              })}
              content={classifications}
            />
            <FilterBlock
              title={intl.formatMessage(talentRequestMessages.stream)}
              content={streams}
            />
            <FilterBlock
              title={intl.formatMessage({
                defaultMessage: "Education level",
                id: "ftAIM9",
                description:
                  "Title for education level on summary of filters section",
              })}
              content={educationLevel}
            />
          </div>
          <div>
            <div>
              <FilterBlock
                title={intl.formatMessage(
                  commonMessages.workingLanguageAbility,
                )}
                content={languageAbility}
              />
              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage: "Work location",
                  id: "3e965x",
                  description:
                    "Title for work location section on summary of filters section",
                })}
                content={workLocations}
              />

              <FilterBlock
                title={intl.formatMessage(commonMessages.employmentEquity)}
                content={employmentEquity}
              />
              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage:
                    "Conditions of employment or operational requirements",
                  id: "SNxTm+",
                  description:
                    "Title for operational requirements section on summary of filters section",
                })}
                content={operationalRequirements}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchRequestFilters;
