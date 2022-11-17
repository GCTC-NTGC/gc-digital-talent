import { useNavigate } from "react-router-dom";

import useAuthorizationContext from "@common/hooks/useAuthorizationContext";

import useRoutes from "../../hooks/useRoutes";

const ProfileRedirect = () => {
  const paths = useRoutes();
  const navigate = useNavigate();
  const { loggedInUser } = useAuthorizationContext();

  if (loggedInUser) {
    navigate(paths.profile(loggedInUser.id), { replace: true });
  }

  navigate(paths.home(), { replace: true });

  return null; // Return null to satisfy type
};

export default ProfileRedirect;
