import * as React from "react";
import { useIntl } from "react-intl";

import { notEmpty, uniqueItems } from "@gc-digital-talent/helpers";
import { Chip, Chips } from "@gc-digital-talent/ui";
import {
  getEmploymentDuration,
  getLanguageAbility,
  getOperationalRequirement,
  getWorkRegion,
  getLocale,
  getPoolStream,
  commonMessages,
} from "@gc-digital-talent/i18n";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import { wrapAbbr } from "~/utils/nameUtils";
import {
  ApplicantFilter,
  Classification,
  Maybe,
  Pool,
  PoolCandidateFilter,
} from "~/api/generated";
import { positionDurationToEmploymentDuration } from "~/utils/searchRequestUtils";
import processMessages from "~/messages/processMessages";

import FilterBlock from "./FilterBlock";

type SimpleClassification = Pick<Classification, "group" | "level">;

const ApplicantFilters = ({
  applicantFilter,
  selectedClassifications,
}: {
  applicantFilter?: Maybe<ApplicantFilter>;
  selectedClassifications?: Maybe<SimpleClassification>[];
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  // else set values if filters prop is of ApplicantFilterInput type
  const classificationsFromBrowserHistory = selectedClassifications?.map(
    (classification) =>
      wrapAbbr(`${classification?.group}-0${classification?.level}`, intl),
  );

  const classifications = applicantFilter?.qualifiedClassifications || [];
  const classificationsFromApplicantFilter = classifications
    .filter(notEmpty)
    .map((classification) =>
      wrapAbbr(`${classification?.group}-0${classification?.level}`, intl),
    );

  const skills: string[] | undefined = applicantFilter?.skills?.map((skill) => {
    return (
      skill?.name[locale] ||
      intl.formatMessage({
        defaultMessage: "Error: skill name not found",
        id: "0T3NB0",
        description:
          "Error message when skill name is not found on request page.",
      })
    );
  });

  const employmentDuration: string | undefined =
    applicantFilter && applicantFilter.positionDuration
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

  const employmentEquity: string[] | undefined = [
    ...(applicantFilter?.equity?.isWoman
      ? [
          intl.formatMessage({
            defaultMessage: "Woman",
            id: "/fglL0",
            description:
              "Message for woman option in the employment equity section of the request page.",
          }),
        ]
      : []),
    ...(applicantFilter?.equity?.isVisibleMinority
      ? [
          intl.formatMessage({
            defaultMessage: "Visible Minority",
            id: "4RK/oW",
            description:
              "Message for visible minority option in the employment equity section of the request page.",
          }),
        ]
      : []),
    ...(applicantFilter?.equity?.isIndigenous
      ? [
          intl.formatMessage({
            defaultMessage: "Indigenous",
            id: "YoIRbn",
            description: "Title for Indigenous",
          }),
        ]
      : []),
    ...(applicantFilter?.equity?.hasDisability
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
  const operationalRequirementIds: string[] =
    (applicantFilter?.operationalRequirements as string[]) ?? [];
  const operationalRequirements: string[] | undefined =
    operationalRequirementIds.map((id) =>
      intl.formatMessage(getOperationalRequirement(id)),
    );
  const languageAbility: string = applicantFilter?.languageAbility
    ? intl.formatMessage(getLanguageAbility(applicantFilter?.languageAbility))
    : intl.formatMessage({
        defaultMessage: "Any language",
        id: "/jDW4V",
        description: "Label for the any language option",
      });

  const workLocationIds: string[] =
    (applicantFilter?.locationPreferences as string[]) ?? [];
  const workLocations: string[] | undefined = workLocationIds.map((id) =>
    intl.formatMessage(getWorkRegion(id)),
  );

  return (
    <section data-h2-flex-grid="base(flex-start, x2, x.5)">
      <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
        <div>
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Pool Requested",
              id: "rz8uPO",
              description:
                "Title for the pool block in the manager info section of the single search request view.",
            })}
            content={
              applicantFilter
                ? applicantFilter?.pools?.map((pool) =>
                    getShortPoolTitleHtml(intl, pool),
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
              classificationsFromBrowserHistory ||
                classificationsFromApplicantFilter,
            )}
          />
          <FilterBlock
            title={intl.formatMessage(processMessages.stream)}
            content={
              applicantFilter?.qualifiedStreams?.map((stream) => {
                return intl.formatMessage(getPoolStream(stream as string));
              }) ?? []
            }
          />
          <FilterBlock
            title={intl.formatMessage(
              {
                defaultMessage: "Selected skills ({numOfSkills})",
                id: "159+n7",
                description:
                  "Title for skills section on summary of filters section",
              },
              { numOfSkills: skills?.length || 0 },
            )}
          >
            <Chips>
              {skills && skills.length > 0 ? (
                skills.map((skillName) => {
                  return (
                    <Chip
                      key={skillName}
                      label={skillName}
                      color="primary"
                      mode="outline"
                    />
                  );
                })
              ) : (
                <ul data-h2-color="base(black)">
                  <li>
                    {intl.formatMessage({
                      defaultMessage: "(None selected)",
                      id: "+O6J4u",
                      description:
                        "Text shown when the filter was not selected",
                    })}
                  </li>
                </ul>
              )}
            </Chips>
          </FilterBlock>
        </div>
      </div>
      <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
        <div>
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Work language ability",
              id: "VX3Og5",
              description:
                "Title for work language on summary of filters section",
            })}
            content={languageAbility}
          />
          {employmentDuration && (
            <FilterBlock
              title={intl.formatMessage({
                defaultMessage: "Employment duration",
                description: "Title for Employment duration section",
                id: "Muh/+P",
              })}
              content={employmentDuration}
            />
          )}
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Work Location",
              id: "MWZgsB",
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
                "Conditions of employment / Operational requirements",
              id: "cMsRgt",
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
  selectedClassifications?: Maybe<SimpleClassification>[];
}

const SearchRequestFilters = ({
  filters,
  selectedClassifications,
}: SearchRequestFiltersProps) => {
  const intl = useIntl();
  let poolCandidateFilter;
  // eslint-disable-next-line no-underscore-dangle
  if (filters?.__typename === "ApplicantFilter") {
    return (
      <ApplicantFilters
        applicantFilter={filters}
        selectedClassifications={selectedClassifications}
      />
    );
  }

  // eslint-disable-next-line no-underscore-dangle
  if (filters?.__typename === "PoolCandidateFilter") {
    poolCandidateFilter = filters;
  }

  const classifications: string[] | undefined =
    poolCandidateFilter?.classifications?.map(
      (classification) =>
        `${classification?.group.toLocaleUpperCase()}-0${classification?.level}`,
    );

  const pools: Pool[] | undefined = poolCandidateFilter
    ? poolCandidateFilter?.pools?.filter(notEmpty)
    : [];

  const streams = pools?.map((pool) =>
    pool.stream ? intl.formatMessage(getPoolStream(pool.stream)) : "",
  );

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
  const operationalRequirementIds: string[] =
    (poolCandidateFilter?.operationalRequirements as string[]) ?? [];
  const operationalRequirements: string[] | undefined =
    operationalRequirementIds.map((id) =>
      intl.formatMessage(getOperationalRequirement(id)),
    );
  const workLocationIds: string[] =
    (poolCandidateFilter?.workRegions as string[]) ?? [];
  const workLocations: string[] | undefined = workLocationIds.map((id) =>
    intl.formatMessage(getWorkRegion(id)),
  );
  const languageAbility: string = poolCandidateFilter?.languageAbility
    ? intl.formatMessage(
        getLanguageAbility(poolCandidateFilter?.languageAbility),
      )
    : intl.formatMessage({
        defaultMessage: "Any language",
        id: "/jDW4V",
        description: "Label for the any language option",
      });

  return (
    <section data-h2-radius="base(s)">
      <div>
        <div data-h2-flex-grid="base(flex-start, 0, x1) p-tablet(flex-start, x2, 0)">
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <FilterBlock
              title={intl.formatMessage({
                defaultMessage: "Pool Requested",
                id: "rz8uPO",
                description:
                  "Title for the pool block in the manager info section of the single search request view.",
              })}
              content={
                pools
                  ? pools.map((pool) => getShortPoolTitleHtml(intl, pool))
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
              title={intl.formatMessage(processMessages.stream)}
              content={streams}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <div>
              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage: "Work language ability",
                  id: "VX3Og5",
                  description:
                    "Title for work language on summary of filters section",
                })}
                content={languageAbility}
              />
              <FilterBlock
                title={intl.formatMessage({
                  defaultMessage: "Work Location",
                  id: "MWZgsB",
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
                    "Conditions of employment / Operational requirements",
                  id: "cMsRgt",
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
