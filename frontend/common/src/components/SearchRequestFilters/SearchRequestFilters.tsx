import uniqueId from "lodash/uniqueId";
import isEmpty from "lodash/isEmpty";
import * as React from "react";
import { useIntl } from "react-intl";
import { Maybe, PoolCandidateFilter } from "../../api/generated";
import {
  getLanguageAbility,
  getOperationalRequirement,
  getWorkRegion,
} from "../../constants/localizedConstants";
import { getLocale } from "../../helpers/localize";

export interface FilterBlockProps {
  title: string;
  content: Maybe<string> | Maybe<string[]>;
}

const FilterBlock: React.FunctionComponent<FilterBlockProps> = ({
  title,
  content,
}) => {
  const intl = useIntl();
  return (
    <div data-h2-padding="b(bottom, s)">
      <div data-h2-visibility="b(visible) s(hidden)">
        <p
          data-h2-display="b(inline)"
          data-h2-padding="b(right, xxs)"
          data-h2-font-weight="b(600)"
        >
          {title}:
        </p>
        {content instanceof Array && content.length > 0 ? (
          <p data-h2-display="b(inline)" data-h2-font-color="b(black)">
            {content.map((text): string => text).join(", ")}
          </p>
        ) : (
          <p data-h2-display="b(inline)" data-h2-font-color="b(black)">
            {content && !isEmpty(content)
              ? content
              : intl.formatMessage({
                  defaultMessage: "N/A",
                  description: "Text shown when the filter was not selected",
                })}
          </p>
        )}
      </div>
      <div data-h2-visibility="b(hidden) s(visible)">
        <p
          data-h2-display="b(block)"
          data-h2-padding="b(right, xxs)"
          data-h2-font-weight="b(600)"
        >
          {title}
        </p>
        {content instanceof Array && content.length > 0 ? (
          <ul data-h2-font-color="b(black)">
            {content.map((text) => (
              <li key={uniqueId()}>{text}</li>
            ))}
          </ul>
        ) : (
          <p data-h2-display="b(inline)" data-h2-font-color="b(black)">
            {content && !isEmpty(content)
              ? content
              : intl.formatMessage({
                  defaultMessage: "N/A",
                  description: "Text shown when the filter was not selected",
                })}
          </p>
        )}
      </div>
    </div>
  );
};

export interface SearchRequestFiltersProps {
  poolCandidateFilter: Maybe<PoolCandidateFilter>;
}

const SearchRequestFilters: React.FunctionComponent<
  SearchRequestFiltersProps
> = ({ poolCandidateFilter }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

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
        description:
          "Education level message when candidate has a diploma found on the request page.",
      })
    : intl.formatMessage({
        defaultMessage:
          "Can accept a combination of work experience and education",
        description:
          "Education level message when candidate does not have a diploma found on the request page.",
      });
  const employmentEquity: string[] | undefined = [
    ...(poolCandidateFilter?.isWoman
      ? [
          intl.formatMessage({
            defaultMessage: "Woman",
            description:
              "Message for woman option in the employment equity section of the request page.",
          }),
        ]
      : []),
    ...(poolCandidateFilter?.isVisibleMinority
      ? [
          intl.formatMessage({
            defaultMessage: "Visible Minority",
            description:
              "Message for visible minority option in the employment equity section of the request page.",
          }),
        ]
      : []),
    ...(poolCandidateFilter?.isIndigenous
      ? [
          intl.formatMessage({
            defaultMessage: "Indigenous",
            description:
              "Message for indigenous option in the employment equity section of the request page.",
          }),
        ]
      : []),
    ...(poolCandidateFilter?.hasDisability
      ? [
          intl.formatMessage({
            defaultMessage: "Disability",
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
      });
  const skills: string[] | undefined = poolCandidateFilter?.cmoAssets?.map(
    (cmoAsset) =>
      cmoAsset?.name[locale] ||
      intl.formatMessage({
        defaultMessage: "Error: skill name not found",
        description:
          "Error message when cmo asset name is not found on request page.",
      }),
  );
  const typeOfOpportunity = ""; // TODO: Replace with data fetched from api

  return (
    <section data-h2-flex-grid="b(top, contained, flush, xs)">
      <div
        data-h2-flex-item="b(1of1) s(1of2)"
        data-h2-border="s(lightgray, right, solid, s)"
        style={{ paddingBottom: "0" }}
      >
        <div data-h2-padding="s(right, s)">
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Group and level",
              description:
                "Title for group and level on summary of filters section",
            })}
            content={classifications}
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Education Level",
              description:
                "Title for education level on summary of filters section",
            })}
            content={educationLevel}
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Type of opportunity",
              description:
                "Title for type of opportunity section on summary of filters section",
            })}
            content={typeOfOpportunity}
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage:
                "Conditions of employment / Operational requirements",
              description:
                "Title for operational requirements section on summary of filters section",
            })}
            content={operationalRequirements}
          />
        </div>
      </div>
      <div
        data-h2-flex-item="b(1of1) s(1of2)"
        data-h2-padding="s(left, xxl)"
        style={{ paddingTop: "0" }}
      >
        <div data-h2-padding="s(left, xxl)">
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Work Location",
              description:
                "Title for work location section on summary of filters section",
            })}
            content={workLocations}
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Work language ability",
              description:
                "Title for work language on summary of filters section",
            })}
            content={languageAbility}
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Employment equity",
              description:
                "Title for employment equity section on summary of filters section",
            })}
            content={employmentEquity}
          />
          <FilterBlock
            title={intl.formatMessage({
              defaultMessage: "Skills",
              description:
                "Title for skills section on summary of filters section",
            })}
            content={skills}
          />
        </div>
      </div>
    </section>
  );
};

export default SearchRequestFilters;
export { FilterBlock };
