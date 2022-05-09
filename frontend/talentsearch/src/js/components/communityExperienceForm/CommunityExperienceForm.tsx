import React from "react";
import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";
import Input from "@common/components/form/Input";
import Checkbox from "@common/components/form/Checkbox";
import { errorMessages } from "@common/messages";

export const CommunityExperienceForm: React.FunctionComponent = () => {
  const intl = useIntl();

  // to toggle whether endDate is required, the state of the current-role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch({ name: "current-role", defaultValue: false });
  // ensuring endDate isn't before startDate, using this as a minimum value
  const startDate = useWatch({ name: "startDate" });

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
      <div
        data-h2-display="b(flex)"
        data-h2-padding="b(top, m)"
        data-h2-flex-direction="b(column) s(row)"
      >
        <div data-h2-padding="b(right, none) s(right, l)">
          <Input
            id="role"
            label={intl.formatMessage({
              defaultMessage: "My Role / Job Title",
              description:
                "Label displayed on Community Experience form for role input",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Write title here...",
              description:
                "Placeholder displayed on the Community Experience form for role input",
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
            placeholder={intl.formatMessage({
              defaultMessage: "Write group name here...",
              description:
                "Placeholder displayed on the Community Experience form for organization input",
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
            placeholder={intl.formatMessage({
              defaultMessage: "Write project name here...",
              description:
                "Placeholder displayed on the Community Experience form for project input",
            })}
            name="project"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div>
          <Checkbox
            boundingBox
            boundingBoxLabel={intl.formatMessage({
              defaultMessage: "Current Role",
              description:
                "Label displayed on Community Experience form for current role bounded box",
            })}
            id="current-role"
            label={intl.formatMessage({
              defaultMessage: "I am currently active in this role",
              description:
                "Label displayed on Community Experience form for current role input",
            })}
            name="current-role"
          />
          <div
            data-h2-display="b(flex)"
            data-h2-flex-direction="b(column) s(row)"
          >
            <div data-h2-padding="b(right, none) s(right, s)">
              <Input
                id="startDate"
                label={intl.formatMessage({
                  defaultMessage: "Start Date",
                  description:
                    "Label displayed on Community Experience form for start date input",
                })}
                name="startDate"
                type="date"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            </div>
            <div>
              {/* conditionally render the endDate based off the state attached to the checkbox input */}
              {!isCurrent && (
                <Input
                  id="endDate"
                  label={intl.formatMessage({
                    defaultMessage: "End Date",
                    description:
                      "Label displayed on Community Experience form for end date input",
                  })}
                  name="endDate"
                  type="date"
                  rules={
                    isCurrent
                      ? {}
                      : {
                          required: intl.formatMessage(errorMessages.required),
                          min: {
                            value: startDate,
                            message: intl.formatMessage(
                              errorMessages.mustBeGreater,
                              {
                                value: startDate,
                              },
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
