import React from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import Input from "@common/components/form/Input";
import Select from "@common/components/form/Select";
import Checkbox from "@common/components/form/Checkbox";
import { errorMessages } from "@common/messages";
import { enumToOptions } from "@common/helpers/formUtils";
import {
  getEducationStatus,
  getEducationType,
} from "@common/constants/localizedConstants";
import { EducationType, EducationStatus } from "../../api/generated";

export const EducationExperienceForm: React.FunctionComponent = () => {
  const intl = useIntl();
  // to toggle whether End Date is required, the state of the Current Role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch({ name: "currentRole" });
  // ensuring end date isn't before the start date, using this as a minimum value
  const watchStartDate = useWatch({ name: "startDate" });

  return (
    <div>
      <h2 data-h2-font-size="base(h3, 1.3)">
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
        data-h2-display="base(flex)"
        data-h2-padding="base(x1, 0, 0, 0)"
        data-h2-flex-direction="p-tablet(row) base(column)"
      >
        <div data-h2-padding="l-tablet(0, x2, 0, 0)">
          <Select
            id="educationType"
            label={intl.formatMessage({
              defaultMessage: "Type of Education",
              description:
                "Label displayed on Education form for education type input",
            })}
            name="educationType"
            nullSelection={intl.formatMessage({
              defaultMessage: "Choose one...",
              description:
                "Null selection for select education type in the education form.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={enumToOptions(EducationType, [
              EducationType.Diploma,
              EducationType.BachelorsDegree,
              EducationType.MastersDegree,
              EducationType.Phd,
              EducationType.PostDoctoralFellowship,
              EducationType.OnlineCourse,
              EducationType.Certification,
              EducationType.Other,
            ]).map(({ value }) => ({
              value,
              label: intl.formatMessage(getEducationType(value)),
            }))}
          />

          <Input
            id="areaOfStudy"
            label={intl.formatMessage({
              defaultMessage: "Area of study",
              description:
                "Label displayed on education form for area of study input",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Write area of study here...",
              description: "Placeholder for area of study input",
            })}
            name="areaOfStudy"
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
            id="educationStatus"
            label={intl.formatMessage({
              defaultMessage: "Status",
              description: "Label displayed on Education form for status input",
            })}
            name="educationStatus"
            nullSelection={intl.formatMessage({
              defaultMessage: "Choose one...",
              description:
                "Null selection for select status in the education form.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={enumToOptions(EducationStatus, [
              EducationStatus.SuccessCredential,
              EducationStatus.SuccessNoCredential,
              EducationStatus.InProgress,
              EducationStatus.Audited,
              EducationStatus.DidNotComplete,
            ]).map(({ value }) => ({
              value,
              label: intl.formatMessage(getEducationStatus(value)),
            }))}
          />

          <Input
            id="thesisTitle"
            label={intl.formatMessage({
              defaultMessage: "Thesis Title",
              description:
                "Label displayed on education form for thesis title input",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Write title here...",
              description: "Placeholder for thesis title input",
            })}
            name="thesisTitle"
            type="text"
          />
        </div>
        <div>
          <Checkbox
            id="currentRole"
            boundingBox
            boundingBoxLabel={intl.formatMessage({
              defaultMessage: "Current Education",
              description:
                "Label displayed on Education Experience form for current education bounded box",
            })}
            label={intl.formatMessage({
              defaultMessage: "I am currently active in this education",
              description:
                "Label displayed on Education Experience form for current education input",
            })}
            name="currentRole"
          />
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="p-tablet(row) base(column)"
          >
            <div data-h2-padding="l-tablet(0, x2, 0, 0)">
              <Input
                id="startDate"
                label={intl.formatMessage({
                  defaultMessage: "Start Date",
                  description:
                    "Label displayed on Education Experience form for start date input",
                })}
                name="startDate"
                type="date"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            </div>
            <div>
              {!isCurrent && (
                <Input
                  id="endDate"
                  label={intl.formatMessage({
                    defaultMessage: "End Date",
                    description:
                      "Label displayed on Education Experience form for end date input",
                  })}
                  name="endDate"
                  type="date"
                  rules={
                    isCurrent
                      ? {}
                      : {
                          required: intl.formatMessage(errorMessages.required),
                          min: {
                            value: watchStartDate,
                            message: intl.formatMessage(
                              errorMessages.dateMustFollow,
                              { value: watchStartDate },
                            ),
                          },
                        }
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
