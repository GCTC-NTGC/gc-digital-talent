import ClientProvider from "./components/ClientProvider/ClientProvider";
import { isUuidError, extractValidationMessageKeys } from "./utils/errors";
import canAccessProtectedEndpoint from "./utils/canAccessProtectedEndpoint";

export default ClientProvider;
export {
  isUuidError,
  canAccessProtectedEndpoint,
  extractValidationMessageKeys,
};
