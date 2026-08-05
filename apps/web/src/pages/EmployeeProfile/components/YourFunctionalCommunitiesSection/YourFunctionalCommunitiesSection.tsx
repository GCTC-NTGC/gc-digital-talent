import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import LockClosedIcon from "@heroicons/react/24/outline/LockClosedIcon";
import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import { useLocation } from "react-router";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { Card, Heading, Link, Notice } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";

import FunctionalCommunityCard from "~/components/FunctionalCommunity/FunctionalCommunityCard";
import useRoutes from "~/hooks/useRoutes";

const YourFunctionalCommunitiesUser_Fragment = graphql(/** GraphQL */ `
  fragment YourFunctionalCommunitiesUser on User {
    isVerifiedGovEmployee
    employeeProfile {
      communityInterests {
        id
        community {
          name {
            localized
          }
        }
        ...PreviewListItemFunctionalCommunity
      }
    }
  }
`);

interface YourFunctionalCommunitiesSectionProps {
  userQuery: FragmentType<typeof YourFunctionalCommunitiesUser_Fragment>;
}

const YourFunctionalCommunities = ({
  userQuery,
}: YourFunctionalCommunitiesSectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { isVerifiedGovEmployee, employeeProfile } = getFragment(
    YourFunctionalCommunitiesUser_Fragment,
    userQuery,
  );
  const { pathname } = useLocation();

  const { communityInterests } = employeeProfile ?? {};

  return (
    <Card space="lg">
      <Heading
        level="h2"
        icon={isVerifiedGovEmployee ? UserGroupIcon : LockClosedIcon}
        {...(isVerifiedGovEmployee && { color: "primary" })}
        className="mt-0 font-normal sm:text-left"
      >
        {intl.formatMessage({
          defaultMessage: "Your functional communities",
          id: "41VJap",
          description:
            "Title of the functional communities section in the employee profile",
        })}
      </Heading>
      <p className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "Functional communities are organizations that help facilitate recruitment and talent management for a classification or area of work. By joining a functional community, your profile is made available to recruiters and talent coordinators so that they can consider you for possible job and training opportunities.",
          id: "bQIWex",
          description:
            "Lead-in text explaining the user profile functional communities section",
        })}
      </p>
      <Link
        mode="placeholder"
        icon={PlusCircleIcon}
        block
        className="mb-6"
        href={paths.createCommunityInterest({
          from: pathname,
        })}
      >
        {intl.formatMessage({
          defaultMessage: "Join a community",
          id: "yD13EC",
          description: "Button to join a community",
        })}
      </Link>
      {communityInterests?.length ? (
        // must exactly reverse the card padding, except for the top
        <div className="-mx-6 -mb-6 sm:-mx-9 sm:-mb-9">
          <FunctionalCommunityCard.Root>
            {communityInterests.map((communityInterest) => (
              <FunctionalCommunityCard.Item
                key={communityInterest.id}
                functionalCommunityListItemQuery={communityInterest}
                headingAs="h4"
                edit={
                  <Link
                    href={paths.updateCommunityInterest(communityInterest.id, {
                      from: pathname,
                    })}
                  >
                    {intl.formatMessage(formMessages.editDetails)}
                    <span className="sr-only">
                      {" "}
                      {communityInterest.community.name?.localized}
                    </span>
                  </Link>
                }
              />
            ))}
          </FunctionalCommunityCard.Root>
        </div>
      ) : (
        <Notice.Root className="text-center">
          <Notice.Title>
            {intl.formatMessage({
              defaultMessage:
                "You haven't opted into any functional communities.",
              id: "rrqAZ6",
              description:
                "Title for notice when there are no functional communities a user is a part of",
            })}
          </Notice.Title>
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  'Communities might be suggested based on your career experience. You can also add functional communities using the "Add a community" link.',
                id: "ldgukM",
                description:
                  "Body for notice when there are no functional communities a user is a part of",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
    </Card>
  );
};

export default YourFunctionalCommunities;
