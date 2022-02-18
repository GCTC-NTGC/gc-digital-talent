import React from "react";
import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";
import { Input } from "@common/components/form/Input";
import { Checkbox } from "@common/components/form/Checkbox";
import { errorMessages } from "@common/messages";

export const CommunityExperienceForm: React.FunctionComponent = () => {
  const intl = useIntl();

  // to toggle whether End Date is required, the state of the Current Role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch({ name: "current-role", defaultValue: false });
  // ensuring end date isn't before the start date, using this as a minimum value
  const startDate = useWatch({ name: "start-date" });

  return (
    <div>
      <h2 data-h2-font-size="b(h3)">
        {intl.formatMessage({
          defaultMessage: "1. Community Experience Details",
          description: "Title for Community Experience form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Gained experience by being part of or giving back to a community? People learn skills from a wide range of experiences like volunteering or being part of non-profit organizations, indigenous communities, or virtual collaborations.",
          description: "Description blurb for Community Experience form",
        })}
      </p>
      <div data-h2-display="b(flex)" data-h2-padding="b(top, m)">
        <div data-h2-padding="b(right, l)">
          <Input
            id="role"
            label={intl.formatMessage({
              defaultMessage: "My Role / Job Title",
              description:
                "Label displayed on Community Experience form for role input",
            })}
            name="role"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />

          <Input
            id="organization"
            label={intl.formatMessage({
              defaultMessage: "Group / Organization / Community",
              description:
                "Label displayed on Community Experience form for organization input",
            })}
            name="organization"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />

          <Input
            id="project"
            label={intl.formatMessage({
              defaultMessage: "Project / Product",
              description:
                "Label displayed on Community Experience form for project input",
            })}
            name="project"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div>
          <Checkbox
            id="current-role"
            label={intl.formatMessage({
              defaultMessage: "I am currently active in this role",
              description:
                "Label displayed on Community Experience form for current role input",
            })}
            name="current-role"
          />
          <div data-h2-display="b(flex)">
            <div data-h2-padding="b(right, l)">
              <Input
                id="start-date"
                label={intl.formatMessage({
                  defaultMessage: "Start Date",
                  description:
                    "Label displayed on Community Experience form for start date input",
                })}
                name="start-date"
                type="date"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            </div>
            <div>
              {/* conditionally render the end-date based off the state attached to the checkbox input */}
              {!isCurrent && (
                <Input
                  id="end-date"
                  label={intl.formatMessage({
                    defaultMessage: "End Date",
                    description:
                      "Label displayed on Community Experience form for end date input",
                  })}
                  name="end-date"
                  type="date"
                  rules={
                    isCurrent
                      ? {}
                      : {
                          required: intl.formatMessage(errorMessages.required),
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
      </div>
    </div>
  );
};

export default CommunityExperienceForm;
