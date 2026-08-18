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
import talentRequestMessages from "~/messages/talentRequestMessages";

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

export const ReferralMatchingAdvancementSource_Fragment = graphql(
  /* GraphQL */ `
    fragment ReferralMatchingAdvancementSource on TalentNominationGroup {
      id
      talentNominationEvent {
        id
        name {
          localized
        }
      }
    }
  `,
);

interface ReferralMatchingSourcesProps {
  sourceLabels: string[];
  matchingPoolSources?:
    | FragmentType<typeof ReferralMatchingPoolSource_Fragment>[]
    | null;
  matchingAdvancementSources?:
    | FragmentType<typeof ReferralMatchingAdvancementSource_Fragment>[]
    | null;
}

const ReferralMatchingSources = ({
  sourceLabels,
  matchingPoolSources,
  matchingAdvancementSources,
}: ReferralMatchingSourcesProps) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const paths = useRoutes();
  const applications = unpackMaybes(
    getFragment(ReferralMatchingPoolSource_Fragment, matchingPoolSources),
  );
  const advancementGroups = unpackMaybes(
    getFragment(
      ReferralMatchingAdvancementSource_Fragment,
      matchingAdvancementSources,
    ),
  );

  if (!sourceLabels.length && !applications.length && !advancementGroups.length)
    return null;

  return (
    <>
      <FieldDisplay
        className="mb-6"
        label={intl.formatMessage(talentRequestMessages.sourceOfTalent)}
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
      {advancementGroups.length > 0 && (
        <FieldDisplay
          className="mb-6"
          label={intl.formatMessage({
            defaultMessage: "Talent management events",
            id: "qutSCs",
            description:
              "Label for the list of advancement nominations a user has been approved for",
          })}
        >
          <Ul>
            {advancementGroups.map((group) => (
              <li key={group.id}>
                <Link
                  href={paths.talentNominationGroup(
                    group.talentNominationEvent.id,
                    group.id,
                  )}
                  newTab
                >
                  {group.talentNominationEvent.name.localized}
                </Link>
              </li>
            ))}
          </Ul>
        </FieldDisplay>
      )}
    </>
  );
};

export default ReferralMatchingSources;
