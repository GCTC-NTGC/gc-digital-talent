import { useIntl } from "react-intl";

import sections from "../sections";

const EssentialBehaviouralSkills = () => {
  const intl = useIntl();
  return (
    <>{intl.formatMessage(sections.essentialBehaviouralSkills.longTitle)}</>
  );
};

export default EssentialBehaviouralSkills;
