import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { empty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  currentDate,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { MAX_DATE } from "@gc-digital-talent/date-helpers/const";
import { Heading, Separator, Well } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import { isGovWorkExperience } from "~/utils/experienceUtils";

export const CurrentPositionExperiences_Fragment = graphql(/* GraphQL */ `
  fragment CurrentPositionExperiences on User {
    updatedDate
    experiences {
      id
      ... on WorkExperience {
        startDate
        endDate
      }
      ...ExperienceCard
    }
  }
`);

const isCurrentExperience = (endDate?: string | null): boolean => {
  if (!endDate) {
    return true;
  }

  const currentDateString = currentDate();
  if (endDate > currentDateString) {
    return true;
  }

  return false;
};

interface CurrentPositionExperiencesProps {
  query:
    | FragmentType<typeof CurrentPositionExperiences_Fragment>
    | null
    | undefined;
  shareProfile?: boolean;
}

const CurrentPositionExperiences = ({
  query,
  shareProfile,
}: CurrentPositionExperiencesProps) => {
  const intl = useIntl();
  const data = getFragment(CurrentPositionExperiences_Fragment, query);

  const lastUpdated = data?.updatedDate
    ? formatDate({
        date: parseDateTimeUtc(data.updatedDate),
        formatString: "MMMM d, yyyy",
        intl,
      })
    : intl.formatMessage(commonMessages.notProvided);

  const NullMessage = intl.formatMessage({
    defaultMessage: "No current government experience found",
    id: "k/V+39",
    description:
      "Message displayed when there is no government experience for the current position",
  });
  const NullMessageDescription = intl.formatMessage({
    defaultMessage:
      "The nominee’s profile doesn’t show a current Government of Canada position.",
    id: "eg8/kP",
    description:
      "Description for the message displayed when there is no government experience for the current position",
  });
  const NullMessageDetails = (
    <>
      <p data-h2-margin="base(x.5 0)">
        {intl.formatMessage({
          defaultMessage:
            "Contact the nominator or submitter so they can follow up with the nominee:",
          id: "4Ect9u",
          description:
            "Instruction to contact nominator or submitter for follow up",
        })}
      </p>
      <ul style={{ listStyleType: "disc", marginLeft: "1.5em" }}>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "If the nominee is still a Government of Canada employee, they’ll need to update their career experience on the platform.",
            id: "e0M7vj",
            description:
              "Instruction if nominee is still a Government of Canada employee",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "If the nominee is no longer an employee, this nomination should be marked as “Not supported”.",
            id: "0P591/",
            description:
              "Instruction if nominee is no longer a Government of Canada employee",
          })}
        </li>
      </ul>
    </>
  );

  const currentWorkExperiences = unpackMaybes(data?.experiences).filter(
    (exp) => isGovWorkExperience(exp) && isCurrentExperience(exp?.endDate),
  );

  const sorted = currentWorkExperiences.sort((a, b) => {
    const aStart =
      "startDate" in a && a.startDate ? new Date(a.startDate) : MAX_DATE;
    const bStart =
      "startDate" in b && b.startDate ? new Date(b.startDate) : MAX_DATE;
    return bStart.getTime() - aStart.getTime(); // more recent start sorted higher
  });

  return (
    <>
      <Heading
        icon={FlagIcon}
        level="h2"
        color="secondary"
        data-h2-margin="base(x1.5 x1.5 0 x1.5)"
        data-h2-font-weight="base(400)"
      >
        {intl.formatMessage({
          defaultMessage: "Current position",
          id: "elMgS2",
          description: "Heading for current position",
        })}
      </Heading>
      <p data-h2-margin="base(x.5 x1.5 x1 x1.5)">
        {intl.formatMessage({
          defaultMessage:
            "This section shows the candidate's current role. If it's an acting role, the candidate's substantive role will also appear here if they've provided it. Select individual experiences to see more details.",
          id: "R1QSIY",
          description: "Description for the career page current role section",
        })}
      </p>
      {shareProfile && (
        <Separator data-h2-margin="base(0 0 x1 0)" space="none" />
      )}
      {shareProfile && !empty(data) && (
        <div data-h2-margin="base(0 x1.5)">
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x.5 0)"
          >
            {sorted.length === 0 && (
              <>
                <p
                  data-h2-color="base(black.light)"
                  data-h2-font-weight="base(bold)"
                >
                  {NullMessage}
                </p>
                <p>
                  {NullMessageDescription}
                  {NullMessageDetails}
                </p>
              </>
            )}
            {sorted.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experienceQuery={exp}
                showEdit={false}
              />
            ))}
          </div>
        </div>
      )}
      {!shareProfile && (
        <Well data-h2-margin="base(0 x1.5 x1.75 x1.5)" color="error">
          <p data-h2-margin-bottom="base(x1)" data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage:
                "This nominee has not agreed to share their information with your community",
              id: "4ujr5X",
              description: "Null message for nominee profile",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Nominees can agree to provide access to their profile using the “Functional communities” tool on their dashboard.",
              id: "8plD42",
              description: "Null secondary message for nominee profile",
            })}
          </p>
        </Well>
      )}
      {shareProfile && <Separator data-h2-margin="base(x1 0)" space="none" />}
      {shareProfile && (
        <p
          data-h2-color="base(black.light)"
          data-h2-margin="base(0 x1.5 x1.75 x1.5)"
        >
          {intl.formatMessage(
            {
              defaultMessage:
                "Nominee's profile was last updated on: {lastUpdated}",
              id: "guYbEb",
              description: "Last time user's profile was updated",
            },
            { lastUpdated },
          )}
        </p>
      )}
    </>
  );
};

export default CurrentPositionExperiences;
