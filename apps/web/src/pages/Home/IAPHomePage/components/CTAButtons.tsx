import React from "react";

import ApplicationLink from "~/pages/Pools/PoolAdvertisementPage/components/ApplicationLink";
import { ApplyDialog, LearnDialog } from "./Dialog";

interface CTAButtonsProps {
  latestPoolId?: string;
  applicationId?: string;
  hasApplied?: boolean;
  canApply?: boolean;
}

const CTAButtons = ({
  latestPoolId,
  applicationId,
  hasApplied,
  canApply,
}: CTAButtonsProps) => (
  <div data-h2-display="p-tablet(flex)">
    <div
      data-h2-width="p-tablet(50%)"
      data-h2-margin="base(0, 0, x1, 0) p-tablet(0, x.5, x1, 0)"
    >
      {latestPoolId ? (
        <ApplicationLink
          poolId={latestPoolId}
          applicationId={applicationId}
          hasApplied={hasApplied}
          canApply={canApply}
        />
      ) : (
        <ApplyDialog btnProps={{ block: true }} />
      )}
    </div>
    <div
      data-h2-width="p-tablet(50%)"
      data-h2-margin="base(0, 0, x1, 0) p-tablet(0, 0, x1, x.5)"
    >
      <LearnDialog btnProps={{ block: true }} />
    </div>
  </div>
);

export default CTAButtons;
