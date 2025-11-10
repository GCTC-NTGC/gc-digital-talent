import { ReactNode } from "react";

import { useLocale } from "@gc-digital-talent/i18n";

import AuthenticationContainer from "./AuthenticationContainer";

interface AuthenticationContainerProps {
  children?: ReactNode;
}

const AuthenticationProvider = ({ children }: AuthenticationContainerProps) => {
  // eslint-disable-next-line no-restricted-syntax
  const { locale } = useLocale();

  return (
    <AuthenticationContainer locale={locale}>
      {children}
    </AuthenticationContainer>
  );
};

export default AuthenticationProvider;
