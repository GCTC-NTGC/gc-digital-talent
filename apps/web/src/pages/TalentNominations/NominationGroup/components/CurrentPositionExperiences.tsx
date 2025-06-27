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
import { CardSeparator, Heading, Ul, Well } from "@gc-digital-talent/ui";
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
        className="m-9 mb-0 font-normal"
      >
        {intl.formatMessage({
          defaultMessage: "Current position",
          id: "elMgS2",
          description: "Heading for current position",
        })}
      </Heading>
      <p className="mt-3 mb-6">
        {intl.formatMessage({
          defaultMessage:
            "This section shows the candidate's current role. If it's an acting role, the candidate's substantive role will also appear here if they've provided it. Select individual experiences to see more details.",
          id: "R1QSIY",
          description: "Description for the career page current role section",
        })}
      </p>
      {shareProfile && <CardSeparator className="mb-6" space="none" />}

      {shareProfile && !empty(data) && (
        <div>
          <div className="flex flex-col gap-y-3">
            {sorted.length === 0 && (
              <Well className="mb-10.5" color="error">
                <p className="font-bold">
                  {intl.formatMessage({
                    defaultMessage: "No current government experience found",
                    id: "k/V+39",
                    description:
                      "Message displayed when there is no government experience for the current position",
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "The nominee’s profile doesn’t show a current Government of Canada position.",
                    id: "eg8/kP",
                    description:
                      "Description for the message displayed when there is no government experience for the current position",
                  })}
                  <p className="my-3">
                    {intl.formatMessage({
                      defaultMessage:
                        "Contact the nominator or submitter so they can follow up with the nominee:",
                      id: "4Ect9u",
                      description:
                        "Instruction to contact nominator or submitter for follow up",
                    })}
                  </p>
                  <Ul>
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
                  </Ul>
                </p>
              </Well>
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
        <Well className="mb-9" color="error">
          <p className="mb-6 font-bold">
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
      {shareProfile && <CardSeparator space="sm" />}
      {shareProfile && (
        <p className="text-gray-600 dark:text-gray-200">
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
