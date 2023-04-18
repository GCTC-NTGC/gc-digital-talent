import React from "react";
import { useIntl } from "react-intl";

import { Alert } from "@gc-digital-talent/ui";
import { useFeatureFlags } from "@gc-digital-talent/env";

const StrikeNotice = () => {
  const intl = useIntl();
  const { psacStrike } = useFeatureFlags();

  if (!psacStrike) return null;

  return (
    <Alert.Root type="warning">
      <Alert.Title>
        {intl.formatMessage({
          defaultMessage:
            "The Government of Canada and the Public Service Alliance of Canada (PSAC) are currently negotiating collective agreements.",
          id: "oF8h5+",
          description: "Heading for the PSAC strike notice.",
        })}
      </Alert.Title>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "In the event of a labour disruption, referral services from this platform will be affected. Please note that your request will be responded when services resume. Thank you for your patience.",
          id: "xyPGzO",
          description: "Content for the PSAC strike notice.",
        })}
      </p>
    </Alert.Root>
  );
};

export default StrikeNotice;
