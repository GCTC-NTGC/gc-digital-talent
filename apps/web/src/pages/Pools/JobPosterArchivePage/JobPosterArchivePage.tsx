import { useQuery } from "urql";

import { graphql } from "@gc-digital-talent/graphql";
import { Container, Loading } from "@gc-digital-talent/ui";
import { NotFoundError } from "@gc-digital-talent/helpers";
import { htmlToRichTextJSON, RichTextRenderer } from "@gc-digital-talent/forms";

import useRequiredParams from "~/hooks/useRequiredParams";

const JobPosterArchive_Query = graphql(/** GraphQL */ `
  query JobPosterArchive($id: UUID!) {
    pool(id: $id) {
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
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const [{ data, fetching, error }] = useQuery({
    query: JobPosterArchive_Query,
    variables: { id: poolId },
  });

  if (fetching) return <Loading />;

  if (error) {
    throw new Error(error.message);
  }

  const html = data?.pool?.archives?.[0]?.html?.localized;

  if (!html) {
    throw new NotFoundError();
  }

  return (
    <Container className="my-18">
      <RichTextRenderer node={htmlToRichTextJSON(html)} />
    </Container>
  );
};

export default JobPosterArchivePage;
