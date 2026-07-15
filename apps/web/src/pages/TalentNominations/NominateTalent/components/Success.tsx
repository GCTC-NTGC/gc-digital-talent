import { useIntl } from "react-intl";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import type { ReactNode } from "react";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { Card, Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

import useCurrentStep from "../useCurrentStep";
import SubHeading from "./SubHeading";

const NominateTalentSuccess_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentSuccess on TalentNomination {
    submittedAt
    nominee {
      firstName
    }
    talentNominationEvent {
      community {
        name {
          localized
        }
      }
      contactEmail
    }
  }
`);

interface SuccessProps {
  successQuery: FragmentType<typeof NominateTalentSuccess_Fragment>;
}

const Success = ({ successQuery }: SuccessProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { current } = useCurrentStep();
  const talentNomination = getFragment(
    NominateTalentSuccess_Fragment,
    successQuery,
  );

  if (current || !talentNomination.submittedAt) {
    return null;
  }

  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  return (
    <Card>
      <SubHeading color="success" icon={CheckCircleIcon}>
        {intl.formatMessage({
          defaultMessage: "We’ve received your nomination",
          id: "I7vSfX",
          description: "Heading for success step of a talent nomination",
        })}
      </SubHeading>
      <p className="my-6">
        {intl.formatMessage(
          {
            defaultMessage:
              "Thank you for nominating {name}! The talent management team with the {community} will review your submission soon. In the meantime, you can review your submission and its status from your dashboard.",
            id: "wdFBSc",
            description:
              "First paragraph on success step of a talent nomination",
          },

          {
            name: talentNomination.nominee?.firstName ?? notAvailable,
            community:
              talentNomination.talentNominationEvent.community.name
                ?.localized ?? notAvailable,
          },
        )}
      </p>
      {talentNomination.talentNominationEvent.contactEmail ? (
        <p className="my-6">
          {intl.formatMessage(
            {
              defaultMessage:
                "If you have any questions or need to amend your nomination, please <link>reach out to the community event team</link> and they will provide next steps.",
              id: "FlTPg2",
              description:
                "Instructions to contact support after nomination submission",
            },
            {
              link: (chunks: ReactNode) => (
                <Link
                  href={`mailto:${talentNomination.talentNominationEvent.contactEmail}`}
                  color="black"
                >
                  {chunks}
                </Link>
              ),
            },
          )}
        </p>
      ) : null}
      <p className="mt-6">
        <Link href={paths.applicantDashboard()} mode="solid" color="primary">
          {intl.formatMessage(navigationMessages.returnToDashboard)}
        </Link>
      </p>
    </Card>
  );
};

export default Success;
