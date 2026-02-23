import { useIntl } from "react-intl";

import {
  ApplicationStatus,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import ApplicationExpiryDateDialog from "../Dialog/ApplicationExpiryDateDialog";

const QualifiedStatusMeta_Fragment = graphql(/** GraphQL */ `
  fragment QualifiedStatusMeta on PoolCandidate {
    status {
      value
    }

    ...ApplicationExpiryDateDialog
  }
`);

interface QualifiedStatusMetaProps {
  query: FragmentType<typeof QualifiedStatusMeta_Fragment>;
}

const QualifiedStatusMeta = ({ query }: QualifiedStatusMetaProps) => {
  const intl = useIntl();
  const application = getFragment(QualifiedStatusMeta_Fragment, query);
  if (application.status?.value !== ApplicationStatus.Qualified) return null;

  return (
    <FieldDisplay label={intl.formatMessage(commonMessages.expiryDate)}>
      <ApplicationExpiryDateDialog query={application} />
    </FieldDisplay>
  );
};

export default QualifiedStatusMeta;
