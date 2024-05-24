import { useIntl } from "react-intl";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

import { Heading, Separator, Well } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import ClaimRow from "./ClaimRow";
import { priorityTitle, veteranTitle } from "./messages";

interface ClaimSeparatorProps {
  show: boolean;
}

const ClaimSeparator = ({ show }: ClaimSeparatorProps) => {
  if (!show) return null;

  return <Separator orientation="horizontal" space="sm" decorative />;
};

const ClaimVerification_Fragment = graphql(/* GraphQL */ `
  fragment ClaimVerification on PoolCandidate {
    veteranVerification
    veteranVerificationExpiry
    priorityVerification
    priorityVerificationExpiry
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
    !!claimVerification.veteranVerification ||
    !!claimVerification.priorityVerification;
  const hasBothClaims =
    !!claimVerification.priorityVerification &&
    !!claimVerification.veteranVerification;

  return (
    <>
      <Heading Icon={InformationCircleIcon} color="quaternary">
        {intl.formatMessage({
          defaultMessage: "Other information",
          id: "blGYmQ",
          description: "Heading for additional information",
        })}
      </Heading>
      <p data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage:
            "Review the provided information to ensure it's accurate and up-to-date.",
          id: "2sxe4b",
          description: "Lead-in text for verifying a candidates claims",
        })}
      </p>
      {hasEitherClaim ? (
        <>
          <ClaimRow
            expiry={claimVerification.priorityVerificationExpiry}
            result={claimVerification.priorityVerification}
            title={intl.formatMessage(priorityTitle)}
          >
            <div />
          </ClaimRow>
          <ClaimSeparator show={hasBothClaims} />
          <ClaimRow
            expiry={claimVerification.veteranVerificationExpiry}
            result={claimVerification.veteranVerification}
            title={intl.formatMessage(veteranTitle)}
          >
            <div />
          </ClaimRow>
        </>
      ) : (
        <Well>
          {intl.formatMessage({
            defaultMessage:
              "The candidate has no other information that needs verification.",
            id: "06xcoU",
            description:
              "Message for when a candidate has no claims to be verified",
          })}
        </Well>
      )}
    </>
  );
};

export default ClaimVerification;
