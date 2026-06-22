import { useIntl } from "react-intl";

import {
  type FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Notice, Separator, Ul } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

export const ReferralHistory_Fragment = graphql(/* GraphQL */ `
  fragment ReferralHistory on TalentRequestReferralSummary {
    referredCount
    notSelectedReasons {
      reason {
        value
        label {
          localized
        }
      }
      count
    }
  }
`);

interface ReferralHistoryProps {
  query?: FragmentType<typeof ReferralHistory_Fragment> | null;
}

const ReferralHistory = ({ query }: ReferralHistoryProps) => {
  const intl = useIntl();
  const summary = getFragment(ReferralHistory_Fragment, query);

  if (!summary) return null;

  const { referredCount, notSelectedReasons } = summary;
  const reasons = unpackMaybes(
    unpackMaybes(notSelectedReasons).map(({ reason, count }) =>
      reason ? { reason, count } : null,
    ),
  );

  return (
    <>
      <FieldDisplay
        label={intl.formatMessage({
          defaultMessage: "Referral history",
          id: "gmuCxv",
          description:
            "Heading for a user's referral history section in the referral dialog",
        })}
      >
        {referredCount === 0 ? (
          <Notice.Root className="mt-3">
            <Notice.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage: "This candidate has not been referred yet.",
                  id: "RDr0HX",
                  description:
                    "Message shown when a user has no referral history",
                })}
              </p>
            </Notice.Content>
          </Notice.Root>
        ) : (
          <>
            <p className="mb-3">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "{count, plural, one {This candidate has been referred # time.} other {This candidate has been referred # times.}}",
                  id: "rXoCy5",
                  description:
                    "Count of how many times a user has been referred across all talent requests",
                },
                { count: referredCount },
              )}
            </p>
            {reasons.length > 0 && (
              <>
                <p className="mb-3">
                  {intl.formatMessage({
                    defaultMessage:
                      "Reasons why this candidate was not selected",
                    id: "D135F4",
                    description:
                      "Lead-in for the list of not-selected reasons in referral history",
                  })}
                  {intl.formatMessage(commonMessages.dividingColon)}
                </p>
                <Ul>
                  {reasons.map((r) => (
                    <li key={r.reason.value}>
                      {r.reason.label.localized ??
                        intl.formatMessage(commonMessages.notAvailable)}
                      {/* eslint-disable formatjs/no-literal-string-in-jsx -- NOTE: space and parentheses wrap a numeric count; structural punctuation, not translatable text */}{" "}
                      ({r.count})
                      {/* eslint-enable formatjs/no-literal-string-in-jsx */}
                    </li>
                  ))}
                </Ul>
              </>
            )}
          </>
        )}
      </FieldDisplay>
      <Separator space="sm" />
    </>
  );
};

export default ReferralHistory;
