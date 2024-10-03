import useRequiredParams from "~/hooks/useRequiredParams";

interface RouteParams extends Record<string, string> {
  applicationId: string;
}

const useApplicationId = () => {
  const { applicationId } = useRequiredParams<RouteParams>("applicationId");

  return applicationId;
};

export default useApplicationId;
