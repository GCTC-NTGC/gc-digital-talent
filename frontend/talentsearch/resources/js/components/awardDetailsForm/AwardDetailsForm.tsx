import React from "react";
import { useIntl } from "react-intl";
import { Input } from "@common/components/form/Input";
import { Select } from "@common/components/form/Select";
import { errorMessages } from "@common/messages";

export const AwardDetailsForm: React.FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div>
      <h2 data-h2-font-size="b(h3)">1. Award Details</h2>
      <p>
        Did you get recognized for going above and beyond? There are many ways
        to get recognized, awards are just one of them.
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
              defaultMessage: "Select a something...",
              description:
                "Null selection for something select input in the awarded to form.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={[
              { value: 1, label: "hi-1" },
              { value: 2, label: "hi-2" },
              { value: 3, label: "hi-3" },
            ]}
          />

          <Input
            id="issuing"
            label={intl.formatMessage({
              defaultMessage: "Issuing Organization or Institution",
              description:
                "Label displayed on award form for issuing organization input",
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
              defaultMessage: "Select a something...",
              description:
                "Null selection for something select input in the award scope form.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={[
              { value: 1, label: "hi-1" },
              { value: 2, label: "hi-2" },
              { value: 3, label: "hi-3" },
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
