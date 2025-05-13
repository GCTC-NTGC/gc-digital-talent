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
import { isWorkExperience } from "~/utils/experienceUtils";

export const CurrentPositionExperiences_Fragment = graphql(/* GraphQL */ `
  fragment CurrentPositionExperiences on User {
    updatedDate
    experiences {
      id
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

  const experiences = unpackMaybes(data?.experiences);

  const workExperiences = experiences.filter((experience) =>
    isWorkExperience(experience),
  );

  const currentWorkExperiences = workExperiences.filter((exp) =>
    isCurrentExperience(exp.endDate),
  );
  const sorted = currentWorkExperiences.sort((a, b) => {
    const aStart = a?.startDate ? new Date(a.startDate) : MAX_DATE;
    const bStart = b?.startDate ? new Date(b.startDate) : MAX_DATE;
    return bStart.getTime() - aStart.getTime(); // more recent start sorted higher
  });

  return (
    <>
      <Heading
        Icon={FlagIcon}
        level="h2"
        color="primary"
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
            {sorted.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} showEdit={false} />
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
