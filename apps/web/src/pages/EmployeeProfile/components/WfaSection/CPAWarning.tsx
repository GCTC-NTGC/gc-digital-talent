import { useIntl } from "react-intl";

import Warning from "./Warning";

const CPAWarning = () => {
  const intl = useIntl();
  return (
    <Warning className="mb-0">
      <p>
        {intl.formatMessage({
          defaultMessage: "This position is not with a CPA department",
          id: "CYMMd0",
          description:
            "Title for when the users substantive experience is not work a core public admin department",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This functionality is available only if your substantive position is with a department in the core public administration.",
          id: "9XY9Ok",
          description:
            "Description that wfa is only available for core public admin departments",
        })}
      </p>
    </Warning>
  );
};

export default CPAWarning;
