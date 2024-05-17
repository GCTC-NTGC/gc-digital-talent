import { useIntl } from "react-intl";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import { RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { YesNo } from "@gc-digital-talent/graphql";

import { enumToOptions } from "../../util";
import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { getYesNo, yesNoSortOrder } from "../../localizedConstants";
import useLabels from "../useLabels";
import CompoundQuestion from "../../CompoundQuestion";

const TechnologicalChangeSection = () => {
  const intl = useIntl();
  const labels = useLabels();

  return (
    <TableOfContents.Section id={PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE}>
      <Heading level="h3" size="h4" className="mb-6 mt-12 font-bold">
        {intl.formatMessage(
          getSectionTitle(PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE),
        )}
      </Heading>
      <div className="flex flex-col gap-6">
        <CompoundQuestion
          introduction={
            <>
              <p data-h2-margin-bottom="base(x.5)" className="font-bold">
                {intl.formatMessage({
                  defaultMessage:
                    "Is the work being contracted out because it involves the introduction of:",
                  id: "SycVSd",
                  description:
                    "Context for _technological change_ section, paragraph 1, in the _digital services contracting questionnaire_",
                })}
              </p>
              <ul className="my-3 list-outside list-disc pl-12 [&>li]:mb-1.5">
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "equipment or material of a substantially different nature than that previously utilized",
                    id: "sKqKYS",
                    description:
                      "technological change factor - different nature",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "a major change in your department’s operation directly related to the introduction of that equipment or material",
                    id: "Eht9xP",
                    description:
                      "technological change factor - change department's operation",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "a new technological system, software or hardware of a substantially different nature than that previously utilized",
                    id: "j12uou",
                    description:
                      "technological change factor - new technological system",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "a technological change to a system, software or hardware of a substantially different nature than that previously utilized",
                    id: "XVI4qU",
                    description:
                      "technological change factor - technological change to a system",
                  })}
                </li>
              </ul>
            </>
          }
          inputElement={
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
          }
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
