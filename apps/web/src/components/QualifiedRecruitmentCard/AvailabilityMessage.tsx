import React from "react";
import { useIntl } from "react-intl";

import { Maybe, PoolCandidateStatus, Scalars } from "~/api/generated";
import { getAvailabilityInfo } from "./utils";

interface AvailabilityMessageProps {
  id: Scalars["ID"];
  status: Maybe<PoolCandidateStatus>;
  isSuspended: boolean;
}

const AvailabilityMessage = ({
  id,
  status,
  isSuspended,
}: AvailabilityMessageProps) => {
  const intl = useIntl();
  const {
    icon: Icon,
    color,
    text,
  } = getAvailabilityInfo(status, isSuspended, intl);

  return (
    <p
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-gap="base(0 x.25)"
    >
      <Icon data-h2-height="base(auto)" data-h2-width="base(1em)" {...color} />
      <span>{text}</span>
    </p>
  );
};

export default AvailabilityMessage;
