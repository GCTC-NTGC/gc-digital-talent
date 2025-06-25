import { useIntl } from "react-intl";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import { PropsWithoutRef, ReactNode, SVGProps } from "react";
import { tv } from "tailwind-variants";

import {
  ClaimVerificationResult,
  Maybe,
  Scalars,
} from "@gc-digital-talent/graphql";
import { Heading } from "@gc-digital-talent/ui";
import {
  formDateStringToDate,
  formatDate,
} from "@gc-digital-talent/date-helpers";

interface VerificationMessageProps {
  result: ClaimVerificationResult;
  expiry?: Maybe<Scalars["DateTime"]["output"]>;
}

const VerificationMessage = ({ result, expiry }: VerificationMessageProps) => {
  const intl = useIntl();
  let message = intl.formatMessage({
    defaultMessage: "This claim is unverified.",
    id: "YiDdh6",
    description: "Message when a claim as yet to be verified",
  });

  if (result === ClaimVerificationResult.Accepted) {
    const expiryDate = expiry
      ? intl.formatMessage(
          {
            defaultMessage: "expires on {expiryDate}",
            id: "Ymzxgl",
            description: "Message part for expiry date",
          },
          {
            expiryDate: formatDate({
              date: formDateStringToDate(expiry),
              formatString: "MMMM d, yyyy",
              intl,
            }),
          },
        )
      : intl.formatMessage({
          defaultMessage: "no expiration provided",
          id: "xSSp8E",
          description:
            "Message for when an expiration date has not been provided",
        });

    message = intl.formatMessage(
      {
        defaultMessage: "This claim has been verified, {expiryDate}.",
        id: "w8K6dD",
        description: "Message when a claim as been verified",
      },
      {
        expiryDate,
      },
    );
  }

  if (result === ClaimVerificationResult.Rejected) {
    message = intl.formatMessage({
      defaultMessage: "This claim does not apply to this process.",
      id: "fPnIUP",
      description:
        "Message when a claim does not apply to the specific process",
    });
  }

  return <p>{message}</p>;
};

interface VerificationIconProps
  extends PropsWithoutRef<SVGProps<SVGSVGElement>> {
  result: ClaimVerificationResult;
}

const VerificationIcon = ({ result, ...rest }: VerificationIconProps) => {
  if (result === ClaimVerificationResult.Accepted) {
    return <CheckCircleIcon className="size-6 text-success" {...rest} />;
  }

  if (result === ClaimVerificationResult.Rejected) {
    return <XCircleIcon className="size-6 text-error" {...rest} />;
  }

  return <InformationCircleIcon className="size-6 text-warning" {...rest} />;
};

interface ClaimRowProps {
  result?: ClaimVerificationResult | null;
  title: ReactNode;
  expiry?: Maybe<Scalars["DateTime"]["output"]>;
  children: ReactNode;
}

const ClaimRow = ({ result, title, expiry, children }: ClaimRowProps) => {
  if (!result) return null;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <VerificationIcon result={result} />
      <div>
        <Heading level="h3" size="h5" className="mt-0">
          {title}
        </Heading>
        <VerificationMessage result={result} expiry={expiry} />
      </div>
      <div className="ml-auto">{children}</div>
    </div>
  );
};

export default ClaimRow;
