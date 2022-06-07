import React from "react";

import LanguageRedirectContainer from "../LanguageRedirectContainer";
import type { Messages } from "../LanguageRedirectContainer";

export interface LanguageRedirectProviderProps {
  messages: Messages;
}

const LanguageRedirectProvider: React.FC<LanguageRedirectProviderProps> = ({
  messages,
  children,
}) => (
  <LanguageRedirectContainer messages={messages}>
    {children}
  </LanguageRedirectContainer>
);

export default LanguageRedirectProvider;
