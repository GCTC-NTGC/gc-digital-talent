import { useIntl } from "react-intl";

import sections from "../sections";

const EssentialTechnicalSkills = () => {
  const intl = useIntl();
  return <>{intl.formatMessage(sections.essentialTechnicalSkills.longTitle)}</>;
};

export default EssentialTechnicalSkills;
