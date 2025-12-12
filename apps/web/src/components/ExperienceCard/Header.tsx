import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";

import { Card, Heading, Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { ExperienceType } from "~/types/experience";
import experienceMessages from "~/messages/experienceMessages";

interface ExperienceDetailsType {
  title: string;
  description: string;
  href: string;
  linkText: string;
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
    },
    ["community"]: {
      title: intl.formatMessage(experienceMessages.community),
      description: intl.formatMessage(experienceMessages.communityDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addCommunity),
    },
    ["education"]: {
      title: intl.formatMessage(experienceMessages.education),
      description: intl.formatMessage(experienceMessages.educationDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addEducation),
    },
    ["personal"]: {
      title: intl.formatMessage(experienceMessages.personal),
      description: intl.formatMessage(experienceMessages.personalDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addPersonal),
    },
    ["work"]: {
      title: intl.formatMessage(experienceMessages.work),
      description: intl.formatMessage(experienceMessages.workDescription),
      href: paths.createExperience(),
      linkText: intl.formatMessage(experienceMessages.addWork),
    },
  };

  return (
    <Card
      space="md"
      className="relative [box-shadow:_-5px_5px_10px_rgba(0,0,0,0.3)]"
    >
      <div className="absolute top-0 right-0 h-[50px] w-[50px] bg-gray-100">
        <div
          id="corner-shape"
          className="absolute top-0 right-0 h-full w-full bg-white [clip-path:polygon(25%_12.5%,25%_12.5%,24.836%_10.472%,24.363%_8.549%,23.605%_6.756%,22.588%_5.118%,21.339%_3.661%,19.882%_2.412%,18.244%_1.395%,16.451%_0.637%,14.528%_0.164%,12.5%_0%,0%_0%,0%_100%,50%_100%,100%_100%,100%_87.5%,100%_87.5%,99.836%_85.472%,99.363%_83.549%,98.605%_81.756%,97.588%_80.118%,96.339%_78.661%,94.882%_77.412%,93.244%_76.395%,91.451%_75.637%,89.528%_75.164%,87.5%_75%,66.667%_75%,66.667%_75%,59.908%_74.455%,53.497%_72.876%,47.518%_70.349%,42.059%_66.961%,37.204%_62.796%,33.039%_57.941%,29.651%_52.482%,27.124%_46.503%,25.545%_40.092%,25%_33.333%,25%_12.5%)]"
        ></div>
        <PlusCircleIcon className="absolute top-0 right-0 h-8 w-8" />
      </div>
      <Heading level="h3" size="h5" className="mt-0 font-bold">
        {experience[experienceType].title}
      </Heading>
      <p className="mb-4.5 text-gray-600">
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
