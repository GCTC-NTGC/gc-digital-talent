import { ReactNode, useEffect, useMemo, useRef } from "react";
import { Client, Provider } from "urql";
import { useIntl } from "react-intl";

import {
  AuthenticationState,
  useAuthentication,
} from "@gc-digital-talent/auth";

import { isTokenProbablyExpired } from "../../utils/isTokenProbablyExpired";
import { getClient } from "../../utils/getClient";

const ClientProvider = ({
  client,
  children,
}: {
  client?: Client;
  children?: ReactNode;
}) => {
  const intl = useIntl();
  const authContext = useAuthentication();
  // Create a mutable object to hold the auth state
  const authRef = useRef<AuthenticationState>(authContext);
  // Keep the contents of that mutable object up to date
  useEffect(() => {
    authRef.current = authContext;
  }, [authContext]);

  const internalClient = useMemo(
    () => client ?? getClient({ intl }),
    [client, intl],
  );

  return <Provider value={internalClient}>{children}</Provider>;
};

export default ClientProvider;

// https://stackoverflow.com/questions/54116070/how-can-i-unit-test-non-exported-functions
export const exportedForTesting = {
  isTokenProbablyExpired,
};
