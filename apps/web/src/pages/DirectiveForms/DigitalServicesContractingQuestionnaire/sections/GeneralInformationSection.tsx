import React from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  Select,
  objectsToSortedOptions,
  Input,
  Field,
  Checklist,
  RadioGroup,
} from "@gc-digital-talent/forms";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";
import { ContractAuthority, YesNoUnsure } from "@gc-digital-talent/graphql";
import { Heading, TableOfContents } from "@gc-digital-talent/ui";

import { IdNamePair } from "../types";
import { enumToOptions, OTHER_ID } from "../../util";
import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import {
  contractAuthoritySortOrder,
  getContractAuthorities,
  getYesNoUnsure,
  yesNoUnsureSortOrder,
} from "../../localizedConstants";

type GeneralInformationSectionProps = {
  departments: Array<IdNamePair>;
};

const GeneralInformationSection = ({
  departments,
}: GeneralInformationSectionProps) => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();

  // hooks to watch, needed for conditional rendering
  const [
    selectedDepartment,
    selectedAuthoritiesInvolved,
    selectedContractForDigitalInitiative,
    selectedDigitalInitiativePlanSubmitted,
  ] = watch([
    "department",
    "authoritiesInvolved",
    "contractForDigitalInitiative",
    "digitalInitiativePlanSubmitted",
  ]);

  const isDepartmentOther = selectedDepartment === OTHER_ID;
  const doesAuthorityInvolvedIncludeOther =
    Array.isArray(selectedAuthoritiesInvolved) &&
    selectedAuthoritiesInvolved.includes(ContractAuthority.Other);
  const isContractForSpecificInitiative =
    selectedContractForDigitalInitiative === YesNoUnsure.Yes;
  const isPlanSubmitted =
    selectedDigitalInitiativePlanSubmitted === YesNoUnsure.Yes;

  /**
   * Reset un-rendered fields
   */
  React.useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // Reset all optional fields
    if (!isDepartmentOther) {
      resetDirtyField("departmentOther");
    }
    if (!doesAuthorityInvolvedIncludeOther) {
      resetDirtyField("authorityInvolvedOther");
    }
    if (!isContractForSpecificInitiative) {
      resetDirtyField("digitalInitiativeName");
      resetDirtyField("digitalInitiativePlanSubmitted");
      resetDirtyField("digitalInitiativePlanUpdated");
      resetDirtyField("digitalInitiativePlanComplemented");
    }
    if (!isPlanSubmitted) {
      resetDirtyField("digitalInitiativePlanUpdated");
    }
  }, [
    resetField,
    isDepartmentOther,
    doesAuthorityInvolvedIncludeOther,
    isContractForSpecificInitiative,
    isPlanSubmitted,
  ]);

  return (
    <TableOfContents.Section
      id={PAGE_SECTION_ID.GENERAL_INFORMATION}
      data-h2-padding-top="base(x1)"
    >
      <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
        {intl.formatMessage(
          getSectionTitle(PAGE_SECTION_ID.GENERAL_INFORMATION),
        )}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.5)"
      >
        <Select
          id="department"
          name="department"
          label={intl.formatMessage({
            defaultMessage: "Department / agency",
            id: "uDwGwb",
            description:
              "Label for _department / agency_ field in the _digital services contracting questionnaire_",
          })}
          nullSelection={intl.formatMessage({
            defaultMessage: "Select a department",
            id: "y827h2",
            description:
              "Null selection for department select input in the request form.",
          })}
          options={[
            ...objectsToSortedOptions(departments, intl),
            {
              value: OTHER_ID,
              label: intl.formatMessage(formMessages.other),
            },
          ]}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          doNotSort
        />
        {isDepartmentOther ? (
          <Input
            id="departmentOther"
            name="departmentOther"
            type="text"
            label={intl.formatMessage(formMessages.specifyOther)}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <Input
          id="branchOther"
          name="branchOther"
          type="text"
          label={intl.formatMessage({
            defaultMessage: "Branch",
            id: "FXJMDV",
            description:
              "Label for _branch_ field in the _digital services contracting questionnaire_",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <Field.Wrapper>
          <Field.Fieldset>
            <Field.Legend>
              {intl.formatMessage({
                defaultMessage: "Business owner",
                id: "B75J3Q",
                description:
                  "Label for _business owner_ fieldset in the _digital services contracting questionnaire_",
              })}
            </Field.Legend>
            <Input
              id="businessOwnerName"
              name="businessOwnerName"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "Name",
                id: "AkuIfT",
                description:
                  "Label for _business owner name_ field in the _digital services contracting questionnaire_",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="businessOwnerJobTitle"
              name="businessOwnerJobTitle"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "Job title",
                id: "wRhcac",
                description:
                  "Label for _business owner job title_ field in the _digital services contracting questionnaire_",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="businessOwnerEmail"
              name="businessOwnerEmail"
              type="email"
              label={intl.formatMessage({
                defaultMessage: "Email",
                id: "sg9olk",
                description:
                  "Label for _business owner email_ field in the _digital services contracting questionnaire_",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </Field.Fieldset>
        </Field.Wrapper>
        <Field.Wrapper>
          <Field.Fieldset>
            <Field.Legend>
              {intl.formatMessage({
                defaultMessage:
                  "Delegated financial authority (section 32) for the contract",
                id: "ppJF9L",
                description:
                  "Label for _financial authority_ fieldset in the _digital services contracting questionnaire_",
              })}
            </Field.Legend>
            <Input
              id="financialAuthorityName"
              name="financialAuthorityName"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "Name",
                id: "ttIQ0Q",
                description:
                  "Label for _financial authority name_ field in the _digital services contracting questionnaire_",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="financialAuthorityJobTitle"
              name="financialAuthorityJobTitle"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "Job title",
                id: "dgVAPq",
                description:
                  "Label for _financial authority job title_ field in the _digital services contracting questionnaire_",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="financialAuthorityEmail"
              name="financialAuthorityEmail"
              type="email"
              label={intl.formatMessage({
                defaultMessage: "Email",
                id: "51Hc86",
                description:
                  "Label for _financial authority email_ field in the _digital services contracting questionnaire_",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </Field.Fieldset>
        </Field.Wrapper>
        <Checklist
          idPrefix="authoritiesInvolved"
          id="authoritiesInvolved"
          name="authoritiesInvolved"
          legend={intl.formatMessage({
            defaultMessage:
              "Other authorities involved / engaged on this contract",
            id: "nfcDvX",
            description:
              "Label for _authorities involved_ fieldset in the _digital services contracting questionnaire_",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(
            ContractAuthority,
            contractAuthoritySortOrder,
          ).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getContractAuthorities(option.value)),
            };
          })}
        />
        {doesAuthorityInvolvedIncludeOther ? (
          <Input
            id="authorityInvolvedOther"
            name="authorityInvolvedOther"
            type="text"
            label={intl.formatMessage(formMessages.specifyOther)}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "Is this contract being put in place on behalf of another Government of Canada department or agency?",
            id: "KifUVY",
            description:
              "Label for _contract on behalf of gc_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="contractBehalfOfGc"
          name="contractBehalfOfGc"
          idPrefix="contractBehalfOfGc"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNoUnsure, yesNoUnsureSortOrder).map(
            (option) => {
              return {
                value: option.value as string,
                label: intl.formatMessage(getYesNoUnsure(option.value)),
              };
            },
          )}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "Is this contract being put in place for the purpose of service provision to another Government of Canada department or agency?",
            id: "u42Yks",
            description:
              "Label for _contract of service to gc_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="contractServiceOfGc"
          name="contractServiceOfGc"
          idPrefix="contractServiceOfGc"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNoUnsure, yesNoUnsureSortOrder).map(
            (option) => {
              return {
                value: option.value as string,
                label: intl.formatMessage(getYesNoUnsure(option.value)),
              };
            },
          )}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "Is this contract related to a specific digital initiative?",
            id: "ci72ST",
            description:
              "Label for _contract for digital initiative_ fieldset in the _digital services contracting questionnaire_",
          })}
          id="contractForDigitalInitiative"
          name="contractForDigitalInitiative"
          idPrefix="contractForDigitalInitiative"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNoUnsure, yesNoUnsureSortOrder).map(
            (option) => {
              return {
                value: option.value as string,
                label: intl.formatMessage(getYesNoUnsure(option.value)),
              };
            },
          )}
        />
        {isContractForSpecificInitiative ? (
          <>
            <Input
              id="digitalInitiativeName"
              name="digitalInitiativeName"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "Name of the digital initiative",
                id: "6ntAxU",
                description:
                  "Label for _name of digital initiative_ field in _authorities involved_ fieldset in the _digital services contracting questionnaire_",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <RadioGroup
              legend={intl.formatMessage({
                defaultMessage:
                  'Has a digital initiative "Forward Talent Plan" been submitted previously for the initiative?',
                id: "kpQom6",
                description:
                  "Label for _digital initiative plan submitted_ fieldset in the _digital services contracting questionnaire_",
              })}
              id="digitalInitiativePlanSubmitted"
              name="digitalInitiativePlanSubmitted"
              idPrefix="digitalInitiativePlanSubmitted"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={enumToOptions(YesNoUnsure, yesNoUnsureSortOrder).map(
                (option) => {
                  return {
                    value: option.value as string,
                    label: intl.formatMessage(getYesNoUnsure(option.value)),
                  };
                },
              )}
              context={intl.formatMessage({
                defaultMessage:
                  "For more information on the digital initiative forward talent plan, refer to requirement A.2.4 of the <italic>Mandatory Procedures on Digital Talent</italic>.",
                id: "trLrTy",
                description:
                  "Context for _digital initiative plan submitted_ fieldset in the _digital services contracting questionnaire_",
              })}
            />
            {isPlanSubmitted ? (
              <RadioGroup
                legend={intl.formatMessage({
                  defaultMessage:
                    "Has the plan been updated when the contract is initiated?",
                  id: "siF4qC",
                  description:
                    "Label for _digital initiative plan updated_ fieldset in the _digital services contracting questionnaire_",
                })}
                id="digitalInitiativePlanUpdated"
                name="digitalInitiativePlanUpdated"
                idPrefix="digitalInitiativePlanUpdated"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                items={enumToOptions(YesNoUnsure, yesNoUnsureSortOrder).map(
                  (option) => {
                    return {
                      value: option.value as string,
                      label: intl.formatMessage(getYesNoUnsure(option.value)),
                    };
                  },
                )}
              />
            ) : null}
            <RadioGroup
              legend={intl.formatMessage({
                defaultMessage:
                  "Does this procurement complement other talent sourcing activities (e.g. staffing, training) for this initiative?",
                id: "qRPPY2",
                description:
                  "Label for _digital initiative plan complemented_ fieldset in the _digital services contracting questionnaire_",
              })}
              id="digitalInitiativePlanComplemented"
              name="digitalInitiativePlanComplemented"
              idPrefix="digitalInitiativePlanComplemented"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={enumToOptions(YesNoUnsure, yesNoUnsureSortOrder).map(
                (option) => {
                  return {
                    value: option.value as string,
                    label: intl.formatMessage(getYesNoUnsure(option.value)),
                  };
                },
              )}
            />
          </>
        ) : null}
      </div>
    </TableOfContents.Section>
  );
};

export default GeneralInformationSection;
