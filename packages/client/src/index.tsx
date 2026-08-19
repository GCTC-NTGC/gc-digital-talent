import ClientProvider from "./components/ClientProvider/ClientProvider";
import { isUuidError, extractValidationMessageKeys } from "./utils/errors";
import canAccessProtectedEndpoint from "./utils/canAccessProtectedEndpoint";
import { getClient } from "./utils/getClient";
import { protectedEndpointContext } from "./utils/protectedEndpointContext";

export default ClientProvider;
export {
  isUuidError,
  canAccessProtectedEndpoint,
  protectedEndpointContext,
  getClient,
  extractValidationMessageKeys,
};
