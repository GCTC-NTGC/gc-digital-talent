import ClientProvider from "./components/ClientProvider/ClientProvider";
import { isUuidError } from "./utils/errors";
import canAccessProtectedEndpoint from "./utils/canAccessProtectedEndpoint";

export default ClientProvider;
export { isUuidError, canAccessProtectedEndpoint };
