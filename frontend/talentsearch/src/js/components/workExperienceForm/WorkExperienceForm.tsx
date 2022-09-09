import React from "react";
import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";
import Input from "@common/components/form/Input";
import Checkbox from "@common/components/form/Checkbox";
import { errorMessages } from "@common/messages";

export const WorkExperienceForm: React.FunctionComponent = () => {
  const intl = useIntl();

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
            "Share your experiences gained from full-time, part-time, self-employment, fellowships or internships.",
          id: "i17oNt",
          description: "Description blurb for Work Experience form",
        })}
      </p>
      <div data-h2-margin="base(x.5, 0, 0, 0)" data-h2-max-width="base(50rem)">
        <div data-h2-flex-grid="base(flex-start, 0, x2, 0)">
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Input
              id="role"
              label={intl.formatMessage({
                defaultMessage: "My Role",
                id: "URHhMF",
                description:
                  "Label displayed on Work Experience form for role input",
              })}
              name="role"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <div data-h2-margin="base(x1, 0, x.875, 0)">
              <Checkbox
                boundingBox
                boundingBoxLabel={intl.formatMessage({
                  defaultMessage: "Current Role",
                  id: "2t3Cqv",
                  description:
                    "Label displayed on Work Experience form for current role bounded box",
                })}
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
              label={intl.formatMessage({
                defaultMessage: "Organization",
                id: "9UZ/eS",
                description:
                  "Label displayed on Work Experience form for organization input",
              })}
              name="organization"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <div data-h2-flex-grid="base(flex-start, 0, x2, 0)">
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <Input
                  id="startDate"
                  label={intl.formatMessage({
                    defaultMessage: "Start Date",
                    id: "8VDBW/",
                    description:
                      "Label displayed on Work Experience form for start date input",
                  })}
                  name="startDate"
                  type="date"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                {/* conditionally render the end-date based off the state attached to the checkbox input */}
                {!isCurrent && (
                  <Input
                    id="endDate"
                    label={intl.formatMessage({
                      defaultMessage: "End Date",
                      id: "09G0vg",
                      description:
                        "Label displayed on Work Experience form for end date input",
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
            <Input
              id="team"
              label={intl.formatMessage({
                defaultMessage: "Team, Group, or Division",
                id: "xJulQ4",
                description:
                  "Label displayed on Work Experience form for team/group/division input",
              })}
              name="team"
              type="text"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceForm;
