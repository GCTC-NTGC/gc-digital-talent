import { useIntl } from "react-intl";

import {
  CandidateRemovalReason,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import applicationMessages from "~/messages/applicationMessages";

const RemovedStatusMeta_Fragment = graphql(/** GraphQL */ `
  fragment RemovedStatusMeta on PoolCandidate {
    removalReasonOther
    removalReason {
      value
      label {
        localized
      }
    }
  }
`);

interface RemovedStatusMetaProps {
  query: FragmentType<typeof RemovedStatusMeta_Fragment>;
}

const RemovedStatusMeta = ({ query }: RemovedStatusMetaProps) => {
  const intl = useIntl();
  const application = getFragment(RemovedStatusMeta_Fragment, query);

  let reason = application.removalReason?.label.localized;
  if (application.removalReason?.value === CandidateRemovalReason.Other) {
    reason = application.removalReasonOther;
  }

  return (
    <FieldDisplay label={intl.formatMessage(applicationMessages.reason)}>
      <span className="text-gray-600 dark:text-gray-200">
        {reason ?? intl.formatMessage(commonMessages.notAvailable)}
      </span>
    </FieldDisplay>
  );
};

export default RemovedStatusMeta;
