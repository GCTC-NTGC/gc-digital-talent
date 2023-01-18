import uniqueId from "lodash/uniqueId";
import isEmpty from "lodash/isEmpty";
import * as React from "react";
import { useIntl } from "react-intl";
import { notEmpty } from "../../helpers/util";
import {
  ApplicantFilter,
  Classification,
  Maybe,
  Pool,
  PoolCandidateFilter,
  PositionDuration,
} from "../../api/generated";
import {
  EmploymentDuration,
  getEmploymentDuration,
  getLanguageAbility,
  getOperationalRequirement,
  getWorkRegion,
} from "../../constants/localizedConstants";
import { getLocale } from "../../helpers/localize";
import Chip, { Chips } from "../Chip";

export type SimpleClassification = Pick<Classification, "group" | "level">;

export interface FilterBlockProps {
  title: string;
  content?: Maybe<string> | Maybe<string[]>;
  children?: React.ReactNode;
}

const FilterBlock: React.FunctionComponent<FilterBlockProps> = ({
  title,
  content,
  children,
}) => {
  const intl = useIntl();

  const emptyArrayOutput = (input: string | string[] | null | undefined) => {
    return input && !isEmpty(input) ? (
      <p data-h2-display="base(inline)" data-h2-color="base(dt-black)">
        {input}
      </p>
    ) : (
      <ul data-h2-color="base(dt-black)">
        <li>
          {intl.formatMessage({
            defaultMessage: "(None selected)",
            id: "+O6J4u",
            description: "Text shown when the filter was not selected",
          })}
        </li>
      </ul>
    );
  };

  return (
    <div data-h2-padding="base(0, 0, x1, 0)">
      <div data-h2-visually-hidden="base(visible) p-tablet(hidden)">
        <p
          data-h2-display="base(inline)"
          data-h2-padding="base(0, x.125, 0, 0)"
          data-h2-font-weight="base(600)"
        >
          {title}:
        </p>
        {content !== undefined && (
          <span>
            {content instanceof Array && content.length > 0 ? (
              <p data-h2-display="base(inline)" data-h2-color="base(dt-black)">
                {content.map((text): string => text).join(", ")}
              </p>
            ) : (
              <p data-h2-display="base(inline)" data-h2-color="base(dt-black)">
                {content && !isEmpty(content)
                  ? content
                  : intl.formatMessage({
                      defaultMessage: "N/A",
                      id: "i9AjuX",
                      description:
                        "Text shown when the filter was not selected",
                    })}
              </p>
            )}
          </span>
        )}
        {children && children}
      </div>
      <div data-h2-visually-hidden="base(hidden) p-tablet(visible)">
        <p
          data-h2-display="base(block)"
          data-h2-padding="base(0, x.125, 0, 0)"
          data-h2-font-weight="base(600)"
        >
          {title}
        </p>
        {content !== undefined && (
          <span>
            {content instanceof Array && content.length > 0 ? (
              <ul data-h2-color="base(dt-black)">
                {content.map((text) => (
                  <li key={uniqueId()}>{text}</li>
                ))}
              </ul>
            ) : (
              emptyArrayOutput(content)
            )}
          </span>
        )}
        {children && children}
      </div>
    </div>
  );
};

const ApplicantFilters: React.FC<{
  applicantFilter?: Maybe<ApplicantFilter>;
  selectedClassifications?: Maybe<SimpleClassification>[];
}> = ({ applicantFilter, selectedClassifications }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  // else set values if filters prop is of ApplicantFilterInput type
  const classificationsFromBrowserHistory: string[] | undefined =
    selectedClassifications?.map(
      (classification) =>
        `${classification?.group.toLocaleUpperCase()}-0${
          classification?.level
        }`,
    );

  const pools = applicantFilter?.pools?.filter(notEmpty);
  const classifications: Classification[] =
    pools?.reduce(
      (previousValue: Classification[], currentValue: Maybe<Pool>) => {
        const cls = currentValue?.classifications?.filter(notEmpty) || [];
        return [...previousValue, ...cls];
      },
      [],
    ) || [];
  const classificationsFromApplicantFilter = classifications
    .filter(notEmpty)
    .map(
      (classification) =>
        `${classification?.group.toLocaleUpperCase()}-0${
          classification?.level
        }`,
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

  const positionDurationToEmploymentDuration = (
    durations: Maybe<PositionDuration>[],
  ): string => {
    if (durations && durations.includes(PositionDuration.Temporary)) {
      return EmploymentDuration.Term;
    }
    return EmploymentDuration.Indeterminate;
    // Search/Request currently selects TEMPORARY or PERMANENT or NULL, no combinations
    // therefore if applicant.positionDuration exists, durations exists as an array of either TEMPORARY or PERMANENT
  };

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

  const educationLevel: string | undefined = applicantFilter?.hasDiploma
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
            id: "7GRDML",
            description:
              "Message for indigenous option in the employment equity section of the request page.",
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
        id: "0/8x/z",
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
              defaultMessage: "Group and level",
              id: "Rn5e/i",
              description:
                "Title for group and level on summary of filters section",
            })}
            content={
              classificationsFromBrowserHistory ||
              classificationsFromApplicantFilter
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
                <ul data-h2-color="base(dt-black)">
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
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Education Level",
              id: "YKqt+1",
              description:
                "Title for education level on summary of filters section",
            })}
            content={educationLevel}
          />
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
                defaultMessage: "Employment Duration",
                id: "PmMr9l",
                description:
                  "Title for work language on summary of filters section",
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
            title={intl.formatMessage({
              defaultMessage: "Employment equity",
              id: "+aowPB",
              description:
                "Title for employment equity section on summary of filters section",
            })}
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

export interface SearchRequestFiltersProps {
  filters?: Maybe<ApplicantFilter | PoolCandidateFilter>;
  selectedClassifications?: Maybe<SimpleClassification>[];
}

const SearchRequestFilters: React.FunctionComponent<
  SearchRequestFiltersProps
> = ({ filters, selectedClassifications }) => {
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
        `${classification?.group.toLocaleUpperCase()}-0${
          classification?.level
        }`,
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
            id: "7GRDML",
            description:
              "Message for indigenous option in the employment equity section of the request page.",
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
        id: "0/8x/z",
      });

  const typeOfOpportunity = ""; // TODO: Replace with data fetched from api

  return (
    <section data-h2-radius="base(s)">
      <div>
        <div data-h2-flex-grid="base(flex-start, 0, x1) p-tablet(flex-start, x2, 0)">
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
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
              title={intl.formatMessage({
                defaultMessage: "Education Level",
                id: "YKqt+1",
                description:
                  "Title for education level on summary of filters section",
              })}
              content={educationLevel}
            />
            <FilterBlock
              title={intl.formatMessage({
                defaultMessage: "Type of opportunity",
                id: "ZuSEII",
                description:
                  "Title for type of opportunity section on summary of filters section",
              })}
              content={typeOfOpportunity}
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
                title={intl.formatMessage({
                  defaultMessage: "Employment equity",
                  id: "+aowPB",
                  description:
                    "Title for employment equity section on summary of filters section",
                })}
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
export { FilterBlock };
