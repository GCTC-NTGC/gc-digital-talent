import { useIntl } from "react-intl";
import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";

import { CardSeparator, Heading } from "@gc-digital-talent/ui";
import { Checkbox, Submit } from "@gc-digital-talent/forms";
import { Maybe } from "@gc-digital-talent/graphql";
import { errorMessages } from "@gc-digital-talent/i18n";

export interface SubformValues {
  consent: Maybe<string>;
}

interface ReviewAndSubmitProps {
  formDisabled: boolean;
}

const ReviewAndSubmit = ({ formDisabled }: ReviewAndSubmitProps) => {
  const intl = useIntl();

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
          {intl.formatMessage({
            defaultMessage: "Review and submit",
            id: "ITtt88",
            description: "Heading for the 'Review and submit' section",
          })}
        </Heading>
        <span>
          {intl.formatMessage({
            defaultMessage:
              "Please review the information you’ve provided. Once a community is added to your profile, you can freely update this information or remove the community entirely at any time.",
            id: "o9e3P/",
            description: "Description of the 'Review and submit' section",
          })}
        </span>
      </div>
      <CardSeparator space="none" />
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
                "You can rescind this consent at any time by opting out of job referrals and interest in training.",
              id: "ot7s0V",
              description:
                "statement for the 'Review and submit' consent section, paragraph 2",
            })}
          </p>
        </div>
        <Checkbox
          id="consent"
          name="consent"
          boundingBoxLabel={intl.formatMessage({
            defaultMessage: "Consent to share",
            id: "5oqGTl",
            description: "Label for the input for the constent check",
          })}
          label={intl.formatMessage({
            defaultMessage:
              "I agree that by indicating my interest in work or training opportunities that my profile will be shared with HR staff and hiring managers in this functional community.",
            id: "09PkgL",
            description: "Statement for the input for the constent check",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          disabled={formDisabled}
          boundingBox
        />
      </div>
      <CardSeparator space="none" />
      {/* submit button */}
      <div
        data-h2-display="base(flex)"
        data-h2-justify-content="base(flex-end)"
        data-h2-gap="base(x1)"
      >
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
