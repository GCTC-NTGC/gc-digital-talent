import { useQuery } from "urql";
import { useIntl } from "react-intl";

import { graphql } from "@gc-digital-talent/graphql";
import { Breadcrumbs, Container, Loading, Notice } from "@gc-digital-talent/ui";
import { NotFoundError } from "@gc-digital-talent/helpers";
import { htmlToRichTextJSON, RichTextRenderer } from "@gc-digital-talent/forms";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";

import useRequiredParams from "~/hooks/useRequiredParams";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";

const JobPosterArchive_Query = graphql(/** GraphQL */ `
  query JobPosterArchive($id: UUID!) {
    pool(id: $id) {
      name {
        localized
      }
      archives(type: CLOSED) {
        html {
          localized
        }
      }
    }
  }
`);

interface RouteParams extends Record<string, string> {
  poolId: string;
}

const JobPosterArchivePage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const [{ data, fetching, error }] = useQuery({
    query: JobPosterArchive_Query,
    variables: { id: poolId },
  });

  const html = data?.pool?.archives?.[0]?.html?.localized;
  const title = intl.formatMessage(
    {
      defaultMessage: "Closed: {title}",
      id: "ORrbTd",
      description: "Label for an item that has been closed",
    },
    {
      title:
        data?.pool?.name?.localized ??
        intl.formatMessage(commonMessages.notAvailable),
    },
  );

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.browseJobs),
        url: paths.closedJobs(),
      },
      {
        label: title,
        url: paths.jobPosterArchive(poolId),
      },
    ],
  });

  if (fetching) return <Loading />;

  if (error) {
    throw new Error(error.message);
  }

  if (!html) {
    throw new NotFoundError();
  }

  return (
    <>
      <SEO title={title} />
      <Breadcrumbs crumbs={crumbs} />
      <Container className="my-18 **:[[id]]:scroll-mt-24">
        <Notice.Root color="warning" className="mb-18">
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "You’re viewing an archived version of this job opportunity. We're no longer accepting applications.",
                id: "gWTDsl",
                description: "Warning for a closed job poster",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
        <RichTextRenderer node={htmlToRichTextJSON(html)} />
      </Container>
    </>
  );
};

export default JobPosterArchivePage;
