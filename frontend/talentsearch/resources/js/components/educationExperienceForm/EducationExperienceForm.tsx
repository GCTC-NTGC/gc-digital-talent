import React from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import { Input } from "@common/components/form/Input";
import { Select } from "@common/components/form/Select";
import { Checkbox } from "@common/components/form/Checkbox";
import { errorMessages } from "@common/messages";
import { enumToOptions } from "@common/helpers/formUtils";
import {
  getEducationStatus,
  getEducationType,
} from "@common/constants/localizedConstants";
import { EducationType, EducationStatus } from "../../api/generated";

export const EducationExperienceForm: React.FunctionComponent = () => {
  const intl = useIntl();
  const isCurrent = useWatch({ name: "current-role", defaultValue: false });

  // validation to test that end date is after start date, to be place into {rules} for end date input?
  // validate: {endDateCheck: end => dateValidation(end)}

  // just using this to visualize form value structure
  // const logging = (e: any) => {
  //   const formValue = document.getElementById("start-date");
  //   console.log(formValue.value);
  // };

  // function to try
  // const dateValidation = (end: string) => {
  //   const startValue = document.getElementById("start-date");
  //   return end > startValue.value;
  // };

  return (
    <div>
      <h2 data-h2-font-size="b(h3)">
        {intl.formatMessage({
          defaultMessage: "1. Education Details",
          description: "Title for Education Details Form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Got credentials? Share your degree, certificates, online courses, trade apprenticeship, licences or alternative credentials. If you've learned something from a recognized educational provider, include your experiences here.",
          description: "Description blurb for Education Details Form",
        })}
      </p>
      <div
        data-h2-display="b(flex)"
        data-h2-padding="b(top, m)"
        data-h2-flex-direction="s(row) b(column)"
      >
        <div data-h2-padding="b(right, l)">
          <Select
            id="education-type"
            label={intl.formatMessage({
              defaultMessage: "Type of Education",
              description:
                "Label displayed on Education form for education type input",
            })}
            name="education-type"
            nullSelection={intl.formatMessage({
              defaultMessage: "Choose one...",
              description:
                "Null selection for select education type in the education form.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={enumToOptions(EducationType).map(({ value }) => ({
              value,
              label: intl.formatMessage(getEducationType(value)),
            }))}
          />

          <Input
            id="area-study"
            label={intl.formatMessage({
              defaultMessage: "Area of study",
              description:
                "Label displayed on education form for area of study input",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Write area of study here...",
              description: "Placeholder for area of study input",
            })}
            name="area-study"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />

          <Input
            id="institution"
            label={intl.formatMessage({
              defaultMessage: "Institution",
              description:
                "Label displayed on education form for institution input",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Write name here...",
              description: "Placeholder for institution input",
            })}
            name="institution"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />

          <Select
            id="education-status"
            label={intl.formatMessage({
              defaultMessage: "Status",
              description: "Label displayed on Education form for status input",
            })}
            name="education-status"
            nullSelection={intl.formatMessage({
              defaultMessage: "Choose one...",
              description:
                "Null selection for select status in the education form.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={enumToOptions(EducationStatus).map(({ value }) => ({
              value,
              label: intl.formatMessage(getEducationStatus(value)),
            }))}
          />

          <Input
            id="thesis"
            label={intl.formatMessage({
              defaultMessage: "Thesis Title",
              description:
                "Label displayed on education form for thesis title input",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Write title here...",
              description: "Placeholder for thesis title input",
            })}
            name="thesis"
            type="text"
          />
        </div>
        <div>
          <Checkbox
            id="current-role"
            label={intl.formatMessage({
              defaultMessage: "I am currently active in this role",
              description:
                "Label displayed on Education Experience form for current role input",
            })}
            name="current-role"
          />
          <div
            data-h2-display="b(flex)"
            data-h2-flex-direction="s(row) b(column)"
          >
            <div data-h2-padding="b(right, l)">
              <Input
                id="start-date"
                label={intl.formatMessage({
                  defaultMessage: "Start Date",
                  description:
                    "Label displayed on Education Experience form for start date input",
                })}
                name="start-date"
                type="date"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            </div>
            <div /* onChange={logging} */>
              {!isCurrent && (
                <Input
                  id="end-date"
                  label={intl.formatMessage({
                    defaultMessage: "End Date",
                    description:
                      "Label displayed on Education Experience form for end date input",
                  })}
                  name="end-date"
                  type="date"
                  rules={
                    isCurrent
                      ? {}
                      : { required: intl.formatMessage(errorMessages.required) }
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationExperienceForm;
