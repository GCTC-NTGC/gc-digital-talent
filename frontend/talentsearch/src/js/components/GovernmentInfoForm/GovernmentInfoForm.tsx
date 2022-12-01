import React from "react";
import { BriefcaseIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { IntlShape, useIntl } from "react-intl";
import { SubmitHandler, useFormContext } from "react-hook-form";

import { errorMessages, navigationMessages } from "@common/messages";
import { BasicForm, Input, RadioGroup, Select } from "@common/components/form";
import { empty } from "@common/helpers/util";
import { getGovEmployeeType } from "@common/constants/localizedConstants";
import {
  enumToOptions,
  objectsToSortedOptions,
} from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { toast } from "@common/components/Toast";
import ExternalLink from "@common/components/Link/ExternalLink";
import { FieldLabels } from "@common/components/form/BasicForm";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import {
  Classification,
  UpdateUserAsUserInput,
  GetGovInfoFormLookupDataQuery,
  GovEmployeeType,
  Department,
  PoolCandidate,
  User,
} from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import useRoutes from "../../hooks/useRoutes";
import profileMessages from "../profile/profileMessages";

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

const priorityEntitlementLink = (
  locale: string,
  chunks: React.ReactNode,
): React.ReactNode => {
  const href =
    locale === "en"
      ? "https://www.canada.ca/en/public-service-commission/services/information-priority-administration.html"
      : "https://www.canada.ca/fr/commission-fonction-publique/services/administration-priorites.html";
  return (
    <ExternalLink href={href} newTab>
      {chunks}
    </ExternalLink>
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
      department: null,
      currentClassification: {
        connect: null,
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

export interface GovernmentInfoFormProps {
  departments: Department[];
  classifications: Classification[];
  labels: FieldLabels;
}

// inner component
export const GovernmentInfoForm: React.FunctionComponent<
  GovernmentInfoFormProps
> = ({ departments, classifications, labels }) => {
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

  // create array of objects containing the classifications, then map it into an array of strings, and then remove duplicates, and then map into Select options
  // https://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array#comment87157537_42123984
  const classGroupsWithDupes: { value: string; label: string }[] =
    classifications.map((classification) => {
      return {
        value: classification.id,
        label:
          classification.group ||
          intl.formatMessage({
            defaultMessage: "Error: classification group not found.",
            id: "YA/7nb",
            description:
              "Error message if classification group is not defined.",
          }),
      };
    });
  const mapped = classGroupsWithDupes.map((x) => x.label);
  const noDupes = Array.from(new Set(mapped));
  const groupOptions = noDupes.map((options) => {
    return { value: options, label: options };
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
        if (groupSelection === "Choose Department") {
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
    <div>
      <div data-h2-flex-item="base(1of1) p-tablet(1of2) l-tablet(1of6) desktop(1of12)">
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
                  "<strong>No</strong>, I am not a Government of Canada employee",
                id: "rJMWiV",
                description:
                  "Label displayed for is not a government employee option",
              }),
            },
            {
              value: "yes",
              label: intl.formatMessage({
                defaultMessage:
                  "<strong>Yes</strong>, I am a Government of Canada employee",
                id: "jbftvG",
                description:
                  "Label displayed for is a government employee option",
              }),
            },
          ]}
        />
      </div>
      {isGovEmployee && (
        <>
          <div data-h2-padding="base(x1, 0)">
            <Select
              id="department"
              name="department"
              label={labels.department}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a department...",
                id: "WE/Nu+",
                description:
                  "Null selection for department select input in the request form.",
              })}
              options={objectsToSortedOptions(departments, intl)}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </div>
          <div
            data-h2-padding="base(0, 0, x.5, 0)"
            data-h2-flex-item="base(1of3)"
          >
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
          </div>
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
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
          >
            <div
              data-h2-padding="p-tablet(0, x2, 0, 0)"
              data-h2-width="base(100%)"
            >
              <Select
                id="currentClassificationGroup"
                label={labels.currentClassificationGroup}
                name="currentClassificationGroup"
                nullSelection={intl.formatMessage({
                  defaultMessage: "Choose Group",
                  id: "u4v1RB",
                  description: "Null selection for form.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={groupOptions}
              />
            </div>
            {groupSelection !== "Choose Department" && (
              <div style={{ width: "100%" }}>
                <Select
                  id="currentClassificationLevel"
                  label={labels.currentClassificationLevel}
                  name="currentClassificationLevel"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Choose Level",
                    id: "e/ez/m",
                    description: "Null selection for form.",
                  })}
                  options={levelOptions}
                />
              </div>
            )}
          </div>
        </>
      )}
      <div data-h2-flex-item="base(1of1) p-tablet(1of2) l-tablet(1of6) desktop(1of12)">
        <p data-h2-padding="base(x1, 0)">
          {intl.formatMessage(
            {
              defaultMessage:
                "Do you have a priority entitlement for Government of Canada job applications? This is a status provided by the Public Service Commission of Canada. To learn more, <priorityEntitlementLink>visit the information on priority entitlements site</priorityEntitlementLink>.",
              id: "25VYzu",
              description:
                "Sentence asking whether the user possesses priority entitlement",
            },
            {
              priorityEntitlementLink: (chunks) =>
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
          <div data-h2-padding="base(x.25, 0)">
            <Input
              id="priorityEntitlementNumber"
              type="text"
              label={labels.priorityEntitlementNumber}
              name="priorityEntitlementNumber"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export interface GovInfoFormWithProfileWrapperProps {
  departments: Department[];
  classifications: Classification[];
  initialData: User;
  application?: PoolCandidate;
  submitHandler: (data: UpdateUserAsUserInput) => Promise<void>;
}

export const GovInfoFormWithProfileWrapper: React.FunctionComponent<
  GovInfoFormWithProfileWrapperProps
> = ({
  departments,
  classifications,
  initialData,
  application,
  submitHandler,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const returnRoute =
    application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
      ? paths.reviewApplication(application.id)
      : paths.profile(initialData.id);

  const labels = getGovernmentInfoLabels(intl);

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    await submitHandler(formValuesToSubmitData(formValues, classifications))
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
          title: intl.formatMessage({
            defaultMessage: "My Applications",
            id: "mq4G8h",
            description:
              "'My Applications' breadcrumb from applicant profile wrapper.",
          }),
          href: paths.applications(application.user.id),
          icon: <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />,
        },
        {
          title: getFullPoolAdvertisementTitle(
            intl,
            application.poolAdvertisement,
          ),
          href: paths.pool(application.pool.id),
        },
        {
          href: paths.reviewApplication(application.id),
          title: intl.formatMessage(navigationMessages.stepOne),
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
      title={intl.formatMessage({
        defaultMessage: "Government Information",
        id: "xDgNfZ",
        description:
          "Title for Profile Form Wrapper in Government Information Form",
      })}
      cancelLink={{
        href: returnRoute,
      }}
      crumbs={[
        ...applicationBreadcrumbs,
        {
          title: intl.formatMessage({
            defaultMessage: "Government Information",
            id: "Uh9Yj4",
            description:
              "Display Text for Government Information Form Page Link",
          }),
        },
      ]}
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
        <GovernmentInfoForm
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

export default GovInfoFormWithProfileWrapper;
