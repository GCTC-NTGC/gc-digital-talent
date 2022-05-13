import React from "react";
import { useIntl } from "react-intl";
import { useForm, FormProvider } from "react-hook-form";
import { errorMessages, commonMessages } from "@common/messages";
import { Checkbox, RadioGroup, Select } from "@common/components/form";
import { getLocale } from "@common/helpers/localize";
import { toast } from "react-toastify";
import { empty, notEmpty } from "@common/helpers/util";
import { navigate } from "@common/helpers/router";

import {
  Classification,
  useGetAllClassificationsAndMeQuery,
  useUpdateGovAsUserMutation,
  UpdateUserAsUserInput,
  GetAllClassificationsAndMeQuery,
  GovEmployeeType,
} from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import talentSearchRoutes from "../../talentSearchRoutes";

type FormValues = {
  govEmployeeYesNo?: "yes" | "no";
  govEmployeeType?: GovEmployeeType | null;
  lateralDeployBool?: boolean;
  currentClassificationGroup?: string;
  currentClassificationLevel?: string;
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

const formValuesToSubmitData = (
  values: FormValues,
  classifications: Classification[],
): UpdateUserAsUserInput => {
  const classificationId = classificationFormToId(
    values.currentClassificationGroup,
    values.currentClassificationLevel,
    classifications,
  );
  // various IF statements are to clean up cases where user toggles the conditionally rendered stuff before submitting
  // IE, picks term position and CS-01, then picks not a government employee before submitting, the conditionally rendered stuff still exists and can get submitted
  if (values.govEmployeeYesNo === "no") {
    return {
      isGovEmployee: false,
      govEmployeeType: null,
      interestedInLaterOrSecondment: null,
      currentClassification: {
        connect: null,
      },
    };
  }
  if (values.govEmployeeType === GovEmployeeType.Student) {
    return {
      isGovEmployee: values.govEmployeeYesNo === "yes",
      govEmployeeType: values.govEmployeeType,
      interestedInLaterOrSecondment: null,
      currentClassification: {
        disconnect: true,
      },
    };
  }
  if (values.govEmployeeType === GovEmployeeType.Casual) {
    return {
      isGovEmployee: values.govEmployeeYesNo === "yes",
      govEmployeeType: values.govEmployeeType,
      interestedInLaterOrSecondment: null,
      currentClassification: classificationId
        ? {
            connect: classificationId,
          }
        : null,
    };
  }
  return {
    isGovEmployee: values.govEmployeeYesNo === "yes",
    govEmployeeType: values.govEmployeeType,
    interestedInLaterOrSecondment: values.lateralDeployBool,
    currentClassification: classificationId
      ? {
          connect: classificationId,
        }
      : null,
  };
};

const dataToFormValues = (
  data: GetAllClassificationsAndMeQuery["me"],
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
    govEmployeeType: data?.govEmployeeType,
    lateralDeployBool: empty(data?.interestedInLaterOrSecondment)
      ? undefined
      : data?.interestedInLaterOrSecondment,
    currentClassificationGroup: data?.currentClassification?.group,
    currentClassificationLevel: data?.currentClassification?.level
      ? String(data.currentClassification.level)
      : undefined,
  };
};

export interface GovernmentInfoFormProps {
  initialData: GetAllClassificationsAndMeQuery["me"] | undefined;
  classifications: Classification[];
  submitHandler: (data: UpdateUserAsUserInput) => Promise<void>;
}

// inner component
export const GovernmentInfoForm: React.FunctionComponent<
  GovernmentInfoFormProps
> = ({ classifications, initialData, submitHandler }) => {
  const intl = useIntl();

  const defaultValues = dataToFormValues(initialData);

  const methods = useForm({
    defaultValues,
  });

  const onSubmit = (values: FormValues) =>
    submitHandler(formValuesToSubmitData(values, classifications));

  // hooks to watch, needed for conditional rendering
  const [govEmployee, govEmployeeStatus, groupSelection] = methods.watch([
    "govEmployeeYesNo",
    "govEmployeeType",
    "currentClassificationGroup",
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
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "Government Information",
            description:
              "Display Text for Government Information Form Page Link",
          }),
        },
      ]}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div>
            <div data-h2-flex-item="b(1of1) s(1of2) m(1of6) l(1of12)">
              <RadioGroup
                idPrefix="govEmployeeYesNo"
                legend={intl.formatMessage({
                  defaultMessage: "GoC Employee Status",
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
                        "No, I am not a Government of Canada employee",
                      description:
                        "Label displayed for is not a government employee option",
                    }),
                  },
                  {
                    value: "yes",
                    label: intl.formatMessage({
                      defaultMessage:
                        "Yes, I am a Government of Canada employee",
                      description:
                        "Label displayed for is a government employee option",
                    }),
                  },
                ]}
              />
            </div>
            <div data-h2-padding="b(top-bottom, m)" data-h2-flex-item="b(1of3)">
              {" "}
              {govEmployee === "yes" && (
                <RadioGroup
                  idPrefix="govEmployeeType"
                  legend={intl.formatMessage({
                    defaultMessage: "GoC Employee Status",
                    description: "Employee Status in Government Info Form",
                  })}
                  name="govEmployeeType"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  items={[
                    {
                      value: GovEmployeeType.Student,
                      label: intl.formatMessage({
                        defaultMessage: "I am a student",
                        description: "Label displayed for student option",
                      }),
                    },
                    {
                      value: GovEmployeeType.Casual,
                      label: intl.formatMessage({
                        defaultMessage: "I have a casual contract",
                        description: "Label displayed for casual option",
                      }),
                    },
                    {
                      value: GovEmployeeType.Term,
                      label: intl.formatMessage({
                        defaultMessage: "I have a term position",
                        description: "Label displayed for term option",
                      }),
                    },
                    {
                      value: GovEmployeeType.Indeterminate,
                      label: intl.formatMessage({
                        defaultMessage: "I have a indeterminate position",
                        description: "Label displayed for indeterminate option",
                      }),
                    },
                  ]}
                />
              )}
            </div>
            {govEmployee === "yes" &&
              (govEmployeeStatus === GovEmployeeType.Term ||
                govEmployeeStatus === GovEmployeeType.Indeterminate) && (
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Please indicate if you are interested in lateral deployment or secondment. Learn more about this.",
                    description:
                      "Text blurb, asking about interest in deployment/secondment in the government info form",
                  })}
                </p>
              )}
            <div data-h2-padding="b(bottom, m)">
              {govEmployee === "yes" &&
                (govEmployeeStatus === GovEmployeeType.Term ||
                  govEmployeeStatus === GovEmployeeType.Indeterminate) && (
                  <Checkbox
                    id="lateralDeployBool"
                    label={intl.formatMessage({
                      defaultMessage:
                        "I am interested in lateral deployment or secondment.",
                      description:
                        "Label displayed on lateral/secondment checkbox",
                    })}
                    name="lateralDeployBool"
                    boundingBox
                    boundingBoxLabel="Lateral Deployment"
                  />
                )}
            </div>
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
              data-h2-display="b(flex)"
              data-h2-flex-direction="b(column) s(row)"
            >
              <div data-h2-padding="s(right, l)" style={{ width: "100%" }}>
                {govEmployee === "yes" &&
                  (govEmployeeStatus === GovEmployeeType.Term ||
                    govEmployeeStatus === GovEmployeeType.Indeterminate ||
                    govEmployeeStatus === GovEmployeeType.Casual) && (
                    <Select
                      id="currentClassificationGroup"
                      label={intl.formatMessage({
                        defaultMessage: "Current Classification Group",
                        description:
                          "Label displayed on classification group input",
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
                  )}
              </div>
              <div style={{ width: "100%" }}>
                {govEmployee === "yes" &&
                  (govEmployeeStatus === GovEmployeeType.Term ||
                    govEmployeeStatus === GovEmployeeType.Indeterminate ||
                    govEmployeeStatus === GovEmployeeType.Casual) &&
                  groupSelection !== "Choose Department" && (
                    <Select
                      id="currentClassificationLevel"
                      label={intl.formatMessage({
                        defaultMessage: "Current Classification Level",
                        description:
                          "Label displayed on classification level input",
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
                  )}
              </div>
            </div>
          </div>
          <ProfileFormFooter mode="saveButton" />
        </form>
      </FormProvider>
    </ProfileFormWrapper>
  );
};

// outer, containing component
export const GovInfoFormContainer: React.FunctionComponent = () => {
  // needed bits for react-intl, form submits functions, and routing post submission
  const intl = useIntl();

  const locale = getLocale(intl);
  const paths = talentSearchRoutes(locale);

  // acquire classifications from graphQL to pass into component to render and pull "Me" at the same time
  const [lookUpResult] = useGetAllClassificationsAndMeQuery();
  const { data: lookupData, fetching: fetchingLookupData } = lookUpResult;
  const classifications: Classification[] | [] =
    lookupData?.classifications.filter(notEmpty) ?? [];
  const meInfo = lookupData?.me;
  const meId = meInfo?.id;

  // submitting the form component values back out to graphQL, after smoothing form-values to appropriate type, then return to /profile
  const [, executeMutation] = useUpdateGovAsUserMutation();
  const handleUpdateUser = (id: string, data: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: data,
    }).then((result) => {
      if (result.data?.updateUserAsUser) {
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  const onSubmit = async (data: UpdateUserAsUserInput) => {
    // tristan's suggestion to short-circuit this function if there is no id
    if (meId === undefined || meId === "") {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Error: user not found",
          description: "Message displayed to user if user is not found",
        }),
      );
      return;
    }
    await handleUpdateUser(meId, data)
      .then(() => {
        navigate(paths.profile());
        toast.success(
          intl.formatMessage({
            defaultMessage: "User updated successfully!",
            description:
              "Message displayed to user after user is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating user failed",
            description:
              "Message displayed to user after user fails to get updated.",
          }),
        );
      });
  };

  if (fetchingLookupData) {
    return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  }

  return (
    <GovernmentInfoForm
      classifications={classifications}
      initialData={meInfo}
      submitHandler={onSubmit}
    />
  );
};

export default GovInfoFormContainer;
