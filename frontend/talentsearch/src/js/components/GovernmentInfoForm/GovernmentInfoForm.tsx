import React from "react";
import { useIntl } from "react-intl";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { errorMessages } from "@common/messages";
import { Input, RadioGroup, Select } from "@common/components/form";
import { empty } from "@common/helpers/util";
import { getGovEmployeeType } from "@common/constants/localizedConstants";
import {
  enumToOptions,
  objectsToSortedOptions,
} from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { navigate } from "@common/helpers/router";
import { toast } from "react-toastify";
import { BriefcaseIcon } from "@heroicons/react/24/solid";
import {
  Classification,
  UpdateUserAsUserInput,
  GetGovInfoFormLookupDataQuery,
  GovEmployeeType,
  Maybe,
  Department,
  PoolCandidate,
  User,
} from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import applicantProfileRoutes from "../../applicantProfileRoutes";
import directIntakeRoutes from "../../directIntakeRoutes";
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

export interface GovernmentInfoFormProps {
  departments: Department[];
  classifications: Classification[];
  govEmployee: Maybe<string>;
  govEmployeeStatus: Maybe<GovEmployeeType>;
  groupSelection: Maybe<string>;
  priorityEntitlement: Maybe<string>;
}

// inner component
export const GovernmentInfoForm: React.FunctionComponent<
  GovernmentInfoFormProps
> = ({
  departments,
  classifications,
  govEmployee,
  govEmployeeStatus,
  groupSelection,
  priorityEntitlement,
}) => {
  const intl = useIntl();
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

  // render the actual form
  return (
    <div>
      <div data-h2-flex-item="base(1of1) p-tablet(1of2) l-tablet(1of6) desktop(1of12)">
        <RadioGroup
          idPrefix="govEmployeeYesNo"
          legend={intl.formatMessage({
            defaultMessage:
              "Do you currently work for the government of Canada?",
            description: "Employee Status in Government Info Form",
          })}
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
                description:
                  "Label displayed for is not a government employee option",
              }),
            },
            {
              value: "yes",
              label: intl.formatMessage({
                defaultMessage:
                  "<strong>Yes</strong>, I am a Government of Canada employee",
                description:
                  "Label displayed for is a government employee option",
              }),
            },
          ]}
        />
      </div>
      {govEmployee === "yes" && (
        <>
          <div data-h2-padding="base(x1, 0)">
            <Select
              id="department"
              name="department"
              label={intl.formatMessage({
                defaultMessage: "Which department do you work for?",
                description:
                  "Label for department select input in the request form",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a department...",
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
              legend={intl.formatMessage({
                defaultMessage:
                  "As an employee, what is your employment status?",
                description: "Employee Status in Government Info Form",
              })}
              name="govEmployeeType"
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
      {govEmployee === "yes" &&
        (govEmployeeStatus === GovEmployeeType.Term ||
          govEmployeeStatus === GovEmployeeType.Indeterminate ||
          govEmployeeStatus === GovEmployeeType.Casual) && (
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Please indicate your current substantive group classification and level.",
              description:
                "Text blurb, asking about classification and level in the government info form",
            })}
          </p>
        )}
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
      >
        {govEmployee === "yes" &&
          (govEmployeeStatus === GovEmployeeType.Term ||
            govEmployeeStatus === GovEmployeeType.Indeterminate ||
            govEmployeeStatus === GovEmployeeType.Casual) && (
            <div
              data-h2-padding="p-tablet(0, x2, 0, 0)"
              data-h2-width="base(100%)"
            >
              <Select
                id="currentClassificationGroup"
                label={intl.formatMessage({
                  defaultMessage: "Current Classification Group",
                  description: "Label displayed on classification group input",
                })}
                name="currentClassificationGroup"
                nullSelection={intl.formatMessage({
                  defaultMessage: "Choose Group",
                  description: "Null selection for form.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={groupOptions}
              />
            </div>
          )}
        {govEmployee === "yes" &&
          (govEmployeeStatus === GovEmployeeType.Term ||
            govEmployeeStatus === GovEmployeeType.Indeterminate ||
            govEmployeeStatus === GovEmployeeType.Casual) &&
          groupSelection !== "Choose Department" && (
            <div style={{ width: "100%" }}>
              <Select
                id="currentClassificationLevel"
                label={intl.formatMessage({
                  defaultMessage: "Current Classification Level",
                  description: "Label displayed on classification level input",
                })}
                name="currentClassificationLevel"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Choose Level",
                  description: "Null selection for form.",
                })}
                options={levelOptions}
              />
            </div>
          )}
      </div>
      <div data-h2-flex-item="base(1of1) p-tablet(1of2) l-tablet(1of6) desktop(1of12)">
        <p data-h2-padding="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage:
              "Do you have a priority entitlement for Government of Canada job applications?",
            description:
              "Sentence asking whether the user possesses priority entitlement",
          })}
        </p>
        <RadioGroup
          idPrefix="priorityEntitlementYesNo"
          legend={intl.formatMessage({
            defaultMessage: "Priority Entitlement",
            description: "Priority Entitlement Status in Government Info Form",
          })}
          name="priorityEntitlementYesNo"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={[
            {
              value: "no",
              label: intl.formatMessage({
                defaultMessage: "I do not have a priority entitlement",
                description:
                  "Label displayed for does not have priority entitlement option",
              }),
            },
            {
              value: "yes",
              label: intl.formatMessage({
                defaultMessage: "I have a priority entitlement",
                description:
                  "Label displayed does have priority entitlement option",
              }),
            },
          ]}
        />
        {priorityEntitlement === "yes" && (
          <div data-h2-padding="base(x.25, 0)">
            <Input
              id="priorityEntitlementNumber"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "Priority number",
                description: "label for priority number input",
              })}
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
  const locale = getLocale(intl);
  const profilePaths = applicantProfileRoutes(locale);
  const directIntakePaths = directIntakeRoutes(locale);
  const returnRoute =
    application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
      ? directIntakePaths.poolApply(application.pool.id)
      : profilePaths.home(initialData.id);

  const defaultValues = dataToFormValues(initialData);

  const methods = useForm({
    defaultValues,
  });

  const onSubmit: SubmitHandler<FormValues> = async (formValues) => {
    await submitHandler(formValuesToSubmitData(formValues, classifications))
      .then(() => {
        navigate(returnRoute);
        toast.success(intl.formatMessage(profileMessages.userUpdated));
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  // hooks to watch, needed for conditional rendering
  const [govEmployee, govEmployeeStatus, groupSelection, priorityEntitlement] =
    methods.watch([
      "govEmployeeYesNo",
      "govEmployeeType",
      "currentClassificationGroup",
      "priorityEntitlementYesNo",
    ]);

  const applicationBreadcrumbs = application
    ? [
        {
          title: intl.formatMessage({
            defaultMessage: "My Applications",
            description:
              "'My Applications' breadcrumb from applicant profile wrapper.",
          }),
          href: directIntakePaths.applications(application.user.id),
          icon: <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />,
        },
        {
          title:
            application.poolAdvertisement?.name?.[locale] ||
            intl.formatMessage({
              defaultMessage: "Pool name not found",
              description:
                "Pools name breadcrumb from applicant profile wrapper if no name set.",
            }),
          href: directIntakePaths.poolApply(application.pool.id),
        },
      ]
    : [];

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "Please indicate if you are currently an employee in the Government of Canada.",
        description:
          "Description blurb for Profile Form Wrapper in the Government Information Form",
      })}
      title={intl.formatMessage({
        defaultMessage: "Government Information",
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
            description:
              "Display Text for Government Information Form Page Link",
          }),
        },
      ]}
      prefixBreadcrumbs={!application}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <GovernmentInfoForm
            departments={departments}
            classifications={classifications}
            govEmployee={govEmployee}
            govEmployeeStatus={govEmployeeStatus}
            groupSelection={groupSelection}
            priorityEntitlement={priorityEntitlement}
          />
          <ProfileFormFooter mode="saveButton" />
        </form>
      </FormProvider>
    </ProfileFormWrapper>
  );
};

export default GovInfoFormWithProfileWrapper;
