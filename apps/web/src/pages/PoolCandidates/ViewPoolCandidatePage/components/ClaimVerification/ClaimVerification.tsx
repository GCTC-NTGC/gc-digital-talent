import { useIntl } from "react-intl";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

import { Heading, Separator, Notice, Ul } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import profileMessages from "~/messages/profileMessages";

import ClaimRow from "./ClaimRow";
import ClaimVerificationDialog from "./ClaimVerificationDialog";

interface ClaimSeparatorProps {
  show: boolean;
}

const ClaimSeparator = ({ show }: ClaimSeparatorProps) => {
  if (!show) return null;

  return <Separator orientation="horizontal" space="sm" decorative />;
};

const ClaimVerification_Fragment = graphql(/* GraphQL */ `
  fragment ClaimVerification on PoolCandidate {
    id
    specialApplicationType {
      value
      label {
        localized
      }
    }
    specialApplicationJustification
    isSpecialApplication
    user {
      priorityNumber
    }
    applicationAssessmentData {
      veteranVerification
      veteranVerificationExpiry
      priorityVerification
      priorityVerificationExpiry
    }
  }
`);

interface ClaimVerificationProps {
  verificationQuery: FragmentType<typeof ClaimVerification_Fragment>;
}

const ClaimVerification = ({ verificationQuery }: ClaimVerificationProps) => {
  const intl = useIntl();
  const claimVerification = getFragment(
    ClaimVerification_Fragment,
    verificationQuery,
  );

  const hasEitherClaim =
    !!claimVerification.applicationAssessmentData?.veteranVerification ||
    !!claimVerification.applicationAssessmentData?.priorityVerification;
  const hasBothClaims =
    !!claimVerification.applicationAssessmentData?.priorityVerification &&
    !!claimVerification.applicationAssessmentData?.veteranVerification;

  return (
    <>
      <Heading
        icon={InformationCircleIcon}
        color="warning"
        level="h2"
        size="h3"
      >
        {intl.formatMessage({
          defaultMessage: "Other information",
          id: "blGYmQ",
          description: "Heading for additional information",
        })}
      </Heading>
      <p className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "Review the provided information to ensure it's accurate and up-to-date.",
          id: "2sxe4b",
          description: "Lead-in text for verifying a candidates claims",
        })}
      </p>
      {claimVerification.isSpecialApplication ? (
        <Notice.Root color="warning" className="mb-6">
          <Notice.Title defaultIcon as="h2">
            {intl.formatMessage(commonMessages.specialApplication)}
          </Notice.Title>
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "This special application was created for the following reason",
                id: "SUVTfy",
                description: "Special application type section",
              })}
              {intl.formatMessage(commonMessages.dividingColon)}
            </p>
            <Ul className="my-3">
              <li>
                {claimVerification.specialApplicationType?.label?.localized ??
                  intl.formatMessage(commonMessages.notFound)}
              </li>
            </Ul>
            <p>
              {intl.formatMessage({
                defaultMessage: "Provided justification",
                id: "XB3D2p",
                description: "Justification section",
              })}
              {intl.formatMessage(commonMessages.dividingColon)}
            </p>
            <Ul className="mt-3">
              <li>
                {claimVerification.specialApplicationJustification ??
                  intl.formatMessage(commonMessages.notFound)}
              </li>
            </Ul>
          </Notice.Content>
        </Notice.Root>
      ) : null}
      {hasEitherClaim ? (
        <>
          <ClaimRow
            expiry={
              claimVerification.applicationAssessmentData
                ?.priorityVerificationExpiry
            }
            result={
              claimVerification.applicationAssessmentData?.priorityVerification
            }
            title={intl.formatMessage(profileMessages.priorityStatus)}
          >
            <ClaimVerificationDialog
              context="priority"
              priorityNumber={claimVerification.user.priorityNumber}
              id={claimVerification.id}
              result={
                claimVerification.applicationAssessmentData
                  ?.priorityVerification
              }
              expiry={
                claimVerification.applicationAssessmentData
                  ?.priorityVerificationExpiry
              }
            />
          </ClaimRow>
          <ClaimSeparator show={hasBothClaims} />
          <ClaimRow
            expiry={
              claimVerification.applicationAssessmentData
                ?.veteranVerificationExpiry
            }
            result={
              claimVerification.applicationAssessmentData?.veteranVerification
            }
            title={intl.formatMessage(profileMessages.veteranStatus)}
          >
            <ClaimVerificationDialog
              context="veteran"
              id={claimVerification.id}
              result={
                claimVerification.applicationAssessmentData?.veteranVerification
              }
              expiry={
                claimVerification.applicationAssessmentData
                  ?.veteranVerificationExpiry
              }
            />
          </ClaimRow>
        </>
      ) : (
        <Notice.Root>
          <Notice.Content>
            {intl.formatMessage({
              defaultMessage:
                "The candidate has no other information that needs verification.",
              id: "06xcoU",
              description:
                "Message for when a candidate has no claims to be verified",
            })}
          </Notice.Content>
        </Notice.Root>
      )}
    </>
  );
};

export default ClaimVerification;
