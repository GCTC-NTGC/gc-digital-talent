import React from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import Input from "@common/components/form/Input";
import Checkbox from "@common/components/form/Checkbox";
import TextArea from "@common/components/form/TextArea";
import { errorMessages } from "@common/messages";

export const PersonalExperienceForm: React.FunctionComponent = () => {
  const intl = useIntl();
  // to toggle whether End Date is required, the state of the Current Role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch({ name: "currentRole" });
  // ensuring end date isn't before the start date, using this as a minimum value
  const watchStartDate = useWatch({ name: "startDate" });

  return (
    <div>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "1. Personal Experience Details",
          id: "UDpZ1q",
          description: "Title for Personal Experience Details form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "People are more than just education and work experiences. We want to make space for you to share your learning from other experiences. To protect your privacy, please don't share sensitive information about yourself or others. A good measure would be if you are comfortable with all your colleagues knowing it.",
          id: "knmaAL",
          description: "Description blurb for Personal Experience Details form",
        })}
      </p>
      <div>
        <Input
          id="experienceTitle"
          label={intl.formatMessage({
            defaultMessage: "Short title for this experience",
            id: "97UAb8",
            description:
              "Label displayed on Personal Experience form for experience title input",
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "Write title here...",
            id: "Q18B0y",
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
            id: "q5rd9x",
            description:
              "Label displayed on Personal Experience form for experience description input",
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "Describe experience details here...",
            id: "Os+BwT",
            description: "Placeholder for experience description input",
          })}
          name="experienceDescription"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
        <div data-h2-margin="base(0, 0, x1, 0)">
          <Checkbox
            boundingBox
            boundingBoxLabel={intl.formatMessage({
              defaultMessage: "Disclaimer",
              id: "sapxcU",
              description:
                "Label displayed on Personal Experience form for disclaimer bounded box",
            })}
            id="disclaimer"
            label={intl.formatMessage({
              defaultMessage:
                "I agree to share this information with verified Government of Canada hiring managers and HR advisors who have access to this platform.",
              id: "oURESC",
              description:
                "Label displayed on Personal Experience form for disclaimer checkbox",
            })}
            name="disclaimer"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>

        <Checkbox
          boundingBox
          boundingBoxLabel={intl.formatMessage({
            defaultMessage: "Current Experience",
            id: "OAOnyY",
            description:
              "Label displayed on Personal Experience form for current experience bounded box",
          })}
          id="currentRole"
          label={intl.formatMessage({
            defaultMessage: "I am currently active in this experience",
            id: "aemElP",
            description:
              "Label displayed on Personal Experience form for current experience input",
          })}
          name="currentRole"
        />

        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column) p-tablet(row)"
        >
          <div data-h2-padding="base(0) p-tablet(0, x2, 0, 0)">
            <Input
              id="startDate"
              label={intl.formatMessage({
                defaultMessage: "Start Date",
                id: "NDunA+",
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
                  id: "qhmriI",
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
