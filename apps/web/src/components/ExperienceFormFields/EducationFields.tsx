import React from "react";
import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";

import {
  Checkbox,
  DATE_SEGMENT,
  DateInput,
  Input,
  Select,
  enumToOptions,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  getEducationStatus,
  getEducationType,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";

import { SubExperienceFormProps } from "~/types/experience";
import { EducationStatus, EducationType } from "~/api/generated";

const EducationFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const todayDate = new Date();
  // to toggle whether End Date is required, the state of the Current Role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch({ name: "currentRole" });
  // ensuring end date isn't before the start date, using this as a minimum value
  const watchStartDate = useWatch({ name: "startDate" });

  return (
    <div data-h2-margin="base(x.5, 0, 0, 0)" data-h2-max-width="base(50rem)">
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Select
            id="educationType"
            label={labels.educationType}
            name="educationType"
            nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
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
          <Checkbox
            id="currentRole"
            boundingBox
            boundingBoxLabel={labels.currentRole}
            label={intl.formatMessage({
              defaultMessage: "I am currently active in this education",
              id: "491LrZ",
              description:
                "Label displayed on Education Experience form for current education input",
            })}
            name="currentRole"
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Input
            id="areaOfStudy"
            label={labels.areaOfStudy}
            name="areaOfStudy"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Input
            id="institution"
            label={labels.institution}
            name="institution"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Select
            id="educationStatus"
            label={labels.educationStatus}
            name="educationStatus"
            nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
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
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <Input
            id="thesisTitle"
            label={labels.thesisTitle}
            name="thesisTitle"
            type="text"
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          <DateInput
            id="startDate"
            legend={labels.startDate}
            name="startDate"
            show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
            rules={{
              required: intl.formatMessage(errorMessages.required),
              max: {
                value: strToFormDate(todayDate.toISOString()),
                message: intl.formatMessage(errorMessages.mustNotBeFuture),
              },
            }}
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
          {!isCurrent && (
            <DateInput
              id="endDate"
              legend={labels.endDate}
              name="endDate"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
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
  );
};

export default EducationFields;
