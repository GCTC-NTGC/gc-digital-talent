import React from "react";
import { Outlet } from "react-router-dom";

import LanguageRedirectContainer from "@common/components/LanguageRedirectContainer";

import * as IndigenousApprenticeshipFrench from "../lang/frCompiled.json";

/**
 * LanguageProvider
 *
 * Note: This is a little odd but necessary
 * since we are not handling a root route here
 *
 * @returns React.ReactElement
 */
const LanguageProvider = () => {
  return (
    <LanguageRedirectContainer messages={IndigenousApprenticeshipFrench}>
      <Outlet />
    </LanguageRedirectContainer>
  );
};

export default LanguageProvider;
