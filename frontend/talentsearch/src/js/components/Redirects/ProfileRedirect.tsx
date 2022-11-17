import { useNavigate } from "react-router-dom";

import useAuthorizationContext from "@common/hooks/useAuthorizationContext";

import useRoutes from "../../hooks/useRoutes";

const ProfileRedirect = () => {
  const paths = useRoutes();
  const navigate = useNavigate();
  const { loggedInUser } = useAuthorizationContext();

  if (loggedInUser) {
    return navigate(paths.profile(loggedInUser.id), { replace: true });
  }

  return navigate(paths.home(), { replace: true });
};

export default ProfileRedirect;
