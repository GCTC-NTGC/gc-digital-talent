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
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "1. Education Details",
          id: "W7LpsW",
          description: "Title for Education Details Form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Got credentials? Share your degree, certificates, online courses, trade apprenticeship, licences or alternative credentials. If you've learned something from a recognized educational provider, include your experiences here.",
          id: "7inIW/",
          description: "Description blurb for Education Details Form",
        })}
      </p>
      <div data-h2-margin="base(x.5, 0, 0, 0)" data-h2-max-width="base(50rem)">
        <div data-h2-flex-grid="base(flex-start, x2, 0)">
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Select
              id="educationType"
              label={intl.formatMessage({
                defaultMessage: "Type of Education",
                id: "elFbzT",
                description:
                  "Label displayed on Education form for education type input",
              })}
              name="educationType"
              nullSelection={intl.formatMessage({
                defaultMessage: "Choose one...",
                id: "3YyYDt",
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
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <div data-h2-margin="base(x1, 0, x.875, 0)">
              <Checkbox
                id="currentRole"
                boundingBox
                boundingBoxLabel={intl.formatMessage({
                  defaultMessage: "Current Education",
                  id: "aDRIDD",
                  description:
                    "Label displayed on Education Experience form for current education bounded box",
                })}
                label={intl.formatMessage({
                  defaultMessage: "I am currently active in this education",
                  id: "491LrZ",
                  description:
                    "Label displayed on Education Experience form for current education input",
                })}
                name="currentRole"
              />
            </div>
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Input
              id="areaOfStudy"
              label={intl.formatMessage({
                defaultMessage: "Area of study",
                id: "nzw1ry",
                description:
                  "Label displayed on education form for area of study input",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Write area of study here...",
                id: "Uv9q53",
                description: "Placeholder for area of study input",
              })}
              name="areaOfStudy"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <div data-h2-flex-grid="base(flex-start, x2, 0)">
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <Input
                  id="startDate"
                  label={intl.formatMessage({
                    defaultMessage: "Start Date",
                    id: "/sQHOb",
                    description:
                      "Label displayed on Education Experience form for start date input",
                  })}
                  name="startDate"
                  type="date"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                {!isCurrent && (
                  <Input
                    id="endDate"
                    label={intl.formatMessage({
                      defaultMessage: "End Date",
                      id: "Nqwbu3",
                      description:
                        "Label displayed on Education Experience form for end date input",
                    })}
                    name="endDate"
                    type="date"
                    rules={
                      isCurrent
                        ? {}
                        : {
                            required: intl.formatMessage(
                              errorMessages.required,
                            ),
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
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Input
              id="institution"
              label={intl.formatMessage({
                defaultMessage: "Institution",
                id: "o0Yt8Q",
                description:
                  "Label displayed on education form for institution input",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Write name here...",
                id: "EHOcOR",
                description: "Placeholder for institution input",
              })}
              name="institution"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Select
              id="educationStatus"
              label={intl.formatMessage({
                defaultMessage: "Status",
                id: "OQhL7A",
                description:
                  "Label displayed on Education form for status input",
              })}
              name="educationStatus"
              nullSelection={intl.formatMessage({
                defaultMessage: "Choose one...",
                id: "wwiDm1",
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
          </div>
          <div data-h2-flex-item="base(1of1)">
            <Input
              id="thesisTitle"
              label={intl.formatMessage({
                defaultMessage: "Thesis Title",
                id: "N87bC7",
                description:
                  "Label displayed on education form for thesis title input",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Write title here...",
                id: "8THvSC",
                description: "Placeholder for thesis title input",
              })}
              name="thesisTitle"
              type="text"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationExperienceForm;
