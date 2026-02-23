import { useIntl } from "react-intl";

import {
  ApplicationStatus,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import applicationMessages from "~/messages/applicationMessages";

const DisqualifiedStatusMeta_Fragment = graphql(/** GraphQL */ `
  fragment DisqualifiedStatusMeta on PoolCandidate {
    status {
      value
    }
    disqualificationReason {
      label {
        localized
      }
    }
  }
`);

interface DisqualifiedStatusMetaProps {
  query: FragmentType<typeof DisqualifiedStatusMeta_Fragment>;
}

const DisqualifiedStatusMeta = ({ query }: DisqualifiedStatusMetaProps) => {
  const intl = useIntl();
  const application = getFragment(DisqualifiedStatusMeta_Fragment, query);

  if (application.status?.value !== ApplicationStatus.Disqualified) return null;

  return (
    <FieldDisplay label={intl.formatMessage(applicationMessages.reason)}>
      <span className="text-gray-600 dark:text-gray-200">
        {application.disqualificationReason?.label.localized ??
          intl.formatMessage(commonMessages.notAvailable)}
      </span>
    </FieldDisplay>
  );
};

export default DisqualifiedStatusMeta;
