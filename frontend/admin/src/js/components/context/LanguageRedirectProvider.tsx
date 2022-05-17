import React from "react";

import LanguageRedirectContainer from "@common/components/LanguageRedirectContainer";
import type { Messages } from "@common/components/LanguageRedirectContainer";

import AdminFrench from "../../lang/frCompiled.json";

const LanguageRedirectProvider: React.FC = ({ children }) => (
  <LanguageRedirectContainer messages={AdminFrench as Messages}>
    {children}
  </LanguageRedirectContainer>
);

export default LanguageRedirectProvider;
