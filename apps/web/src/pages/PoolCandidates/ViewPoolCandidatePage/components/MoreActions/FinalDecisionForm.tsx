import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { DateInput, RadioGroup } from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { Heading } from "@gc-digital-talent/ui";

import FormChangeNotifyWell from "~/components/FormChangeNotifyWell/FormChangeNotifyWell";

export interface FormValues {
  finalAssessmentDecision?: string;
  disqualifiedDecision?: string;
  expiryDate?: string;
}

const FinalDecisionForm = () => {
  const intl = useIntl();
  const methods = useFormContext<FormValues>();
  const { watch } = methods;
  const [finalAssessmentDecisionValue] = watch(["finalAssessmentDecision"]);

  const todayDate = new Date();

  return (
    <>
      <Heading level="h3" size="h6" className="mb-3">
        {intl.formatMessage({
          defaultMessage: "Final decision",
          id: "VYOVUJ",
          description: "Final decision heading",
        })}
      </Heading>
      <RadioGroup
        idPrefix="finalAssessmentDecision"
        name="finalAssessmentDecision"
        legend={intl.formatMessage(commonMessages.finalAssessmentDecision)}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={[
          {
            value: "qualified",
            label: intl.formatMessage({
              defaultMessage: "Qualify candidate",
              description: "Qualify candidate option",
              id: "EvR6qK",
            }),
          },
          {
            value: "disqualified",
            label: intl.formatMessage({
              defaultMessage: "Disqualify candidate",
              description: "Disqualify candidate option",
              id: "oIM22z",
            }),
          },
        ]}
      />
      {finalAssessmentDecisionValue === "disqualified" && (
        <RadioGroup
          idPrefix="disqualifiedDecision"
          name="disqualifiedDecision"
          legend={intl.formatMessage({
            defaultMessage: "Disqualified decision",
            description: "Disqualified decision input",
            id: "Ed+xy1",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={[
            {
              value: "application",
              label: intl.formatMessage({
                defaultMessage: "Screened out on application",
                description: "Screened out on application option",
                id: "YueN6y",
              }),
            },
            {
              value: "assessment",
              label: intl.formatMessage({
                defaultMessage: "Unsuccessful during assessment",
                description: "Unsuccessful during assessment option",
                id: "wrqRvV",
              }),
            },
          ]}
          className="mt-6"
        />
      )}
      {finalAssessmentDecisionValue === "qualified" && (
        <DateInput
          id="expiryDate"
          name="expiryDate"
          legend={intl.formatMessage({
            defaultMessage: "Select an expiry date",
            id: "3MboNR",
            description: "Label for date selection input for expiry date",
          })}
          context={
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "This is the amount of time this candidate will be considered for placement based on the results of this process. The usual amount of time is two years.",
                id: "DXjJyD",
                description:
                  "Text describing expiry dates for candidates, what it is for and a recommendation",
              })}
            </p>
          }
          rules={{
            required: intl.formatMessage(errorMessages.required),
            min: {
              value: strToFormDate(todayDate.toISOString()),
              message: intl.formatMessage(errorMessages.futureDate),
            },
          }}
          className="mt-6"
        />
      )}
      <FormChangeNotifyWell className="mt-6" />
    </>
  );
};

export default FinalDecisionForm;
