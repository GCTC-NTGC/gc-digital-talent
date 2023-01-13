import React from "react";

import { ApplyDialog, LearnDialog } from "./Dialog";

const CTAButtons = () => (
  <div data-h2-display="p-tablet(flex)">
    <div
      data-h2-width="p-tablet(50%)"
      data-h2-margin="base(0, 0, x1, 0) p-tablet(0, x.5, x1, 0)"
    >
      <ApplyDialog btnProps={{ block: true }} />
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
