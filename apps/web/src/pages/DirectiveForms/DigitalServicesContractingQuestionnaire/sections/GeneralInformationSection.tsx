import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";
import { useEffect, ReactNode } from "react";

import {
  Select,
  objectsToSortedOptions,
  Input,
  Field,
  Checklist,
  RadioGroup,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  getLocale,
} from "@gc-digital-talent/i18n";
import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import {
  ContractAuthority,
  Department,
  YesNo,
  YesNoUnsure,
} from "@gc-digital-talent/graphql";

import {
  buildExternalLink,
  enumToOptions,
  getDirectiveUrl,
  OTHER_ID,
} from "../../util";
import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import {
  contractAuthoritySortOrder,
  getContractAuthorities,
  getYesNo,
  getYesNoUnsure,
  yesNoSortOrder,
  yesNoUnsureSortOrder,
} from "../../localizedConstants";
import useLabels from "../useLabels";
import SignPost from "../../SignPost";

type GeneralInformationSectionProps = {
  departments: Array<Omit<Department, "departmentNumber">>;
};

const GeneralInformationSection = ({
  departments,
}: GeneralInformationSectionProps) => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();
  const labels = useLabels();

  // hooks to watch, needed for conditional rendering
  const [
    selectedDepartment,
    selectedIsAuthorityInvolved,
    selectedAuthoritiesInvolved,
    selectedContractForDigitalInitiative,
    selectedDigitalInitiativePlanSubmitted,
  ] = watch([
    "department",
    "isAuthorityInvolved",
    "authoritiesInvolved",
    "contractForDigitalInitiative",
    "digitalInitiativePlanSubmitted",
  ]);

  const isDepartmentOther = selectedDepartment === OTHER_ID;
  const isAuthorityInvolvedYes = selectedIsAuthorityInvolved === YesNo.Yes;
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
  useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // Reset all optional fields
    if (!isDepartmentOther) {
      resetDirtyField("departmentOther");
    }
    if (!isAuthorityInvolvedYes) {
      resetDirtyField("authoritiesInvolved");
      resetDirtyField("authorityInvolvedOther");
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
    isAuthorityInvolvedYes,
  ]);

  return (
    <TableOfContents.Section id={PAGE_SECTION_ID.GENERAL_INFORMATION}>
      <Heading
        data-h2-margin="base(x3, 0, x1, 0)"
        level="h3"
        size="h4"
        data-h2-font-weight="base(700)"
      >
        {intl.formatMessage(
          getSectionTitle(PAGE_SECTION_ID.GENERAL_INFORMATION),
        )}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <Select
          id="department"
          name="department"
          label={labels.department}
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
              label: intl.formatMessage(commonMessages.other),
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
            label={labels.departmentOther}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <Input
          id="branchOther"
          name="branchOther"
          type="text"
          label={labels.branchOther}
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
            <Field.BoundingBox>
              <Input
                id="businessOwnerName"
                name="businessOwnerName"
                type="text"
                label={labels.businessOwnerName}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Input
                id="businessOwnerJobTitle"
                name="businessOwnerJobTitle"
                type="text"
                label={labels.businessOwnerJobTitle}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Input
                id="businessOwnerEmail"
                name="businessOwnerEmail"
                type="email"
                label={labels.businessOwnerEmail}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </Field.BoundingBox>
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
            <Field.BoundingBox>
              <Input
                id="financialAuthorityName"
                name="financialAuthorityName"
                type="text"
                label={labels.financialAuthorityName}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Input
                id="financialAuthorityJobTitle"
                name="financialAuthorityJobTitle"
                type="text"
                label={labels.financialAuthorityJobTitle}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Input
                id="financialAuthorityEmail"
                name="financialAuthorityEmail"
                type="email"
                label={labels.financialAuthorityEmail}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </Field.BoundingBox>
          </Field.Fieldset>
        </Field.Wrapper>
        <RadioGroup
          legend={labels.isAuthorityInvolved}
          id="isAuthorityInvolved"
          name="isAuthorityInvolved"
          idPrefix="isAuthorityInvolved"
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
        {isAuthorityInvolvedYes ? (
          <>
            <Checklist
              idPrefix="authoritiesInvolved"
              id="authoritiesInvolved"
              name="authoritiesInvolved"
              legend={labels.authoritiesInvolved}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={enumToOptions(
                ContractAuthority,
                contractAuthoritySortOrder,
              ).map((option) => {
                return {
                  value: option.value as string,
                  label: intl.formatMessage(
                    getContractAuthorities(option.value),
                  ),
                };
              })}
            />
            {doesAuthorityInvolvedIncludeOther ? (
              <Input
                id="authorityInvolvedOther"
                name="authorityInvolvedOther"
                type="text"
                label={labels.authorityInvolvedOther}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            ) : null}
          </>
        ) : null}
        <RadioGroup
          legend={labels.contractBehalfOfGc}
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
          legend={labels.contractServiceOfGc}
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
          legend={labels.contractForDigitalInitiative}
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
            <SignPost
              title={intl.formatMessage({
                defaultMessage: "Digital initiative forward talent plan",
                id: "BkJbK1",
                description:
                  "Title for digital initiative signpost in the _digital services contracting questionnaire_",
              })}
              introduction={intl.formatMessage(
                {
                  defaultMessage:
                    "For more information on the <link1>digital initiative forward talent plan</link1>, refer to requirement A.2.4 of the <link2>Mandatory Procedures on Digital Talent</link2>.",
                  id: "FntaLg",
                  description:
                    "Context for _digital initiative plan submitted_ fieldset in the _digital services contracting questionnaire_",
                },
                {
                  link1: (chunks: ReactNode) => {
                    const locale = getLocale(intl);
                    const url =
                      locale === "en"
                        ? "/documents/Forward_Talent_Plan_EN.docx"
                        : "/documents/Plan_prospectif_sur_les_talents_FR.docx";
                    return buildExternalLink(url, chunks);
                  },
                  link2: (chunks: ReactNode) =>
                    buildExternalLink(getDirectiveUrl(intl), chunks),
                },
              )}
            />
            <Input
              id="digitalInitiativeName"
              name="digitalInitiativeName"
              type="text"
              label={labels.digitalInitiativeName}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <RadioGroup
              legend={labels.digitalInitiativePlanSubmitted}
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
            />
            {isPlanSubmitted ? (
              <RadioGroup
                legend={labels.digitalInitiativePlanUpdated}
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
              legend={labels.digitalInitiativePlanComplemented}
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
