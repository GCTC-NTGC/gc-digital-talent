import React from "react";
import { useIntl } from "react-intl";
import { Input } from "@common/components/form/Input";
import { Select } from "@common/components/form/Select";
import { errorMessages } from "@common/messages";

export const AwardDetailsForm: React.FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div>
      <h2 data-h2-font-size="b(h3)">
        {intl.formatMessage({
          defaultMessage: "1. Award Details",
          description: "Title for Award Details Form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Did you get recognized for going above and beyond? There are many ways to get recognized, awards are just one of them.",
          description: "Description blurb for Award Details Form",
        })}
      </p>

      <div data-h2-display="b(flex)" data-h2-padding="b(top, m)">
        <div data-h2-padding="b(right, l)">
          <Input
            id="award-title"
            label={intl.formatMessage({
              defaultMessage: "Award Title",
              description:
                "Label displayed on award form for award title input",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Write award title here",
              description: "Placeholder for award title input",
            })}
            name="award-title"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />

          <Select
            id="awarded-to"
            label={intl.formatMessage({
              defaultMessage: "Awarded to",
              description: "Label displayed on Award form for awarded to input",
            })}
            name="awarded-to"
            nullSelection={intl.formatMessage({
              defaultMessage: "Choose one",
              description:
                "Null selection for select input in the awarded to form.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={[
              {
                value: 1,
                label: intl.formatMessage({
                  defaultMessage: "Me",
                  description:
                    "Me selection for select input in the awarded to form.",
                }),
              },
              {
                value: 2,
                label: intl.formatMessage({
                  defaultMessage: "My Team",
                  description:
                    "My team selection for select input in the awarded to form.",
                }),
              },
              {
                value: 3,
                label: intl.formatMessage({
                  defaultMessage: "My Project",
                  description:
                    "My project selection for select input in the awarded to form.",
                }),
              },
              {
                value: 4,
                label: intl.formatMessage({
                  defaultMessage: "My Organization",
                  description:
                    "My organization selection for select input in the awarded to form.",
                }),
              },
            ]}
          />

          <Input
            id="issuing"
            label={intl.formatMessage({
              defaultMessage: "Issuing Organization or Institution",
              description:
                "Label displayed on award form for issuing organization input",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Write issuing name here",
              description: "Placeholder for issuing organization input",
            })}
            name="issuing"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />

          <Select
            id="awarded-scope"
            label={intl.formatMessage({
              defaultMessage: "Award Scope",
              description:
                "Label displayed on Award form for award scope input",
            })}
            name="awarded-scope"
            nullSelection={intl.formatMessage({
              defaultMessage: "Choose one",
              description:
                "Null selection for select input in the award scope form.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={[
              {
                value: 1,
                label: intl.formatMessage({
                  defaultMessage: "International",
                  description:
                    "International selection for select input in the awarded scope form.",
                }),
              },
              {
                value: 2,
                label: intl.formatMessage({
                  defaultMessage: "National",
                  description:
                    "National selection for select input in the awarded scope form.",
                }),
              },
              {
                value: 3,
                label: intl.formatMessage({
                  defaultMessage: "Provincial",
                  description:
                    "Provincial selection for select input in the awarded scope form.",
                }),
              },
              {
                value: 4,
                label: intl.formatMessage({
                  defaultMessage: "Local",
                  description:
                    "Local selection for select input in the awarded scope form.",
                }),
              },
              {
                value: 5,
                label: intl.formatMessage({
                  defaultMessage: "Community",
                  description:
                    "Community selection for select input in the awarded scope form.",
                }),
              },
              {
                value: 6,
                label: intl.formatMessage({
                  defaultMessage: "Organization",
                  description:
                    "Organization selection for select input in the awarded scope form.",
                }),
              },
              {
                value: 7,
                label: intl.formatMessage({
                  defaultMessage: "Sub-Organization (Branch)",
                  description:
                    "Branch selection for select input in the awarded scope form.",
                }),
              },
            ]}
          />
        </div>

        <div>
          <Input
            id="date-awarded"
            label={intl.formatMessage({
              defaultMessage: "Date Awarded",
              description:
                "Label displayed on award form for date awarded input",
            })}
            name="date-awarded"
            type="date"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
      </div>
    </div>
  );
};

export default AwardDetailsForm;
