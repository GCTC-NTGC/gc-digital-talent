import { ApplyDialog, LearnDialog } from "~/components/IAPDialog";

const CTAButtons = () => (
  <div className="mb-6 grid gap-6 xs:grid-cols-2">
    <div>
      <ApplyDialog btnProps={{ block: true }} />
    </div>
    <div>
      <LearnDialog btnProps={{ block: true }} />
    </div>
  </div>
);

export default CTAButtons;
