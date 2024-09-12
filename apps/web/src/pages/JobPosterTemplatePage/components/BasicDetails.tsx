import { useIntl } from "react-intl";

import sections from "../sections";

const BasicDetails = () => {
  const intl = useIntl();
  return <>{intl.formatMessage(sections.basicDetails.title)}</>;
};

export default BasicDetails;
