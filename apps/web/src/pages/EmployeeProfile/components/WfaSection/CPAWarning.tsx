import { useIntl } from "react-intl";

import Warning from "./Warning";

const CPAWarning = () => {
  const intl = useIntl();
  return (
    <Warning className="mb-0">
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This position is not with a core public administration department",
          id: "tVYhY2",
          description:
            "Title for when the users substantive experience is not work a core public admin department",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Please note that alternations are available only if your substantive position is with a department in the core public administration.",
          id: "9A34sR",
          description:
            "Description that wfa is only available for core public admin departments",
        })}
      </p>
    </Warning>
  );
};

export default CPAWarning;
