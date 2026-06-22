import { useIntl } from "react-intl";

import {
  type FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Ul } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

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
  const pools = unpackMaybes(
    matchingPoolSources?.map((q) =>
      getFragment(ReferralMatchingPoolSource_Fragment, q),
    ),
  );

  if (!sourceLabels.length && !pools.length) return null;

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
      {pools.length > 0 && (
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
                {pools.map((pool) => (
                  <li key={pool.id}>
                    {pool.pool.displayName?.display?.localized}
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
