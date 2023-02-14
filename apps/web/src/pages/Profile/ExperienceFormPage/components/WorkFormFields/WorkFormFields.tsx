import React from "react";
import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";

import { Input, Checkbox } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import { SubExperienceFormProps } from "../../types";

export const WorkExperienceForm = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const todayDate = Date();

  // to toggle whether End Date is required, the state of the Current Role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch({ name: "currentRole" });
  // ensuring end date isn't before the start date, using this as a minimum value
  const startDate = useWatch({ name: "startDate" });

  return (
    <div>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "1. Work Experience Details",
          id: "ciWrxr",
          description: "Title for Work Experience form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Share your experiences gained from full-time positions, part-time positions, self-employment, fellowships, and internships. You don't necessarily need to share everything. Instead, focus on experiences related to the opportunity that you are interested in.",
          id: "qjMTk9",
          description: "Description blurb for Work Experience form",
        })}
      </p>
      <div data-h2-margin="base(x.5, 0, 0, 0)" data-h2-max-width="base(50rem)">
        <div data-h2-flex-grid="base(flex-start, x2, 0)">
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Input
              id="role"
              label={labels.role}
              name="role"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <div data-h2-margin="base(x1, 0, x.875, 0)">
              <Checkbox
                boundingBox
                boundingBoxLabel={labels.currentRole}
                id="currentRole"
                label={intl.formatMessage({
                  defaultMessage: "I am currently active in this role",
                  id: "8i+lzm",
                  description:
                    "Label displayed on Work Experience form for current role input",
                })}
                name="currentRole"
              />
            </div>
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Input
              id="organization"
              label={labels.organization}
              name="organization"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <div data-h2-flex-grid="base(flex-start, x2, 0)">
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <Input
                  id="startDate"
                  label={labels.startDate}
                  name="startDate"
                  type="date"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                    max: {
                      value: todayDate,
                      message: intl.formatMessage(
                        errorMessages.mustNotBeFuture,
                      ),
                    },
                  }}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                {/* conditionally render the end-date based off the state attached to the checkbox input */}
                {!isCurrent && (
                  <Input
                    id="endDate"
                    label={labels.endDate}
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
                              value: startDate,
                              message: intl.formatMessage(
                                errorMessages.futureDate,
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
            <Input id="team" label={labels.team} name="team" type="text" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceForm;
