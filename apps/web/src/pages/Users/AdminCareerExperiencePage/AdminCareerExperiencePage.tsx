import { useIntl } from "react-intl";
import { useQuery } from "urql";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";

import {
  ThrowNotFound,
  Pending,
  Separator,
  Container,
  TableOfContents,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { navigationMessages } from "@gc-digital-talent/i18n";

import profileMessages from "~/messages/profileMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";
import CareerTimelineSection from "~/components/CareerTimelineSection/CareerTimelineSection";

import DownloadButton from "../DownloadButton";

const AdminCareerExperience_Fragment = graphql(/** GraphQL */ `
  fragment AdminCareerExperience on Experience {
    ...CareerTimelineSectionExperience
  }
`);

interface AdminCareerExperienceProps {
  userId: Scalars["UUID"]["output"];
  query: FragmentType<typeof AdminCareerExperience_Fragment>[];
}

const AdminCareerExperience = ({
  userId,
  query,
}: AdminCareerExperienceProps) => {
  const intl = useIntl();
  const experiences = getFragment(AdminCareerExperience_Fragment, query);

  return (
    <Container className="my-18">
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.List>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id="career-experience">
                {intl.formatMessage(navigationMessages.careerExperience)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          </TableOfContents.List>
          <Separator decorative orientation="horizontal" space="xs" />
          <DownloadButton id={userId} />
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <TableOfContents.Section id="career-experience">
            <TableOfContents.Heading
              icon={NewspaperIcon}
              color="secondary"
              className="mt-0 mb-6"
            >
              {intl.formatMessage(navigationMessages.careerExperience)}
            </TableOfContents.Heading>
            <p className="my-6">
              {intl.formatMessage({
                defaultMessage:
                  "This section allows you to browse the user’s complete career experience.",
                id: "E+LRKs",
                description: "Description of a users career experiences",
              })}
            </p>
            <CareerTimelineSection
              experiencesQuery={unpackMaybes(experiences)}
              showEdit={false}
            />
          </TableOfContents.Section>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </Container>
  );
};

const AdminCareerExperiencePage_Query = graphql(/* GraphQL */ `
  query AdminCareerExperiencePage($id: UUID!) {
    user(id: $id, trashed: WITH) {
      id
      experiences {
        ...AdminCareerExperience
      }
    }
  }
`);

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
}

const AdminCareerExperiencePage = () => {
  const intl = useIntl();
  const { userId } = useRequiredParams<RouteParams>("userId");
  const [{ data, fetching, error }] = useQuery({
    query: AdminCareerExperiencePage_Query,
    variables: { id: userId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.user ? (
        <AdminCareerExperience
          userId={data?.user.id}
          query={unpackMaybes(data?.user.experiences)}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityTalentCoordinator,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <AdminCareerExperiencePage />
  </RequireAuth>
);

Component.displayName = "AdminCareerExperiencePage";

export default Component;
