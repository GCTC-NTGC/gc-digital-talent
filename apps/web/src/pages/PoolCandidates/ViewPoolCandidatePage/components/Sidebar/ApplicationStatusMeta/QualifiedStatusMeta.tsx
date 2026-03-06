import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Ul } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import ApplicationExpiryDateDialog from "../Dialog/ApplicationExpiryDateDialog";
import ApplicationPlacementDialog from "../Dialog/ApplicationPlacementDialog";

const QualifiedStatusMeta_Fragment = graphql(/** GraphQL */ `
  fragment QualifiedStatusMeta on PoolCandidate {
    placedDepartment {
      name {
        localized
      }
    }

    ...ApplicationPlacementDialog
    ...ApplicationExpiryDateDialog
  }
`);

interface QualifiedStatusMetaProps {
  query: FragmentType<typeof QualifiedStatusMeta_Fragment>;
}

const QualifiedStatusMeta = ({ query }: QualifiedStatusMetaProps) => {
  const intl = useIntl();
  const application = getFragment(QualifiedStatusMeta_Fragment, query);

  return (
    <>
      <FieldDisplay label={intl.formatMessage(commonMessages.jobPlacement)}>
        <ApplicationPlacementDialog query={application} />
        {application.placedDepartment && (
          <Ul space="sm" className="text-gray-600 dark:text-gray-200">
            <li>{application.placedDepartment.name.localized}</li>
          </Ul>
        )}
      </FieldDisplay>
      <FieldDisplay label={intl.formatMessage(commonMessages.expiryDate)}>
        <ApplicationExpiryDateDialog query={application} />
      </FieldDisplay>
    </>
  );
};

export default QualifiedStatusMeta;
