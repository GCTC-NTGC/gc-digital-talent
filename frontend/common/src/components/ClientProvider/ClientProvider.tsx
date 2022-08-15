import { authExchange } from "@urql/exchange-auth";
import jwtDecode, { JwtPayload } from "jwt-decode";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Client,
  CombinedError,
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  errorExchange,
  Provider,
  Operation,
  makeOperation,
} from "urql";
import { GraphQLErrorExtensions } from "graphql";
import { toast } from "react-toastify";
import { tryFindMessageDescriptor } from "@common/messages/apiMessages";
import { formatMessage } from "@formatjs/intl";
import { IntlShape, useIntl } from "react-intl";
import { AuthenticationContext } from "../Auth";

// generate nonce somewhere here?
// const nonce = ...

const apiUri = process.env.API_URI ?? "http://localhost:8000/graphql";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
}

const addAuthToOperation = ({
  authState,
  operation,
}: {
  authState: AuthState | null;
  operation: Operation;
}): Operation => {
  if (!authState || !authState.accessToken) {
    return operation;
  }

  const fetchOptions =
    typeof operation.context.fetchOptions === "function"
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return makeOperation(operation.kind, operation, {
    ...operation.context,
    fetchOptions: {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${authState.accessToken}`,
      },
    },
  });
};

const didAuthError = ({ error }: { error: CombinedError }): boolean => {
  return error && error.response
    ? error.response.status === 401 ||
        error.graphQLErrors.some(
          (e) => e.extensions?.category === "authentication",
        )
    : false;
};

const willAuthError = ({ authState }: { authState: AuthState | null }) => {
  let tokenIsKnownToBeExpired = false;
  if (authState?.accessToken) {
    const decoded = jwtDecode<JwtPayload>(authState.accessToken);
    if (decoded.exp) tokenIsKnownToBeExpired = Date.now() > decoded.exp * 1000; // JWT expiry date in seconds, not milliseconds
  }

  if (tokenIsKnownToBeExpired) return true;

  return false;
};

// this is what the validation error extension looks like from our GraphQL server
type ValidationExtension = {
  validation: { [key: string]: [string] };
  category: string;
};

// type guard to ensure the error extension looks like our ValidationExtension type
function isValidationExtension(
  extension: GraphQLErrorExtensions,
): extension is ValidationExtension {
  return (
    (extension as ValidationExtension) !== undefined &&
    extension.category === "validation"
  );
}

// Accepts a CombinedError object, finds the validation error messages, and toasts them
const toastValidationErrors = (
  combinedError: CombinedError,
  intl: IntlShape,
) => {
  const validationErrorMessages = combinedError.graphQLErrors
    .filter((graphQLError) => isValidationExtension(graphQLError.extensions))
    .flatMap((graphQLError) => {
      const validationExtension =
        graphQLError.extensions as ValidationExtension;
      return Object.keys(validationExtension.validation).map(
        // one key per validation rule like "user.sub" or "user.email"
        (key) => validationExtension.validation[key],
      );
    })
    // Each rule has an array for possibly multiple error messages
    .flatMap((messageArrays) => messageArrays);

  const localizedMessages = validationErrorMessages.map((errorMessage) => {
    const localizedMessageDescriptor = tryFindMessageDescriptor(errorMessage);
    if (localizedMessageDescriptor) {
      return intl.formatMessage(localizedMessageDescriptor);
    }

    return errorMessage;
  });

  // if more than 1, arrange in a list
  if (localizedMessages.length > 1) {
    toast.error(
      <ul>
        {localizedMessages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>,
    );
  }

  // if just 1, show by itself
  if (localizedMessages.length === 1) {
    toast.error(localizedMessages[0]);
  }
};

const ClientProvider: React.FC<{ client?: Client }> = ({
  client,
  children,
}) => {
  const intl = useIntl();
  const authContext = useContext(AuthenticationContext);
  // Create a mutable object to hold the auth state
  const authRef = useRef(authContext);
  // Keep the contents of that mutable object up to date
  useEffect(() => {
    authRef.current = authContext;
  }, [authContext]);

  const getAuth = useCallback(
    async ({ authState: existingAuthState }): Promise<AuthState | null> => {
      // getAuth could be called for the first request or as the result of an error

      // At runtime, get the current auth state
      const { accessToken, refreshToken, idToken, logout, refreshTokenSet } =
        authRef.current;

      if (!existingAuthState) {
        // no existing auth state so this is probably just the first request
        if (accessToken) {
          return { accessToken, refreshToken, idToken };
        }
        return null;
      }

      /**
       * Logout the user and return null AuthState
       *
       * @returns null
       */
      const logoutNullState = () => {
        logout();
        return null;
      };

      // If authState is not null, and getAuth is called again, then it means authentication failed for some reason.
      // let's try to use a refresh token to get new tokens
      if (refreshToken) {
        const refreshedAuthState = await refreshTokenSet();
        if (refreshedAuthState) {
          return refreshedAuthState;
        }

        return logoutNullState();
      }

      return logoutNullState();
    },
    // This function is inside of `useCallback` to prevent breaking the memoization of internalClient.
    // If internalClient is re-instantiated it will lose its error count and can cause refresh loops.
    [],
  );

  const internalClient = useMemo(() => {
    return (
      client ??
      createClient({
        url: apiUri,
        exchanges: [
          /**
           * Commented out to stop urlq errors being displayed in toasts
           *
           * TODO: Confirm errors are being logged on the server
           * before removing console.error
           */
          errorExchange({
            onError: (error: CombinedError) => {
              // toast.error(error.message);
              toastValidationErrors(error, intl);

              // eslint-disable-next-line no-console
              console.error(error);
            },
          }),
          dedupExchange,
          cacheExchange,
          authExchange({
            getAuth,
            addAuthToOperation,
            didAuthError,
            willAuthError,
          }),
          fetchExchange,
        ],
      })
    );
  }, [client, getAuth, intl]);

  return <Provider value={internalClient}>{children}</Provider>;
};

export default ClientProvider;

// https://stackoverflow.com/questions/54116070/how-can-i-unit-test-non-exported-functions
export const exportedForTesting = {
  willAuthError,
};
