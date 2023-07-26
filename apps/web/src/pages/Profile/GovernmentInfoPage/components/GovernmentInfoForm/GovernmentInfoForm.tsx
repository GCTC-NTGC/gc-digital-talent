import React from "react";
import { useNavigate } from "react-router-dom";
import { IntlShape, useIntl } from "react-intl";
import { SubmitHandler, useFormContext } from "react-hook-form";
import uniqBy from "lodash/uniqBy";

import {
  errorMessages,
  navigationMessages,
  getGovEmployeeType,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  BasicForm,
  Input,
  RadioGroup,
  Select,
  enumToOptions,
  objectsToSortedOptions,
  FieldLabels,
} from "@gc-digital-talent/forms";
import { empty, notEmpty } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import { Link } from "@gc-digital-talent/ui";

import { splitAndJoin } from "~/utils/nameUtils";
import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import {
  Classification,
  UpdateUserAsUserInput,
  GetGovInfoFormLookupDataQuery,
  GovEmployeeType,
  Department,
  PoolCandidate,
  User,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import useApplicationInfo from "~/hooks/useApplicationInfo";
import profileMessages from "~/messages/profileMessages";
import ProfileFormWrapper, {
  ProfileFormFooter,
} from "~/components/ProfileFormWrapper/ProfileFormWrapper";

type FormValues = {
  govEmployeeYesNo?: "yes" | "no";
  govEmployeeType?: GovEmployeeType | null;
  lateralDeployBool?: boolean;
  department?: string;
  currentClassificationGroup?: string;
  currentClassificationLevel?: string;
  priorityEntitlementYesNo?: "yes" | "no";
  priorityEntitlementNumber?: string;
};

const priorityEntitlementLink = (locale: string, chunks: React.ReactNode) => {
  const href =
    locale === "en"
      ? "https://www.canada.ca/en/public-service-commission/services/information-priority-administration.html"
      : "https://www.canada.ca/fr/commission-fonction-publique/services/administration-priorites.html";
  return (
    <Link href={href} newTab external>
      {chunks}
    </Link>
  );
};

// take classification group + level from data, return the matching classification from API
// need to fit to the expected type when this function is called in formToData
const classificationFormToId = (
  group: string | undefined,
  level: string | undefined,
  classifications: Classification[],
): string | undefined => {
  return classifications.find(
    (classification) =>
      classification.group === group && classification.level === Number(level),
  )?.id;
};

export const formValuesToSubmitData = (
  values: FormValues,
  classifications: Classification[],
): UpdateUserAsUserInput => {
  const classificationId = classificationFormToId(
    values.currentClassificationGroup,
    values.currentClassificationLevel,
    classifications,
  );

  // various IF statements are to clean up cases where user toggles the conditionally rendered stuff before submitting
  // IE, picks term position and IT-01, then picks not a government employee before submitting, the conditionally rendered stuff still exists and can get submitted
  if (values.govEmployeeYesNo === "no") {
    return {
      isGovEmployee: false,
      govEmployeeType: null,
      department: { disconnect: true },
      currentClassification: {
        disconnect: true,
      },
      hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
      priorityNumber:
        values.priorityEntitlementYesNo === "yes" &&
        values.priorityEntitlementNumber
          ? values.priorityEntitlementNumber
          : null,
    };
  }
  if (values.govEmployeeType === GovEmployeeType.Student) {
    return {
      isGovEmployee: values.govEmployeeYesNo === "yes",
      govEmployeeType: values.govEmployeeType,
      department: values.department ? { connect: values.department } : null,
      currentClassification: {
        disconnect: true,
      },
      hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
      priorityNumber:
        values.priorityEntitlementYesNo === "yes" &&
        values.priorityEntitlementNumber
          ? values.priorityEntitlementNumber
          : null,
    };
  }
  if (values.govEmployeeType === GovEmployeeType.Casual) {
    return {
      isGovEmployee: values.govEmployeeYesNo === "yes",
      govEmployeeType: values.govEmployeeType,
      department: values.department ? { connect: values.department } : null,
      currentClassification: classificationId
        ? {
            connect: classificationId,
          }
        : null,
      hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
      priorityNumber:
        values.priorityEntitlementYesNo === "yes" &&
        values.priorityEntitlementNumber
          ? values.priorityEntitlementNumber
          : null,
    };
  }
  return {
    isGovEmployee: values.govEmployeeYesNo === "yes",
    govEmployeeType: values.govEmployeeType,
    department: values.department ? { connect: values.department } : null,
    currentClassification: classificationId
      ? {
          connect: classificationId,
        }
      : null,
    hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
    priorityNumber:
      values.priorityEntitlementYesNo === "yes" &&
      values.priorityEntitlementNumber
        ? values.priorityEntitlementNumber
        : null,
  };
};

const dataToFormValues = (
  data: GetGovInfoFormLookupDataQuery["me"],
): FormValues => {
  const boolToYesNo = (
    bool: boolean | null | undefined,
  ): "yes" | "no" | undefined => {
    if (empty(bool)) {
      return undefined;
    }
    return bool ? "yes" : "no";
  };
  return {
    govEmployeeYesNo: boolToYesNo(data?.isGovEmployee),
    priorityEntitlementYesNo: boolToYesNo(data?.hasPriorityEntitlement),
    priorityEntitlementNumber: data?.priorityNumber
      ? data.priorityNumber
      : undefined,
    govEmployeeType: data?.govEmployeeType,
    lateralDeployBool: undefined,
    department: data?.department?.id,
    currentClassificationGroup: data?.currentClassification?.group,
    currentClassificationLevel: data?.currentClassification?.level
      ? String(data.currentClassification.level)
      : undefined,
  };
};

export const getGovernmentInfoLabels = (intl: IntlShape) => ({
  govEmployeeYesNo: intl.formatMessage({
    defaultMessage: "Do you currently work for the government of Canada?",
    id: "MtONBT",
    description: "Employee Status in Government Info Form",
  }),
  department: intl.formatMessage({
    defaultMessage: "Which department do you work for?",
    id: "NP/fsS",
    description: "Label for department select input in the request form",
  }),
  govEmployeeType: intl.formatMessage({
    defaultMessage: "As an employee, what is your employment status?",
    id: "3f9P13",
    description: "Employee Status in Government Info Form",
  }),
  currentClassificationGroup: intl.formatMessage({
    defaultMessage: "Current Classification Group",
    id: "/K1/1n",
    description: "Label displayed on classification group input",
  }),
  currentClassificationLevel: intl.formatMessage({
    defaultMessage: "Current Classification Level",
    id: "gnGAe8",
    description: "Label displayed on classification level input",
  }),
  priorityEntitlementYesNo: intl.formatMessage({
    defaultMessage: "Priority Entitlement",
    id: "FqXo5j",
    description: "Priority Entitlement Status in Government Info Form",
  }),
  priorityEntitlementNumber: intl.formatMessage({
    defaultMessage:
      "Priority number provided by the Public Service Commission of Canada",
    id: "5G+j56",
    description: "Label for priority number input",
  }),
});

export interface GovernmentInfoFormFieldsProps {
  departments: Department[];
  classifications: Classification[];
  labels: FieldLabels;
}

// inner component
export const GovernmentInfoFormFields = ({
  departments,
  classifications,
  labels,
}: GovernmentInfoFormFieldsProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { watch, resetField } = useFormContext();
  // hooks to watch, needed for conditional rendering
  const [govEmployee, govEmployeeStatus, groupSelection, priorityEntitlement] =
    watch([
      "govEmployeeYesNo",
      "govEmployeeType",
      "currentClassificationGroup",
      "priorityEntitlementYesNo",
    ]);

  const classGroupsWithDupes: {
    label: string;
    ariaLabel: string;
  }[] = classifications.map((classification) => {
    return {
      label:
        classification.group ||
        intl.formatMessage({
          defaultMessage: "Error: classification group not found.",
          id: "YA/7nb",
          description: "Error message if classification group is not defined.",
        }),
      ariaLabel: `${getLocalizedName(classification.name, intl)} ${splitAndJoin(
        classification.group,
      )}`,
    };
  });
  const noDupes = uniqBy(classGroupsWithDupes, "label");
  const groupOptions = noDupes.map(({ label, ariaLabel }) => {
    return {
      value: label,
      label,
      ariaLabel,
    };
  });

  // generate classification levels from the selected group
  const levelOptions = classifications
    .filter((x) => x.group === groupSelection)
    .map((iterator) => {
      return {
        value: iterator.level.toString(),
        label: iterator.level.toString(),
      };
    });

  const hasPriorityEntitlement = priorityEntitlement === "yes";
  const isGovEmployee = govEmployee === "yes";
  const isPlaced =
    isGovEmployee &&
    (govEmployeeStatus === GovEmployeeType.Term ||
      govEmployeeStatus === GovEmployeeType.Indeterminate ||
      govEmployeeStatus === GovEmployeeType.Casual);

  /**
   * Reset fields when they disappear
   * to avoid confusing users about unsaved changes
   */
  React.useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, {
        keepDirty: false,
      });
    };

    if (!isGovEmployee) {
      resetDirtyField("department");
      resetDirtyField("govEmployeeType");
      if (!isPlaced) {
        resetDirtyField("currentClassificationGroup");
        if (empty(groupSelection)) {
          resetDirtyField("currentClassificationLevel");
        }
      }
    }

    if (!hasPriorityEntitlement) {
      resetDirtyField("priorityEntitlementNumber");
    }
  }, [
    isGovEmployee,
    resetField,
    isPlaced,
    groupSelection,
    hasPriorityEntitlement,
  ]);

  // render the actual form
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1 0)"
      data-h2-margin="base(x1 0)"
    >
      <RadioGroup
        idPrefix="govEmployeeYesNo"
        legend={labels.govEmployeeYesNo}
        id="govEmployeeYesNo"
        name="govEmployeeYesNo"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={[
          {
            value: "no",
            label: intl.formatMessage({
              defaultMessage:
                "<strong>No</strong>, I am not a Government of Canada employee.",
              id: "PS/LFb",
              description:
                "Label displayed for is not a government employee option",
            }),
          },
          {
            value: "yes",
            label: intl.formatMessage({
              defaultMessage:
                "<strong>Yes</strong>, I am a Government of Canada employee.",
              id: "gto/zD",
              description:
                "Label displayed for is a government employee option",
            }),
          },
        ]}
      />
      {isGovEmployee && (
        <>
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
            options={objectsToSortedOptions(departments, intl)}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <RadioGroup
            idPrefix="govEmployeeType"
            legend={labels.govEmployeeType}
            name="govEmployeeType"
            id="govEmployeeType"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            items={enumToOptions(GovEmployeeType).map(({ value }) => ({
              value,
              label: intl.formatMessage(getGovEmployeeType(value)),
            }))}
          />
        </>
      )}
      {isPlaced && (
        <>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Please indicate your current substantive group classification and level.",
              id: "TS63OC",
              description:
                "Text blurb, asking about classification and level in the government info form",
            })}
          </p>
          <div
            data-h2-display="base(grid)"
            data-h2-gap="base(x1)"
            data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
            data-h2-margin="base(x1 0)"
          >
            <Select
              id="currentClassificationGroup"
              label={labels.currentClassificationGroup}
              name="currentClassificationGroup"
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a group",
                id: "9Upe1V",
                description: "Null selection for form.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              options={groupOptions}
            />
            {notEmpty(groupSelection) && (
              <Select
                id="currentClassificationLevel"
                label={labels.currentClassificationLevel}
                name="currentClassificationLevel"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a level",
                  id: "/ImWz4",
                  description: "Null selection for form.",
                })}
                options={levelOptions}
              />
            )}
          </div>
        </>
      )}
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "Do you have a priority entitlement for Government of Canada job applications? This is a status provided by the Public Service Commission of Canada. To learn more, <priorityEntitlementLink>visit the information on priority entitlements site</priorityEntitlementLink>.",
            id: "25VYzu",
            description:
              "Sentence asking whether the user possesses priority entitlement",
          },
          {
            priorityEntitlementLink: (chunks: React.ReactNode) =>
              priorityEntitlementLink(locale, chunks),
          },
        )}
      </p>
      <RadioGroup
        idPrefix="priorityEntitlementYesNo"
        legend={labels.priorityEntitlementYesNo}
        name="priorityEntitlementYesNo"
        id="priorityEntitlementYesNo"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={[
          {
            value: "no",
            label: intl.formatMessage({
              defaultMessage: "I do not have a priority entitlement",
              id: "brQu7D",
              description:
                "Label displayed for does not have priority entitlement option",
            }),
          },
          {
            value: "yes",
            label: intl.formatMessage({
              defaultMessage: "I have a priority entitlement",
              id: "uQ8Tss",
              description:
                "Label displayed does have priority entitlement option",
            }),
          },
        ]}
      />
      {hasPriorityEntitlement && (
        <Input
          id="priorityEntitlementNumber"
          type="text"
          label={labels.priorityEntitlementNumber}
          name="priorityEntitlementNumber"
        />
      )}
    </div>
  );
};

export interface GovernmentInfoFormProps {
  departments: Department[];
  classifications: Classification[];
  initialData: User;
  application?: PoolCandidate;
  submitHandler: (data: UpdateUserAsUserInput) => Promise<void>;
}

const GovernmentInfoForm = ({
  departments,
  classifications,
  initialData,
  application,
  submitHandler,
}: GovernmentInfoFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const { id: applicationId, returnRoute } = useApplicationInfo(initialData.id);

  const labels = getGovernmentInfoLabels(intl);

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    return submitHandler(formValuesToSubmitData(formValues, classifications))
      .then(() => {
        navigate(returnRoute);
        toast.success(intl.formatMessage(profileMessages.userUpdated));
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  const applicationBreadcrumbs = application
    ? [
        {
          label: intl.formatMessage({
            defaultMessage: "My applications",
            id: "bdDvMZ",
            description:
              "My applications breadcrumb from applicant profile wrapper.",
          }),
          url: paths.applications(application.user.id),
        },
        {
          label: getFullPoolTitleHtml(intl, application.pool),
          url: paths.pool(application.pool.id),
        },
        {
          label: intl.formatMessage(navigationMessages.stepOne),
          url: paths.application(applicationId ?? ""),
        },
        {
          label: intl.formatMessage(navigationMessages.governmentInformation),
          url: `${paths.governmentInformation(initialData.id)}${
            applicationId ? `?applicationId=${applicationId}` : ``
          }`,
        },
      ]
    : [];

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "Please indicate if you are currently an employee in the Government of Canada.",
        id: "6vsgLY",
        description:
          "Description blurb for Profile Form Wrapper in the Government Information Form",
      })}
      title={intl.formatMessage(navigationMessages.governmentInformation)}
      crumbs={
        applicationBreadcrumbs?.length
          ? applicationBreadcrumbs
          : [
              {
                label: intl.formatMessage(
                  navigationMessages.governmentInformation,
                ),
                url: paths.governmentInformation(initialData.id),
              },
            ]
      }
      prefixBreadcrumbs={!application}
    >
      <BasicForm
        labels={labels}
        cacheKey="gov-info-form"
        onSubmit={handleSubmit}
        options={{
          mode: "onBlur",
          defaultValues: dataToFormValues(initialData),
        }}
      >
        <GovernmentInfoFormFields
          labels={labels}
          departments={departments}
          classifications={classifications}
        />
        <ProfileFormFooter
          mode="saveButton"
          cancelLink={{ href: returnRoute }}
        />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export default GovernmentInfoForm;
