import React from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import { Input } from "@common/components/form/Input";
import { Checkbox } from "@common/components/form/Checkbox";
import { TextArea } from "@common/components/form/TextArea";
import { errorMessages } from "@common/messages";
import { Fieldset } from "@common/components/inputPartials/Fieldset";

export const PersonalExperienceForm: React.FunctionComponent = () => {
  const intl = useIntl();
  // to toggle whether End Date is required, the state of the Current Role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch({ name: "current-role", defaultValue: false });
  // ensuring end date isn't before the start date, using this as a minimum value
  const watchStartDate = useWatch({ name: "startDate" });

  return (
    <div>
      <h2 data-h2-font-size="b(h3)">
        {intl.formatMessage({
          defaultMessage: "1. Personal Experience Details",
          description: "Title for Personal Experience Details form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "People are more than just education and work experiences. We want to make space for you to share your learning from other experiences. To protect your privacy, please don't share sensitive information about yourself or others. A good measure would be if you are comfortable with all your colleagues knowing it.",
          description: "Description blurb for Personal Experience Details form",
        })}
      </p>

      <div>
        <Input
          id="experienceTitle"
          label={intl.formatMessage({
            defaultMessage: "Short title for this experience",
            description:
              "Label displayed on Personal Experience form for experience title input",
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "Write title here...",
            description: "Placeholder for experience title input",
          })}
          name="experienceTitle"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />

        <TextArea
          id="experienceDescription"
          label={intl.formatMessage({
            defaultMessage: "Experience Description",
            description:
              "Label displayed on Personal Experience form for experience description input",
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "Describe experience details here...",
            description: "Placeholder for experience description input",
          })}
          name="experienceDescription"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />

        <Fieldset
          legend={intl.formatMessage({
            defaultMessage: "Disclaimer",
            description: "Title displayed above disclaimer checkbox",
          })}
          required
        >
          <Checkbox
            id="disclaimer"
            label={intl.formatMessage({
              defaultMessage:
                "I agree to share this information with verified Government of Canada hiring managers and HR advisors who have access to this platform.",
              description:
                "Label displayed on Personal Experience form for disclaimer checkbox",
            })}
            name="disclaimer"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </Fieldset>

        <Fieldset
          legend={intl.formatMessage({
            defaultMessage: "Current Experience",
            description: "Title displayed above current experience checkbox",
          })}
        >
          <Checkbox
            id="current-role"
            label={intl.formatMessage({
              defaultMessage: "I am currently active in this experience",
              description:
                "Label displayed on Personal Experience form for current experience input",
            })}
            name="current-role"
          />
        </Fieldset>

        <div
          data-h2-display="b(flex)"
          data-h2-flex-direction="b(column) s(row)"
        >
          <div data-h2-padding="b(right, none) s(right, l)">
            <Input
              id="startDate"
              label={intl.formatMessage({
                defaultMessage: "Start Date",
                description:
                  "Label displayed on Personal Experience form for start date input",
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
                    "Label displayed on Personal Experience form for end date input",
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
  );
};

export default PersonalExperienceForm;
