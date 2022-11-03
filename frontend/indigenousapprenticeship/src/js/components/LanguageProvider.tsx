import React from "react";
import { Outlet } from "react-router-dom";

import LanguageRedirectContainer from "@common/components/LanguageRedirectContainer";

import * as IndigenousApprenticeshipFrench from "../lang/frCompiled.json";

const LanguageProvider = () => {
  return (
    <LanguageRedirectContainer messages={IndigenousApprenticeshipFrench}>
      <Outlet />
    </LanguageRedirectContainer>
  );
};

export default LanguageProvider;
