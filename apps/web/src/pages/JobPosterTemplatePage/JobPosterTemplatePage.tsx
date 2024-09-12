import { Scalars } from "@gc-digital-talent/graphql";
import { Pending } from "@gc-digital-talent/ui";

import useRequiredParams from "~/hooks/useRequiredParams";

interface JobPosterTemplateProps {
  templateId: string;
}

const JobPosterTemplate = ({ templateId }: JobPosterTemplateProps) => {
  return <span>{`Hello World! ${templateId}`}</span>;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RouteParams = {
  templateId: Scalars["ID"]["output"];
};

const JobPosterTemplatePage = () => {
  const { templateId } = useRequiredParams<RouteParams>("templateId");
  const fetching = false;
  const error = undefined;
  return (
    <Pending fetching={fetching} error={error}>
      <JobPosterTemplate templateId={templateId} />
    </Pending>
  );
};

export const Component = () => <JobPosterTemplatePage />;

Component.displayName = "JobPosterTemplatePage";

export default JobPosterTemplatePage;
