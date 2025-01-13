import { JSX, useEffect } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import TagIcon from "@heroicons/react/24/outline/TagIcon";
import { useQuery } from "urql";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import {
  commonMessages,
  formMessages,
  uiMessages,
  sortOpportunityLength,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  CheckboxOption,
  Checklist,
  Input,
  RadioGroup,
  Select,
  Submit,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  PoolStatus,
  FragmentType,
  getFragment,
  graphql,
  PoolSelectionLimitation,
  PoolAreaOfSelection,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import {
  isInNullState,
  hasEmptyRequiredFields,
} from "~/validators/process/classification";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import processMessages from "~/messages/processMessages";

import { useEditPoolContext } from "../EditPoolContext";
import Display from "./Display";
import {
  FormValues,
  PoolNameSubmitData,
  dataToFormValues,
  formValuesToSubmitData,
  getClassificationOptions,
  getDepartmentOptions,
} from "./utils";
import { SectionProps } from "../../types";
import ActionWrapper from "../ActionWrapper";

const EditPoolName_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolName on Pool {
    id
    status {
      value
      label {
        en
        fr
      }
    }
    processNumber
    publishingGroup {
      value
      label {
        en
        fr
      }
    }
    opportunityLength {
      value
      label {
        en
        fr
      }
    }
    workStream {
      id
      name {
        en
        fr
      }
    }
    classification {
      id
      group
      level
    }
    department {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    name {
      en
      fr
    }
    areaOfSelection {
      value
      label {
        en
        fr
      }
    }
    selectionLimitations {
      value
      label {
        en
        fr
      }
    }
  }
`);

export const PoolClassification_Fragment = graphql(/* GraphQL */ `
  fragment PoolClassification on Classification {
    id
    group
    level
    name {
      en
      fr
    }
  }
`);

export const PoolDepartment_Fragment = graphql(/* GraphQL */ `
  fragment PoolDepartment on Department {
    id
    name {
      en
      fr
    }
  }
`);

const PoolNameOptions_Query = graphql(/* GraphQL */ `
  query PoolNameOptions {
    publishingGroups: localizedEnumStrings(enumName: "PublishingGroup") {
      value
      label {
        en
        fr
      }
    }
    workStreams {
      id
      name {
        en
        fr
      }
    }
    opportunityLengths: localizedEnumStrings(
      enumName: "PoolOpportunityLength"
    ) {
      value
      label {
        en
        fr
      }
    }
    allPoolAreaOfSelections: localizedEnumStrings(
      enumName: "PoolAreaOfSelection"
    ) {
      value
      label {
        en
        fr
      }
    }
    allPoolSelectionLimitations: localizedEnumStrings(
      enumName: "PoolSelectionLimitation"
    ) {
      value
      label {
        en
        fr
      }
    }
  }
`);

type PoolNameSectionProps = SectionProps<
  PoolNameSubmitData,
  FragmentType<typeof EditPoolName_Fragment>
> & {
  classificationsQuery: FragmentType<typeof PoolClassification_Fragment>[];
  departmentsQuery: FragmentType<typeof PoolDepartment_Fragment>[];
};

const PoolNameSection = ({
  poolQuery,
  classificationsQuery,
  departmentsQuery,
  sectionMetadata,
  onSave,
}: PoolNameSectionProps): JSX.Element => {
  const intl = useIntl();
  const [{ data }] = useQuery({ query: PoolNameOptions_Query });
  const pool = getFragment(EditPoolName_Fragment, poolQuery);
  const isNull = isInNullState(pool);
  const emptyRequired = hasEmptyRequiredFields(pool);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired,
    fallbackIcon: TagIcon,
  });
  const classifications = getFragment(
    PoolClassification_Fragment,
    classificationsQuery,
  );
  const departments = getFragment(PoolDepartment_Fragment, departmentsQuery);

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit, watch, resetField } = methods;

  // hooks to watch, needed for conditional rendering
  const [selectedAreaOfSelection] = watch(["areaOfSelection"]);
  const isAreaOfSelectionEmployeesOnly =
    selectedAreaOfSelection === PoolAreaOfSelection.Employees;

  /**
   * Reset un-rendered fields
   */
  useEffect(() => {
    const resetDirtyField = (name: keyof FormValues) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // Reset all optional fields
    if (!isAreaOfSelectionEmployeesOnly) {
      resetDirtyField("selectionLimitations");
    }
  }, [resetField, isAreaOfSelectionEmployeesOnly]);

  const handleSave = async (formValues: FormValues) => {
    return onSave(formValuesToSubmitData(formValues))
      .then(() => {
        methods.reset(formValues, {
          keepDirty: false,
        });
        setIsEditing(false);
      })
      .catch(() => methods.reset(formValues));
  };

  const allPoolSelectionLimitations = unpackMaybes(
    data?.allPoolSelectionLimitations,
  );

  const poolSelectionLimitationsCaptions: Record<
    PoolSelectionLimitation,
    string
  > = {
    AT_LEVEL_ONLY: intl.formatMessage({
      defaultMessage:
        "This will indicate to applicants that only at-level or equivalent level employees will be considered for this opportunity.",
      id: "p+rROQ",
      description: "Caption for the at-level-only selection limitation",
    }),
    DEPARTMENTAL_PREFERENCE: intl.formatMessage({
      defaultMessage:
        "This will indicate to applicants that people employed by the departments linked to this opportunity will be given preference during selection.",
      id: "js5ZcB",
      description:
        "Caption for the departmental-preference selection limitation",
    }),
  };

  const allPoolSelectionLimitationItems =
    allPoolSelectionLimitations.map<CheckboxOption>(({ value, label }) => ({
      value: value,
      label: getLocalizedName(label, intl),
      contentBelow:
        poolSelectionLimitationsCaptions[value as PoolSelectionLimitation],
    }));

  // disabled unless status is draft
  const formDisabled = pool.status?.value !== PoolStatus.Draft;

  const subtitle = intl.formatMessage({
    defaultMessage:
      "This section covers the process's basics, including classification, job title, and closing date.",
    id: "7Yacsa",
    description: "Describes selecting a advertisement details for a process.",
  });

  return (
    <ToggleSection.Root
      id={`${sectionMetadata.id}-form`}
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h4"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={formDisabled}
            sectionTitle={sectionMetadata.title}
          />
        }
        data-h2-font-weight="base(bold)"
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <p>{subtitle}</p>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay />
          ) : (
            <Display
              pool={pool}
              allPoolSelectionLimitations={allPoolSelectionLimitations}
            />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(grid)"
                data-h2-gap="base(x1)"
                data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
                data-h2-margin-bottom="base(x1)"
              >
                <div data-h2-grid-column="l-tablet(1 / span 2)">
                  <RadioGroup
                    id="areaOfSelection"
                    idPrefix="areaOfSelection"
                    legend={intl.formatMessage(processMessages.areaOfSelection)}
                    name="areaOfSelection"
                    disabled={formDisabled}
                    items={localizedEnumToOptions(
                      data?.allPoolAreaOfSelections,
                      intl,
                      [
                        PoolAreaOfSelection.Public,
                        PoolAreaOfSelection.Employees,
                      ],
                    )}
                  />
                </div>
                {isAreaOfSelectionEmployeesOnly && (
                  <div data-h2-grid-column="l-tablet(1 / span 2)">
                    <Checklist
                      id="selectionLimitations"
                      idPrefix="selectionLimitations"
                      name="selectionLimitations"
                      legend={intl.formatMessage(
                        processMessages.selectionLimitations,
                      )}
                      items={allPoolSelectionLimitationItems}
                    />
                  </div>
                )}
                <Select
                  id="classification"
                  label={intl.formatMessage({
                    defaultMessage: "Classification",
                    id: "w/qZsH",
                    description:
                      "Label displayed on the pool form classification field.",
                  })}
                  name="classification"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  options={getClassificationOptions(classifications, intl)}
                  disabled={formDisabled}
                />
                <Select
                  id="stream"
                  label={intl.formatMessage({
                    defaultMessage: "Work stream",
                    id: "UKw7sB",
                    description:
                      "Label displayed on the pool form stream/job title field.",
                  })}
                  name="stream"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  options={unpackMaybes(data?.workStreams).map(
                    (workStream) => ({
                      value: workStream.id,
                      label: getLocalizedName(workStream?.name, intl),
                    }),
                  )}
                  disabled={formDisabled}
                />
                <Input
                  id="specificTitleEn"
                  name="specificTitleEn"
                  type="text"
                  label={intl.formatMessage(processMessages.titleEn)}
                  disabled={formDisabled}
                />
                <Input
                  id="specificTitleFr"
                  name="specificTitleFr"
                  type="text"
                  label={intl.formatMessage(processMessages.titleFr)}
                  disabled={formDisabled}
                />
              </div>
              <div
                data-h2-display="base(grid)"
                data-h2-gap="base(x1)"
                data-h2-margin-bottom="base(x1)"
              >
                <Select
                  id="department"
                  label={intl.formatMessage(commonMessages.department)}
                  name="department"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  options={getDepartmentOptions(departments, intl)}
                  disabled={formDisabled}
                />
                <Select
                  id="opportunityLength"
                  name="opportunityLength"
                  label={intl.formatMessage(processMessages.employmentDuration)}
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  options={localizedEnumToOptions(
                    sortOpportunityLength(data?.opportunityLengths),
                    intl,
                  )}
                  disabled={formDisabled}
                  doNotSort
                />
                <Input
                  id="processNumber"
                  name="processNumber"
                  type="text"
                  label={intl.formatMessage({
                    defaultMessage: "Process Number",
                    id: "1E0RiD",
                    description: "Label for a pools process number",
                  })}
                  context={intl.formatMessage({
                    defaultMessage:
                      "This process number is obtained from your HR shop",
                    id: "Ao/+Ba",
                    description:
                      "Additional context describing the pools process number.",
                  })}
                  disabled={formDisabled}
                />
                <Select
                  id="publishingGroup"
                  label={intl.formatMessage(processMessages.publishingGroup)}
                  name="publishingGroup"
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a publishing group",
                    id: "Y0WLp5",
                    description: "Placeholder for publishing group field",
                  })}
                  options={localizedEnumToOptions(data?.publishingGroups, intl)}
                  disabled={formDisabled}
                />
              </div>

              <ActionWrapper>
                {!formDisabled && (
                  <Submit
                    text={intl.formatMessage(formMessages.saveChanges)}
                    aria-label={intl.formatMessage({
                      defaultMessage: "Save advertisement details",
                      id: "sF6S0Z",
                      description:
                        "Text on a button to save advertisement details",
                    })}
                    color="secondary"
                    mode="solid"
                    isSubmitting={isSubmitting}
                  />
                )}
                <ToggleSection.Close>
                  <Button mode="inline" type="button" color="quaternary">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </ToggleSection.Close>
              </ActionWrapper>
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default PoolNameSection;
export type { PoolNameSubmitData };
