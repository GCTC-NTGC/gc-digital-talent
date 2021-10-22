import { uniqueId } from "lodash";
import * as React from "react";
import { useIntl } from "react-intl";

const SummaryBlock: React.FunctionComponent<{
  title: string;
  content: string | string[] | undefined;
}> = ({ title, content }) => {
  const intl = useIntl();
  return (
    <div data-h2-padding="b(bottom, s)">
      <div data-h2-visibility="b(visible) s(hidden)">
        <p
          data-h2-display="b(inline)"
          data-h2-padding="b(right, xxs)"
          data-h2-font-weight="s(600) b(500)"
        >
          {title}:
        </p>
        {content instanceof Array ? (
          <p
            data-h2-display="b(inline)"
            data-h2-font-color="b(lightpurple) s(black)"
          >
            {content.map((text): string => text).join(", ")}
          </p>
        ) : (
          <p
            data-h2-display="b(inline)"
            data-h2-font-color="b(lightpurple) s(black)"
          >
            {content ??
              intl.formatMessage({
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
        {content instanceof Array ? (
          <ul data-h2-font-color="b(lightpurple) s(black)">
            {content.map((text) => (
              <li key={uniqueId()}>{text}</li>
            ))}
          </ul>
        ) : (
          <p
            data-h2-display="b(inline)"
            data-h2-font-color="b(lightpurple) s(black)"
          >
            {content ??
              intl.formatMessage({
                defaultMessage: "N/A",
                description: "Text shown when the filter was not selected",
              })}
          </p>
        )}
      </div>
    </div>
  );
};

interface SummaryOfFiltersProps {
  classifications?: string[];
  educationLevel?: string;
  employmentEquity?: string[];
  languageAbility?: string;
  operationalRequirements?: string[];
  skills?: string[];
  totalEstimatedCandidates?: number;
  typeOfOpportunity?: string;
  workLocation?: string[];
}

const SummaryOfFilters: React.FunctionComponent<SummaryOfFiltersProps> = ({
  classifications,
  educationLevel,
  employmentEquity,
  languageAbility,
  operationalRequirements,
  skills,
  totalEstimatedCandidates,
  typeOfOpportunity,
  workLocation,
}) => {
  const intl = useIntl();
  return (
    <section>
      <h2 data-h2-font-weight="b(500)">
        {intl.formatMessage({
          defaultMessage: "Summary of filters",
          description: "Title of Summary of filters section",
        })}
      </h2>
      <div data-h2-flex-grid="b(top, contained, flush, xs)">
        <div
          data-h2-flex-item="b(1of1) s(1of2)"
          data-h2-border="s(lightgray, right, solid, s)"
          style={{ paddingBottom: "0" }}
        >
          <div data-h2-padding="s(right, s)">
            <SummaryBlock
              title={intl.formatMessage({
                defaultMessage: "Group and level",
                description:
                  "Title for classifications on summary of filters section",
              })}
              content={classifications}
            />
            <SummaryBlock
              title={intl.formatMessage({
                defaultMessage: "Education Level",
                description:
                  "Title for classifications section on summary of filters section",
              })}
              content={educationLevel}
            />
            <SummaryBlock
              title={intl.formatMessage({
                defaultMessage: "Type of opportunity",
                description:
                  "Title for type of opportunity section on summary of filters section",
              })}
              content={typeOfOpportunity}
            />
            <SummaryBlock
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
            <SummaryBlock
              title={intl.formatMessage({
                defaultMessage: "Work Location",
                description:
                  "Title for work location section on summary of filters section",
              })}
              content={workLocation}
            />
            <SummaryBlock
              title={intl.formatMessage({
                defaultMessage: "Work language ability",
                description:
                  "Title for work language on summary of filters section",
              })}
              content={languageAbility}
            />
            <SummaryBlock
              title={intl.formatMessage({
                defaultMessage: "Employment equity",
                description:
                  "Title for employment equity section on summary of filters section",
              })}
              content={employmentEquity}
            />
            <SummaryBlock
              title={intl.formatMessage({
                defaultMessage: "Skills",
                description:
                  "Title for skills section on summary of filters section",
              })}
              content={skills}
            />
          </div>
        </div>
        <p data-h2-flex-item="b(1of1)" data-h2-font-weight="b(600)">
          {intl.formatMessage(
            {
              defaultMessage:
                "Request for pool candidates: <span>{totalEstimatedCandidates, plural, zero {no candidates} one {1 candidate} other {{totalEstimatedCandidates} estimated candidates}}</span>",
              description:
                "Total estimated candidates message in summary of filters",
            },
            {
              span: (msg: string): JSX.Element => (
                <span data-h2-font-color="b(lightpurple)">{msg}</span>
              ),
              totalEstimatedCandidates,
            },
          )}
        </p>
      </div>
    </section>
  );
};

export default SummaryOfFilters;
