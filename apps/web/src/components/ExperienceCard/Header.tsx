import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import StarIcon from "@heroicons/react/24/outline/StarIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";

import { Card, Heading, IconType, Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { ExperienceType } from "~/types/experience";
import experienceMessages from "~/messages/experienceMessages";

interface ExperienceDetailsType {
  title: string;
  description: string;
  href: string;
  linkText: string;
  Icon: IconType;
}

interface HeaderProps {
  experienceType: ExperienceType;
}

const Header = ({ experienceType }: HeaderProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const experience: Record<ExperienceType, ExperienceDetailsType> = {
    ["award"]: {
      title: intl.formatMessage(experienceMessages.award),
      description: intl.formatMessage(experienceMessages.awardDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addAward),
      Icon: StarIcon,
    },
    ["community"]: {
      title: intl.formatMessage(experienceMessages.community),
      description: intl.formatMessage(experienceMessages.communityDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addCommunity),
      Icon: UserGroupIcon,
    },
    ["education"]: {
      title: intl.formatMessage(experienceMessages.education),
      description: intl.formatMessage(experienceMessages.educationDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addEducation),
      Icon: BookmarkSquareIcon,
    },
    ["personal"]: {
      title: intl.formatMessage(experienceMessages.personal),
      description: intl.formatMessage(experienceMessages.personalDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addPersonal),
      Icon: LightBulbIcon,
    },
    ["work"]: {
      title: intl.formatMessage(experienceMessages.work),
      description: intl.formatMessage(experienceMessages.workDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addWork),
      Icon: BriefcaseIcon,
    },
  };

  const Icon = experience[experienceType].Icon;

  return (
    <Card space="md" className="relative">
      <div className="absolute top-0 right-0 h-[50px] w-[50px] bg-gray-100 drop-shadow-[1rem_-10px_5px_var(--gcdt-color-gray-100)] lg:h-[55px] lg:w-[55px] dark:bg-gray-700 dark:drop-shadow-[1rem_-10px_5px_var(--gcdt-color-gray-700)]">
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
      <Heading level="h3" size="h5" className="mt-0 font-bold">
        {experience[experienceType].title}
      </Heading>
      <p className="mb-4.5 text-gray-600 dark:text-gray-100">
        {experience[experienceType].description}
      </p>
      <Link
        href={experience[experienceType].href}
        icon={PlusCircleIcon}
        className="font-bold"
      >
        {experience[experienceType].linkText}
      </Link>
    </Card>
  );
};

export default Header;
