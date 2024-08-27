import useRequiredParams from "~/hooks/useRequiredParams";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RouteParams = {
  applicationId: string;
};

const useApplicationId = () => {
  const { applicationId } = useRequiredParams<RouteParams>("applicationId");

  return applicationId;
};

export default useApplicationId;
