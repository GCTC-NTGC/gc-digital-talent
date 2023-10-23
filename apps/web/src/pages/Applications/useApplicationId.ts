import useRequiredParams from "~/hooks/useRequiredParams";

type RouteParams = {
  applicationId: string;
};

const useApplicationId = () => {
  const { applicationId } = useRequiredParams<RouteParams>("applicationId");

  return applicationId;
};

export default useApplicationId;
