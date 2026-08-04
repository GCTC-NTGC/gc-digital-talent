import ChartBarSquareIcon from "@heroicons/react/24/outline/ChartBarSquareIcon";
import LockClosedIcon from "@heroicons/react/24/outline/LockClosedIcon";
import { useIntl } from "react-intl";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { Heading } from "@gc-digital-talent/ui";

const YourFunctionalCommunitiesUser_Fragment = graphql(/** GraphQL */ `
  fragment YourFunctionalCommunitiesUser on User {
    isVerifiedGovEmployee
  }
`);

const YourFunctionalCommunitiesOptions_Fragment = graphql(/** GraphQL */ `
  fragment YourFunctionalCommunitiesOptions on Query {
    __typename
  }
`);

interface YourFunctionalCommunitiesSectionProps {
  userQuery: FragmentType<typeof YourFunctionalCommunitiesUser_Fragment>;
  optionsQuery: FragmentType<typeof YourFunctionalCommunitiesOptions_Fragment>;
}

const YourFunctionalCommunities = ({
  userQuery,
  optionsQuery,
}: YourFunctionalCommunitiesSectionProps) => {
  const intl = useIntl();
  const user = getFragment(YourFunctionalCommunitiesUser_Fragment, userQuery);
  const options = getFragment(
    YourFunctionalCommunitiesOptions_Fragment,
    optionsQuery,
  );
  return (
    <>
      <Heading
        level="h2"
        icon={user.isVerifiedGovEmployee ? ChartBarSquareIcon : LockClosedIcon}
        {...(user.isVerifiedGovEmployee && { color: "primary" })}
        className="mt-0 font-normal sm:text-left"
      >
        {intl.formatMessage({
          defaultMessage: "Your functional communities",
          id: "41VJap",
          description:
            "Title of the functional communities section in the employee profile",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "We'd like to learn more about the career path you'd like to follow. Providing information about preferences and aspirations will help talent managers make more informed decisions when you've been nominated for a promotion, lateral movement, or professional development opportunity.",
          id: "6KS1jD",
          description: "Lead-in text explaining the users career plan",
        })}
      </p>
    </>
  );
};

export default YourFunctionalCommunities;
