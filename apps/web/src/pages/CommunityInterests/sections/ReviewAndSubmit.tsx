import { useIntl } from "react-intl";
import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";
import { useFormContext } from "react-hook-form";

import { Heading } from "@gc-digital-talent/ui";
import { Checkbox, Submit } from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import pageTitles from "~/messages/pageTitles";

import { FormValues } from "../form";

const ReviewAndSubmitOptions_Fragment = graphql(/* GraphQL */ `
  fragment ReviewAndSubmitOptions_Fragment on Query {
    communities {
      id
      name {
        localized
      }
    }
  }
`);

export interface SubformValues {
  consent: boolean | null;
}

interface ReviewAndSubmitProps {
  optionsQuery: FragmentType<typeof ReviewAndSubmitOptions_Fragment>;
  formDisabled: boolean;
}

const ReviewAndSubmit = ({
  optionsQuery,
  formDisabled,
}: ReviewAndSubmitProps) => {
  const intl = useIntl();
  const optionsData = getFragment(
    ReviewAndSubmitOptions_Fragment,
    optionsQuery,
  );

  const { watch } = useFormContext<FormValues>();
  const [selectedCommunityId] = watch(["communityId"]);
  const selectedCommunityName =
    optionsData.communities.find(
      (community) => community?.id === selectedCommunityId,
    )?.name?.localized ?? intl.formatMessage(commonMessages.notFound);

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
        </div>
        <Checkbox
          id="consent"
          name="consent"
          boundingBoxLabel={intl.formatMessage({
            defaultMessage: "Consent to share",
            id: "AlOrGy",
            description: "Label for the input for the consent check",
          })}
          label={intl.formatMessage(
            {
              defaultMessage:
                "I agree that by adding the {communityName} to my profile that my information will be shared with talent managers, HR staff, and hiring managers in this functional community.",
              id: "2BCHZm",
              description: "Statement for the input for the consent check",
            },
            { communityName: selectedCommunityName },
          )}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          disabled={formDisabled}
          boundingBox
        />
      </div>
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
