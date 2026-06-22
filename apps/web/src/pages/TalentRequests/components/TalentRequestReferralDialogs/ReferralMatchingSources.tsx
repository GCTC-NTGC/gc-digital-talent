import { useIntl } from "react-intl";

import {
  type FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Link, Ul } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import useRoutes from "~/hooks/useRoutes";

export const ReferralMatchingPoolSource_Fragment = graphql(/* GraphQL */ `
  fragment ReferralMatchingPoolSource on PoolCandidate {
    id
    pool {
      displayName {
        display {
          localized
        }
      }
    }
  }
`);

interface ReferralMatchingSourcesProps {
  sourceLabels: string[];
  matchingPoolSources?:
    | FragmentType<typeof ReferralMatchingPoolSource_Fragment>[]
    | null;
}

const ReferralMatchingSources = ({
  sourceLabels,
  matchingPoolSources,
}: ReferralMatchingSourcesProps) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const paths = useRoutes();
  const applications = unpackMaybes(
    matchingPoolSources?.map((q) =>
      getFragment(ReferralMatchingPoolSource_Fragment, q),
    ),
  );

  if (!sourceLabels.length && !applications.length) return null;

  return (
    <>
      <FieldDisplay
        className="mb-6"
        label={intl.formatMessage({
          defaultMessage: "Source of talent",
          id: "6eQF40",
          description: "Heading for the source of the matching user",
        })}
      >
        {sourceLabels.length > 0 ? (
          <Ul>
            {sourceLabels.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </Ul>
        ) : (
          notAvailable
        )}
      </FieldDisplay>
      {applications.length > 0 && (
        <>
          <FieldDisplay
            className="mb-6"
            label={intl.formatMessage({
              defaultMessage: "Qualified processes",
              id: "IfVx4x",
              description:
                "Label for the list of pools a user has qualified in",
            })}
          >
            {sourceLabels.length > 0 ? (
              <Ul>
                {applications.map((application) => (
                  <li key={application.id}>
                    <Link
                      href={paths.poolCandidateApplication(application.id)}
                      newTab
                    >
                      {application.pool.displayName?.display?.localized}
                    </Link>
                  </li>
                ))}
              </Ul>
            ) : (
              notAvailable
            )}
          </FieldDisplay>
        </>
      )}
    </>
  );
};

export default ReferralMatchingSources;
