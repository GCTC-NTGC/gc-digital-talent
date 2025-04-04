import { useIntl } from "react-intl";
import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";
import { useFormContext } from "react-hook-form";
import { ReactNode } from "react";

import { Heading, Well } from "@gc-digital-talent/ui";
import { Checkbox, Submit } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import pageTitles from "~/messages/pageTitles";

import { FormValues, parseMaybeStringToBoolean } from "../form";

export interface SubformValues {
  consent: boolean | null;
}

interface ReviewAndSubmitProps {
  formDisabled: boolean;
  actions?: ReactNode;
}

const ReviewAndSubmit = ({ formDisabled, actions }: ReviewAndSubmitProps) => {
  const intl = useIntl();

  const { watch } = useFormContext<FormValues>();
  const [selectedJobInterest, selectedTrainingInterest] = watch([
    "jobInterest",
    "trainingInterest",
  ]);

  // only require consent if user has expressed interest in job or training
  const formRequiresConsent =
    parseMaybeStringToBoolean(selectedJobInterest) ||
    parseMaybeStringToBoolean(selectedTrainingInterest);

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1.25)"
    >
      {/* heading and description */}
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <Heading
          level="h2"
          data-h2-font-weight="base(400)"
          Icon={DocumentMagnifyingGlassIcon}
          color="primary"
          data-h2-margin="base(0)"
        >
          {intl.formatMessage(pageTitles.reviewAndSubmit)}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Please review the information you've provided. Once a community is added to your profile, you can update this information at any time.",
            id: "2Kz16k",
            description: "Description of the 'Review and submit' section",
          })}
        </p>
      </div>
      {/* consent form */}
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <Heading
          level="h3"
          data-h2-font-weight="base(400)"
          size="h4"
          color="primary"
          data-h2-margin="base(0)"
        >
          {intl.formatMessage({
            defaultMessage: "Consent to share your information",
            id: "HMlreE",
            description: "Heading for the 'Review and submit' consent section",
          })}
        </Heading>
        {/* consent statement */}
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x0.5)"
        >
          <p>
            {intl.formatMessage({
              defaultMessage:
                "When you express interest in job or training opportunities through a functional community, you’re agreeing to share your profile information with recruiters and potential hiring managers. This includes information shared in your profile, your career experience, and your skills portfolio.",
              id: "mv2nt/",
              description:
                "statement for the 'Review and submit' consent section, paragraph 1",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You can rescind this consent at any time by editing the functional communities you've added to your profile and using the “Remove community” button.",
              id: "J7GhW4",
              description:
                "statement for the 'Review and submit' consent section, paragraph 2",
            })}
          </p>
        </div>
        {formRequiresConsent ? (
          <Checkbox
            id="consent"
            name="consent"
            boundingBoxLabel={intl.formatMessage({
              defaultMessage: "Consent to share",
              id: "AlOrGy",
              description: "Label for the input for the consent check",
            })}
            label={intl.formatMessage({
              defaultMessage:
                "I agree that by indicating my interest in work or training opportunities that my profile will be shared with HR staff and hiring managers in this functional community.",
              id: "CCSgzj",
              description: "Statement for the input for the consent check",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            disabled={formDisabled}
            boundingBox
          />
        ) : (
          <Well>
            {intl.formatMessage({
              defaultMessage:
                "You've indicated that you aren't interested in job opportunities or training in this community, so your profile information will <strong>not be shared</strong> as part of these features.",
              id: "/HKgWb",
              description: "Message displayed when consent is not required",
            })}
          </Well>
        )}
      </div>
      {/* submit button */}
      <div
        data-h2-display="base(flex)"
        data-h2-justify-content="base(flex-end)"
        data-h2-gap="base(x1)"
      >
        {actions}
        <Submit
          disabled={formDisabled}
          text={intl.formatMessage({
            defaultMessage: "Save and submit",
            id: "JGC9Pp",
            description: "Text for the submit button",
          })}
        />
      </div>
    </div>
  );
};

export default ReviewAndSubmit;
