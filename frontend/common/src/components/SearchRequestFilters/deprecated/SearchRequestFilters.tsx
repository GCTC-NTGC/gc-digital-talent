import uniqueId from "lodash/uniqueId";
import isEmpty from "lodash/isEmpty";
import * as React from "react";
import { useIntl } from "react-intl";
import {
  ApplicantFilter,
  Maybe,
  PoolCandidateFilter,
} from "../../../api/generated";
import {
  getLanguageAbility,
  getOperationalRequirement,
  getWorkRegion,
} from "../../../constants/localizedConstants";

export interface FilterBlockProps {
  title: string;
  content: Maybe<string> | Maybe<string[]>;
}

const FilterBlock: React.FunctionComponent<FilterBlockProps> = ({
  title,
  content,
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
                  description: "Text shown when the filter was not selected",
                })}
          </p>
        )}
      </div>
      <div data-h2-visually-hidden="base(hidden) p-tablet(visible)">
        <p
          data-h2-display="base(block)"
          data-h2-padding="base(0, x.125, 0, 0)"
          data-h2-font-weight="base(600)"
        >
          {title}
        </p>
        {content instanceof Array && content.length > 0 ? (
          <ul data-h2-color="base(dt-black)">
            {content.map((text) => (
              <li key={uniqueId()}>{text}</li>
            ))}
          </ul>
        ) : (
          emptyArrayOutput(content)
        )}
      </div>
    </div>
  );
};

export interface SearchRequestFiltersProps {
  poolCandidateFilter: Maybe<PoolCandidateFilter>;
  poolApplicantFilter: Maybe<ApplicantFilter>;
}

const SearchRequestFilters: React.FunctionComponent<
  SearchRequestFiltersProps
  // Deprecated but needed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = ({ poolCandidateFilter, poolApplicantFilter }) => {
  const intl = useIntl();

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
      <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
        <div>
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
              defaultMessage: "Work language ability",
              id: "VX3Og5",
              description:
                "Title for work language on summary of filters section",
            })}
            content={languageAbility}
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
        </div>
      </div>
    </section>
  );
};

export default SearchRequestFilters;
export { FilterBlock };
