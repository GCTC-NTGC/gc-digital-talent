import React from "react";
import { useIntl } from "react-intl";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import { RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { YesNo } from "@gc-digital-talent/graphql";

import { enumToOptions } from "../../util";
import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { getYesNo, yesNoSortOrder } from "../../localizedConstants";

const TechnologicalChangeSection = () => {
  const intl = useIntl();
  return (
    <TableOfContents.Section
      id={PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE}
      data-h2-padding-top="base(x2)"
    >
      <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
        {intl.formatMessage(
          getSectionTitle(PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE),
        )}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.5)"
      >
        <div>
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage:
                "Is the work being contracted out because it involves the introduction of:",
              id: "SycVSd",
              description:
                "Context for _technological change_ section, paragraph 1, in the _digital services contracting questionnaire_",
            })}
          </p>
          <ul>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "equipment or material of a substantially different nature than that previously utilized",
                id: "/6+2X4",
                description:
                  "List item for _technological change_ section in the _digital services contracting questionnaire_",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "a major change in your department’s operation directly related to the introduction of that equipment or material",
                id: "TgHKdu",
                description:
                  "List item for _technological change_ section in the _digital services contracting questionnaire_",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "a new technological system, software or hardware of a substantially different nature than that previously utilized",
                id: "YCtHn2",
                description:
                  "List item for _technological change_ section in the _digital services contracting questionnaire_",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "a technological change to a system, software or hardware of a substantially different nature than that previously utilized",
                id: "9V1mVx",
                description:
                  "List item for _technological change_ section in the _digital services contracting questionnaire_",
              })}
            </li>
          </ul>
        </div>
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "If applicable, please indicate whether the work is being contracted out for the following reasons.",
            id: "jF4Ukw",
            description:
              "Label for _is technological change_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="isTechnologicalChange"
          name="isTechnologicalChange"
          idPrefix="isTechnologicalChange"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "Do you expect this contract to have immediate impacts on your department in terms of staffing level or skill sets required?",
            id: "kMpqRq",
            description:
              "Label for _has impact on your department_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="hasImpactOnYourDepartment"
          name="hasImpactOnYourDepartment"
          idPrefix="hasImpactOnYourDepartment"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "Do you expect any potential immediate carry-forward / ripple effect on other departments in terms of staffing levels or skill sets required?",
            id: "gsaza3",
            description:
              "Label for _has immediate impact on other departments_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="hasImmediateImpactOnOtherDepartments"
          name="hasImmediateImpactOnOtherDepartments"
          idPrefix="hasImmediateImpactOnOtherDepartments"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "Do you expect any potential long-term carry-forward / ripple effect on other departments in terms of staffing levels or skill sets required?",
            id: "0aU6BD",
            description:
              "Label for _has future impact on other departments_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="hasFutureImpactOnOtherDepartments"
          name="hasFutureImpactOnOtherDepartments"
          idPrefix="hasFutureImpactOnOtherDepartments"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
      </div>
    </TableOfContents.Section>
  );
};

export default TechnologicalChangeSection;
