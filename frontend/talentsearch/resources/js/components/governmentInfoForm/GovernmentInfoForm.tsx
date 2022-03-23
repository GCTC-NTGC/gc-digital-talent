import React from "react";
import { useIntl } from "react-intl";
import { useWatch, useForm } from "react-hook-form";
import { errorMessages } from "@common/messages";
import { Checkbox, RadioGroup, Select } from "@common/components/form";
import { getLocale } from "@common/helpers/localize";
import { fakeClassifications } from "@common/fakeData";
import { Classification } from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

export type FormValues = {
  govEmployeeYesNo: string;
  govEmployeeStatus: string;
  lateralDeployBool: boolean;
  currentClassificationGroup: string;
  currentClassificationLevel: string;
};

export const GovernmentInfoForm: React.FunctionComponent<{
  classifications: Classification[];
}> = ({ classifications }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const govEmployee = useWatch({
    name: "gov-employee-yesno",
    defaultValue: "no",
  });
  const govEmployeeStatus = useWatch({
    name: "gov-employee-status",
    defaultValue: "student",
  });

  const classGroupsWithDupes: { value: string; label: string }[] =
    classifications.map((iterator) => {
      return {
        value: iterator.id,
        label:
          iterator.group ||
          intl.formatMessage({
            defaultMessage: "Error: classification group not found.",
            description:
              "Error message if classification group is not defined.",
          }),
      };
    });

  const classificationLevels = [
    { value: "01", label: "01" },
    { value: "02", label: "02" },
    { value: "03", label: "03" },
    { value: "04", label: "04" },
    { value: "05", label: "05" },
  ];

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
      <div>
        <RadioGroup
          idPrefix="gov-employee-yesno"
          legend={intl.formatMessage({
            defaultMessage: "GoC Employee Status",
            description: "Employee Status in Government Info Form",
          })}
          name="gov-employee-yesno"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          defaultSelected="no"
          items={[
            {
              value: "no",
              label: intl.formatMessage({
                defaultMessage: "No, I am not a Government of Canada employee",
                description:
                  "Label displayed for not a government employee option",
              }),
            },
            {
              value: "yes",
              label: intl.formatMessage({
                defaultMessage: "Yes, I am not a Government of Canada employee",
                description:
                  "Label displayed for is a government employee option",
              }),
            },
          ]}
        />
      </div>
      <div>
        {" "}
        {govEmployee === "yes" && (
          <RadioGroup
            idPrefix="gov-employee-status"
            legend={intl.formatMessage({
              defaultMessage: "GoC Employee Status",
              description: "Employee Status in Government Info Form",
            })}
            name="gov-employee-status"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
            defaultSelected="student"
            items={[
              {
                value: "student",
                label: intl.formatMessage({
                  defaultMessage: "I am a student",
                  description: "Label displayed for student option",
                }),
              },
              {
                value: "casual",
                label: intl.formatMessage({
                  defaultMessage: "I have a  casual contract",
                  description: "Label displayed for casual option",
                }),
              },
              {
                value: "term",
                label: intl.formatMessage({
                  defaultMessage: "I have a term position",
                  description: "Label displayed for term option",
                }),
              },
              {
                value: "indeterminate",
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
        (govEmployeeStatus === "term" ||
          govEmployeeStatus === "indeterminate") && (
          <p>
            Please indicate if you are interested in lateral deployment or
            secondment. Learn more about this.
          </p>
        )}
      <div>
        {govEmployee === "yes" &&
          (govEmployeeStatus === "term" ||
            govEmployeeStatus === "indeterminate") && (
            <Checkbox
              id="lateral-second"
              label={intl.formatMessage({
                defaultMessage:
                  "I am interested in lateral deployment or secondment.",
                description: "Label displayed on lateral/secondment checkbox",
              })}
              name="lateral-second"
            />
          )}
      </div>
      {govEmployee === "yes" &&
        (govEmployeeStatus === "term" ||
          govEmployeeStatus === "indeterminate" ||
          govEmployeeStatus === "casual") && (
          <p>
            Please indicate your current substantive group classification and
            level.
          </p>
        )}
      <div>
        <div>
          {govEmployee === "yes" &&
            (govEmployeeStatus === "term" ||
              govEmployeeStatus === "indeterminate" ||
              govEmployeeStatus === "casual") && (
              <Select
                id="class-group"
                label="Group"
                name="class-group"
                options={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                ]}
              />
            )}
        </div>
        <div>
          {govEmployee === "yes" &&
            (govEmployeeStatus === "term" ||
              govEmployeeStatus === "indeterminate" ||
              govEmployeeStatus === "casual") && (
              <Select
                id="class-level"
                label="Level"
                name="class-level"
                options={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                ]}
              />
            )}
        </div>
      </div>

      <ProfileFormFooter mode="saveButton" />
    </ProfileFormWrapper>
  );
};

export default GovernmentInfoForm;
