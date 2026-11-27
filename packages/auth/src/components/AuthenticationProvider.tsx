import type { ReactNode } from "react";

// oxlint-disable-next-line no-restricted-imports
import { useLocale } from "@gc-digital-talent/i18n";

import AuthenticationContainer from "./AuthenticationContainer";

interface AuthenticationContainerProps {
  children?: ReactNode;
}

const AuthenticationProvider = ({ children }: AuthenticationContainerProps) => {
  const locale = useLocale();

  return (
    <AuthenticationContainer locale={locale}>
      {children}
    </AuthenticationContainer>
  );
};

export default AuthenticationProvider;
