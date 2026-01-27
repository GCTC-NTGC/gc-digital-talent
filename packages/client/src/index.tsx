import ClientProvider from "./components/ClientProvider/ClientProvider";
import { isUuidError, extractValidationMessageKeys } from "./utils/errors";
import canAccessProtectedEndpoint from "./utils/canAccessProtectedEndpoint";
import { getClient } from "./utils/getClient";

export default ClientProvider;
export {
  isUuidError,
  canAccessProtectedEndpoint,
  getClient,
  extractValidationMessageKeys,
};
