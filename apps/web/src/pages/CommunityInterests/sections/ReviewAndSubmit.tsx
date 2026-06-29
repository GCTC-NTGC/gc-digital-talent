import { useIntl } from "react-intl";
import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";
import { useFormContext } from "react-hook-form";
import type { ReactNode } from "react";

import { Card, Heading } from "@gc-digital-talent/ui";
import { Checkbox, Submit } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import pageTitles from "~/messages/pageTitles";

import type { FormValues } from "../form";

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
  actions?: ReactNode;
}

const ReviewAndSubmit = ({
  actions,
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
    <div>
      {/* heading and description */}
      <Heading
        level="h2"
        icon={DocumentMagnifyingGlassIcon}
        color="primary"
        className="mt-0 mb-6 font-normal"
      >
        {intl.formatMessage(pageTitles.reviewAndSubmit)}
      </Heading>
      <p className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "Please review the information you've provided. Once a community is added to your profile, you can update this information at any time.",
          id: "2Kz16k",
          description: "Description of the 'Review and submit' section",
        })}
      </p>
      {/* consent form */}
      <Heading
        level="h3"
        size="h6"
        color="primary"
        className="bm-0 mt-0 font-bold"
      >
        {intl.formatMessage({
          defaultMessage: "Consent to share your information",
          id: "HMlreE",
          description: "Heading for the 'Review and submit' consent section",
        })}
      </Heading>
      {/* consent statement */}
      <p>
        {intl.formatMessage({
          defaultMessage:
            "When you add a functional community to your profile, you agree to share your information with its talent managers, recruiters, and potential hiring managers. This includes your profile information, career experience, and skills portfolio. Your information may be used to connect you with relevant opportunities and gather insights on the functional community’s workforce.",
          id: "R6kZ1/",
          description:
            "statement for the 'Review and submit' consent section, paragraph 1",
        })}
      </p>
      <p className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "You can rescind this consent at any time by editing the functional communities you've added to your profile and using the “Remove community” button.",
          id: "J7GhW4",
          description:
            "statement for the 'Review and submit' consent section, paragraph 2",
        })}
      </p>
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
      {/* submit button */}
      <Card.Separator space="sm" />
      <div className="flex flex-col items-center justify-center gap-6 xs:flex-row xs:justify-start">
        {actions && <span>{actions}</span>}
        <Submit
          disabled={formDisabled}
          text={intl.formatMessage(formMessages.saveChanges)}
        />
      </div>
    </div>
  );
};

export default ReviewAndSubmit;
