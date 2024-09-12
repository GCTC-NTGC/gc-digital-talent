import { OperationContext, useQuery } from "urql";
import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRequiredParams from "~/hooks/useRequiredParams";

const JobPosterTemplateTopLevel_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateTopLevel on JobPosterTemplate {
    name {
      en
      fr
    }
  }
`);
interface JobPosterTemplateProps {
  jobPosterTemplateQuery: FragmentType<
    typeof JobPosterTemplateTopLevel_Fragment
  >;
}

const JobPosterTemplate = ({
  jobPosterTemplateQuery,
}: JobPosterTemplateProps) => {
  const jobPosterTemplate = getFragment(
    JobPosterTemplateTopLevel_Fragment,
    jobPosterTemplateQuery,
  );
  return <span>{`Hello World! ${jobPosterTemplate.name?.en}`}</span>;
};

const JobPosterTemplatePage_Query = graphql(/* GraphQL */ `
  query JobPosterTemplatePage($templateId: UUID!) {
    jobPosterTemplate(id: $templateId) {
      id
      ...JobPosterTemplateTopLevel
    }
  }
`);

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RouteParams = {
  templateId: Scalars["ID"]["output"];
};

const context: Partial<OperationContext> = {
  requestPolicy: "cache-first",
};

const JobPosterTemplatePage = () => {
  const intl = useIntl();
  const { templateId } = useRequiredParams<RouteParams>("templateId");

  const [{ data, fetching, error }] = useQuery({
    query: JobPosterTemplatePage_Query,
    context,
    variables: { templateId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.jobPosterTemplate ? (
        <JobPosterTemplate jobPosterTemplateQuery={data.jobPosterTemplate} />
      ) : (
        <ThrowNotFound message={intl.formatMessage(commonMessages.notFound)} />
      )}
    </Pending>
  );
};

export const Component = () => <JobPosterTemplatePage />;

Component.displayName = "JobPosterTemplatePage";

export default JobPosterTemplatePage;
