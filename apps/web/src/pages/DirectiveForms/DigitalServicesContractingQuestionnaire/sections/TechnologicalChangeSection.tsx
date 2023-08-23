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
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "Is the work being contracted out because it involves the introduction of...",
            id: "U9ziir",
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
              "Do you expect this contract to have immediate impacts on your department in terms of staffing level or skill sets required",
            id: "vT5RuW",
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
              "Do you expect any potential immediate carry-forward / ripple effect on other departments in terms of staffing levels or skill sets required",
            id: "3sweBr",
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
              "Do you expect any potential long-term carry-forward / ripple effect on other departments in terms of staffing levels or skill sets required",
            id: "sCrXmA",
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
