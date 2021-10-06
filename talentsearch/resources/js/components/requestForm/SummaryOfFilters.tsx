import * as React from "react";
import { FormattedMessage } from "react-intl";

const SummaryBlock: React.FunctionComponent<{
  title: React.ReactNode;
  content: string | string[] | undefined;
}> = ({ title, content }) => {
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
          <p data-h2-display="b(inline)" data-h2-color="b(lightpurple)">
            {content.map((text): string => text).join(", ")}
          </p>
        ) : (
          <p data-h2-display="b(inline)" data-h2-color="b(lightpurple)">
            {content ?? (
              <FormattedMessage
                id="noAnswer"
                defaultMessage="N/A"
                description="Text shown when the filter was not selected"
              />
            )}
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
          <ul data-h2-color="b(lightpurple)">
            {content.map((text) => (
              <li>{text}</li>
            ))}
          </ul>
        ) : (
          <p data-h2-display="b(inline)" data-h2-color="b(lightpurple)">
            {content ?? (
              <FormattedMessage
                id="noAnswer"
                defaultMessage="N/A"
                description="Text shown when the filter was not selected"
              />
            )}
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
  return (
    <section data-h2-padding="b(right-left, l)">
      <h2 data-h2-font-weight="b(500)">
        <FormattedMessage
          id="summaryofFilters"
          defaultMessage="Summary of filters"
          description="Title of Summary of filters section"
        />
      </h2>
      <div data-h2-flex-grid="b(top, contained, flush, xs)">
        <div
          data-h2-flex-item="b(1of1) s(1of2)"
          data-h2-border="s(lightgray, right, solid, s)"
          style={{ paddingBottom: "0" }}
        >
          <div data-h2-padding="s(right, s)">
            <SummaryBlock
              title={
                <FormattedMessage
                  id="classification"
                  defaultMessage="Group and level"
                  description="Title for classifications on summary of filters section"
                />
              }
              content={classifications}
            />
            <SummaryBlock
              title={
                <FormattedMessage
                  id="educationLevel"
                  defaultMessage="Education Level"
                  description="Title for classifications section on summary of filters section"
                />
              }
              content={educationLevel}
            />
            <SummaryBlock
              title={
                <FormattedMessage
                  id="typeOfOpportunity"
                  defaultMessage="Type of opportunity"
                  description="Title for type of opportunity section on summary of filters section"
                />
              }
              content={typeOfOpportunity}
            />
            <SummaryBlock
              title={
                <FormattedMessage
                  id="conditionsOfEmployment"
                  defaultMessage="Conditions of employment / Operational requirements"
                  description="Title for operational requirements section on summary of filters section"
                />
              }
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
              title={
                <FormattedMessage
                  id="workLocation"
                  defaultMessage=" Work Location"
                  description="Title for work location section on summary of filters section"
                />
              }
              content={workLocation}
            />
            <SummaryBlock
              title={
                <FormattedMessage
                  id="workLanguage"
                  defaultMessage="Work language ability"
                  description="Title for work language on summary of filters section"
                />
              }
              content={languageAbility}
            />
            <SummaryBlock
              title={
                <FormattedMessage
                  id="employmentEquity"
                  defaultMessage="Employment equity"
                  description="Title for employment equity section on summary of filters section"
                />
              }
              content={employmentEquity}
            />
            <SummaryBlock
              title={
                <FormattedMessage
                  id="skills"
                  defaultMessage="Skills"
                  description="Title for skills section on summary of filters section"
                />
              }
              content={skills}
            />
          </div>
        </div>
        <p data-h2-flex-item="b(1of1)" data-h2-font-weight="b(600)">
          <FormattedMessage
            id="poolCandidates"
            defaultMessage="Request for pool candidates: <span>{totalEstimatedCandidates, plural,
              zero {no candidates}
              one {1 candidate}
              other {{totalEstimatedCandidates} estimated candidates}}</span>"
            description="Total estimated candidates message in summary of filters"
            values={{
              span: (msg: string): JSX.Element => (
                <span data-h2-color="b(lightpurple)">{msg}</span>
              ),
              totalEstimatedCandidates,
            }}
          />
        </p>
      </div>
    </section>
  );
};

export default SummaryOfFilters;
