import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import StarIcon from "@heroicons/react/24/outline/StarIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import { Fragment } from "react/jsx-runtime";

import {
  Card,
  CardSeparator,
  Heading,
  Link,
  Notice,
  PreviewList,
  type IconType,
} from "@gc-digital-talent/ui";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { groupBy } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import type { ExperienceType } from "~/types/experience";
import experienceMessages from "~/messages/experienceMessages";
import useRoutes from "~/hooks/useRoutes";
import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  type SimpleAnyExperience,
} from "~/utils/experienceUtils";

import AwardPreviewListItem from "./AwardPreviewListItem";
import CommunityPreviewListItem from "./CommunityPreviewListItem";
import EducationPreviewListItem from "./EducationPreviewListItem";
import PersonalPreviewListItem from "./PersonalPreviewListItem";
import WorkPreviewListItem from "./WorkPreviewListItem";

export const ProfileExperienceCard_Fragment = graphql(/* GraphQL */ `
  fragment ProfileExperienceCard on Experience {
    id
    ... on AwardExperience {
      issuedBy
      ...AwardExperienceItem
    }
    ... on PersonalExperience {
      organization
      ...PersonalExperienceItem
    }
    ... on CommunityExperience {
      organization
      ...CommunityExperienceItem
    }
    ... on EducationExperience {
      institution
      ...EducationExperienceItem
    }
    ... on WorkExperience {
      organization
      ...WorkExperienceItem
    }
  }
`);

type ExperienceTypeOrTimeline = ExperienceType | "timeline";

interface TypeDetails {
  title: string;
  description: string;
  href: string;
  linkText: string;
  Icon: IconType;
  nullText: string;
  filterFunction: (e: SimpleAnyExperience) => boolean;
}

interface ProfileExperienceCardProps {
  type: ExperienceTypeOrTimeline;
  experiencesQuery?: FragmentType<typeof ProfileExperienceCard_Fragment>[];
}

const ProfileExperienceCard = ({
  type,
  experiencesQuery,
}: ProfileExperienceCardProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const experiences = getFragment(
    ProfileExperienceCard_Fragment,
    experiencesQuery,
  );

  const typeData: Record<ExperienceTypeOrTimeline, TypeDetails> = {
    ["award"]: {
      title: intl.formatMessage(experienceMessages.award),
      description: intl.formatMessage(experienceMessages.awardDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addAward),
      Icon: StarIcon,
      nullText: intl.formatMessage(experienceMessages.nullAward),
      filterFunction: isAwardExperience,
    },
    ["community"]: {
      title: intl.formatMessage(experienceMessages.community),
      description: intl.formatMessage(experienceMessages.communityDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addCommunity),
      Icon: UserGroupIcon,
      nullText: intl.formatMessage(experienceMessages.nullCommunity),
      filterFunction: isCommunityExperience,
    },
    ["education"]: {
      title: intl.formatMessage(experienceMessages.education),
      description: intl.formatMessage(experienceMessages.educationDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addEducation),
      Icon: BookmarkSquareIcon,
      nullText: intl.formatMessage(experienceMessages.nullEducation),
      filterFunction: isEducationExperience,
    },
    ["personal"]: {
      title: intl.formatMessage(experienceMessages.personal),
      description: intl.formatMessage(experienceMessages.personalDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addPersonal),
      Icon: LightBulbIcon,
      nullText: intl.formatMessage(experienceMessages.nullPersonal),
      filterFunction: isPersonalExperience,
    },
    ["work"]: {
      title: intl.formatMessage(experienceMessages.work),
      description: intl.formatMessage(experienceMessages.workDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addWork),
      Icon: BriefcaseIcon,
      nullText: intl.formatMessage(experienceMessages.nullWork),
      filterFunction: isWorkExperience,
    },
    ["timeline"]: {
      title: intl.formatMessage(experienceMessages.timeline),
      description: intl.formatMessage(experienceMessages.timelineDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addExperience),
      Icon: MapIcon,
      nullText: intl.formatMessage(experienceMessages.nullTimeline),
      filterFunction: () => true,
    },
  };
  const { title, description, href, linkText, Icon, nullText, filterFunction } =
    typeData[type];

  const filteredExperiences = experiences?.filter(filterFunction) ?? [];
  const groupedExperiences = groupBy(filteredExperiences, (exp) => {
    if (isAwardExperience(exp)) {
      return exp.issuedBy ?? intl.formatMessage(commonMessages.notAvailable);
    }
    if (isCommunityExperience(exp)) {
      return (
        exp.organization ?? intl.formatMessage(commonMessages.notAvailable)
      );
    }
    if (isEducationExperience(exp)) {
      return exp.institution ?? intl.formatMessage(commonMessages.notAvailable);
    }
    if (isPersonalExperience(exp)) {
      return (
        exp.organization ?? intl.formatMessage(commonMessages.notAvailable)
      );
    }
    if (isWorkExperience(exp)) {
      return (
        exp.organization ?? intl.formatMessage(commonMessages.notAvailable)
      );
    }

    // This should be impossible
    return intl.formatMessage(commonMessages.notAvailable);
  });

  return (
    <Card space="md" className="relative">
      <div className="absolute top-0 right-0 h-12.5 w-12.5 bg-gray-100 drop-shadow-[1rem_-10px_5px_var(--gcdt-color-gray-100)] lg:h-13.75 lg:w-13.75 dark:bg-gray-700 dark:drop-shadow-[1rem_-10px_5px_var(--gcdt-color-gray-700)]">
        <div
          id="corner-shape"
          className="absolute top-0 right-0 h-full w-full bg-white [clip-path:polygon(25%_12.5%,25%_12.5%,24.836%_10.472%,24.363%_8.549%,23.605%_6.756%,22.588%_5.118%,21.339%_3.661%,19.882%_2.412%,18.244%_1.395%,16.451%_0.637%,14.528%_0.164%,12.5%_0%,0%_0%,0%_100%,50%_100%,100%_100%,100%_87.5%,100%_87.5%,99.836%_85.472%,99.363%_83.549%,98.605%_81.756%,97.588%_80.118%,96.339%_78.661%,94.882%_77.412%,93.244%_76.395%,91.451%_75.637%,89.528%_75.164%,87.5%_75%,66.667%_75%,66.667%_75%,59.908%_74.455%,53.497%_72.876%,47.518%_70.349%,42.059%_66.961%,37.204%_62.796%,33.039%_57.941%,29.651%_52.482%,27.124%_46.503%,25.545%_40.092%,25%_33.333%,25%_12.5%)] dark:bg-gray-600"
        ></div>
        <div className="absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md dark:bg-gray-600">
          <Icon
            aria-hidden="true"
            focusable="false"
            className="absolute top-[0.2.5em] right-[0.2.5rem] h-6 w-6 text-secondary-600 dark:text-secondary"
          />
        </div>
      </div>
      <Heading rank="h3" size="h5" className="mt-0 font-bold">
        {title}
      </Heading>
      <p className="mb-4.5 text-gray-600 dark:text-gray-100">{description}</p>
      <Link href={href} icon={PlusCircleIcon} className="font-bold">
        {linkText}
      </Link>
      {Object.keys(groupedExperiences).length > 0 ? (
        Object.keys(groupedExperiences).map((organization) => (
          <Fragment key={organization}>
            <CardSeparator space="sm" />
            <p className="mb-6 font-bold">{organization}</p>
            <PreviewList.Root>
              {groupedExperiences[organization].map((experience, i) => (
                <>
                  {isAwardExperience(experience) && (
                    <AwardPreviewListItem
                      experienceQuery={experience}
                      index={i}
                      listLength={groupedExperiences[organization].length}
                    />
                  )}
                  {isCommunityExperience(experience) && (
                    <CommunityPreviewListItem
                      experienceQuery={experience}
                      index={i}
                      listLength={groupedExperiences[organization].length}
                    />
                  )}
                  {isEducationExperience(experience) && (
                    <EducationPreviewListItem
                      experienceQuery={experience}
                      index={i}
                      listLength={groupedExperiences[organization].length}
                    />
                  )}
                  {isPersonalExperience(experience) && (
                    <PersonalPreviewListItem
                      experienceQuery={experience}
                      index={i}
                      listLength={groupedExperiences[organization].length}
                    />
                  )}
                  {isWorkExperience(experience) && (
                    <WorkPreviewListItem
                      experienceQuery={experience}
                      index={i}
                      listLength={groupedExperiences[organization].length}
                    />
                  )}
                </>
              ))}
            </PreviewList.Root>
          </Fragment>
        ))
      ) : (
        <>
          <CardSeparator space="sm" />
          <Notice.Root>
            <Notice.Content>
              <p className="text-center">{nullText}</p>
            </Notice.Content>
          </Notice.Root>
        </>
      )}
    </Card>
  );
};
export default ProfileExperienceCard;
