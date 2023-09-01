import React from "react";
import { useIntl } from "react-intl";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import { RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { YesNo } from "@gc-digital-talent/graphql";

import { enumToOptions } from "../../util";
import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { getYesNo, yesNoSortOrder } from "../../localizedConstants";
import getLabels from "../labels";

const TechnologicalChangeSection = () => {
  const intl = useIntl();
  const labels = getLabels(intl);

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
        data-h2-gap="base(x1)"
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
          legend={labels.isTechnologicalChange}
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
          legend={labels.hasImpactOnYourDepartment}
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
          legend={labels.hasImmediateImpactOnOtherDepartments}
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
          legend={labels.hasFutureImpactOnOtherDepartments}
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
