import { useIntl } from "react-intl";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";

import { Heading, Well } from "@gc-digital-talent/ui";
import {
  FragmentType,
  getFragment,
  graphql,
  Maybe,
  Pool,
} from "@gc-digital-talent/graphql";

import Display from "./Display";
import { getSectionTitle } from "../../utils";

const ProfileGovernmentInformation_Fragment = graphql(/** GraphQL */ `
  fragment ProfileGovernmentInformation on User {
    ...GovernmentInformationDisplay
  }
`);

interface GovernmentInformationProps {
  query: FragmentType<typeof ProfileGovernmentInformation_Fragment>;
  pool?: Maybe<Pool>;
}

const GovernmentInformation = ({ query, pool }: GovernmentInformationProps) => {
  const user = getFragment(ProfileGovernmentInformation_Fragment, query);
  const intl = useIntl();

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-6 xs:flex-row xs:items-center">
        <Heading
          icon={ExclamationCircleIcon}
          color="warning"
          level={pool ? "h3" : "h2"}
          size={pool ? "h4" : "h3"}
          className="mt-0 mb-6"
        >
          {intl.formatMessage(getSectionTitle("government"))}
        </Heading>
      </div>
      <div className="rounded-md bg-white p-6 text-black shadow-lg dark:bg-gray-600 dark:text-white">
        <Well color="warning">
          <p className="mb-3 font-bold">
            {intl.formatMessage({
              defaultMessage: "This information is going away",
              id: "Ui7CNt",
              description:
                "Title warning message for government information getting removed",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You can now add Government of Canada employment details directly on your career experience. We will keep the details here on your file until you add new ones on your current work experience.",
              id: "dvil3O",
              description:
                "Description for warning message when the government information section is getting removed.",
            })}
          </p>
        </Well>
        <div className="mt-6 flex flex-col gap-y-6">
          <Display query={user} />
        </div>
      </div>
    </>
  );
};

export default GovernmentInformation;
