import { useIntl } from "react-intl";

import sections from "../sections";

const KeyTasks = () => {
  const intl = useIntl();
  return <>{intl.formatMessage(sections.keyTasks.longTitle)}</>;
};

export default KeyTasks;
