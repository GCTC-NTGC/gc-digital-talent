import { useIntl } from "react-intl";

import sections from "../sections";

const AssetTechnicalSkills = () => {
  const intl = useIntl();
  return <>{intl.formatMessage(sections.assetTechnicalSkills.longTitle)}</>;
};

export default AssetTechnicalSkills;
