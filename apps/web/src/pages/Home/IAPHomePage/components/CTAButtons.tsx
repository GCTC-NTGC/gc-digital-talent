import { ApplyDialog, LearnDialog } from "~/components/IAPDialog";

import ApplyLink from "./ApplyLink";

interface CTAButtonsProps {
  latestPoolId?: string;
}

const CTAButtons = ({ latestPoolId }: CTAButtonsProps) => (
  <div className="mb-6 grid gap-6 xs:grid-cols-2">
    <div>
      {latestPoolId ? (
        <ApplyLink id={latestPoolId} />
      ) : (
        <ApplyDialog btnProps={{ block: true }} />
      )}
    </div>
    <div>
      <LearnDialog btnProps={{ block: true }} />
    </div>
  </div>
);

export default CTAButtons;
