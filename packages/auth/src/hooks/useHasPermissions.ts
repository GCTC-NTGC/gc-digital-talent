import checkPermissions, {
  type PermissionRequirement,
} from "../utils/checkPermissions";
import useAuthorization from "./useAuthorization";

/**
 * Returns true when the current user satisfies at least one of the given
 * permission requirements. Returns false while authorization data is loading.
 */
const useHasPermissions = (
  requirements: PermissionRequirement | PermissionRequirement[],
): boolean => {
  const { roleAssignments, isLoaded } = useAuthorization();

  return isLoaded && checkPermissions(requirements, roleAssignments);
};

export default useHasPermissions;
