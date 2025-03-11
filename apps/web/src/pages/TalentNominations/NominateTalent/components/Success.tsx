import { useIntl } from "react-intl";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import { ReactNode } from "react";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";

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
    <>
      <SubHeading color="success" Icon={CheckCircleIcon}>
        {intl.formatMessage({
          defaultMessage: "We’ve received your nomination",
          id: "I7vSfX",
          description: "Heading for success step of a talent nomination",
        })}
      </SubHeading>
      <p data-h2-margin="base(x1 0)">
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
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage(
          {
            defaultMessage:
              "If you have any questions or concerns, feel free to <link>reach out to our support team</link>.",
            id: "duXf4a",
            description:
              "Instructions to contact support after nomination submission",
          },
          {
            link: (chunks: ReactNode) => (
              <Link href={paths.support()} color="black">
                {chunks}
              </Link>
            ),
          },
        )}
      </p>
      <p data-h2-margin="base(x1 0)">
        <Link href="" mode="solid" color="secondary">
          {intl.formatMessage({
            defaultMessage: "Return to your dashboard",
            id: "Y66jFM",
            description: "Link text to the dashboard page",
          })}
        </Link>
      </p>
    </>
  );
};

export default Success;
