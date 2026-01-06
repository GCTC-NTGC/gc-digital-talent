import { useIntl } from "react-intl";
import StarIcon from "@heroicons/react/24/outline/StarIcon";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";

import { CTALink } from "@gc-digital-talent/ui";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import hero1Square from "~/assets/img/home-hero-square-1.webp";
import hero1Landscape from "~/assets/img/home-hero-landscape-1.webp";
import hero2Square from "~/assets/img/home-hero-square-2.webp";
import hero2Landscape from "~/assets/img/home-hero-landscape-2.webp";
import hero3Square from "~/assets/img/home-hero-square-3.webp";
import hero3Landscape from "~/assets/img/home-hero-landscape-3.webp";
import hero4Square from "~/assets/img/home-hero-square-4.webp";
import hero4Landscape from "~/assets/img/home-hero-landscape-4.webp";

import HomeHero from "../../components/HomeHero";

interface RandomImgProps {
  sm: string;
  src: string;
  className?: string;
}

const landscapeRandomize = (index?: number): RandomImgProps => {
  const imageSets: RandomImgProps[] = [
    {
      sm: hero1Square,
      src: hero1Landscape,
    },
    {
      sm: hero2Square,
      src: hero2Landscape,
      className: "sm:object-bottom-right",
    },
    {
      sm: hero3Square,
      src: hero3Landscape,
      className: "sm:object-bottom",
    },
    {
      sm: hero4Square,
      src: hero4Landscape,
    },
  ];
  return imageSets[index ?? Math.floor(Math.random() * imageSets.length)];
};

export interface HeroProps {
  defaultImage?: number;
}

const Hero = ({ defaultImage }: HeroProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const img = landscapeRandomize(defaultImage);
  return (
    <HomeHero
      title={intl.formatMessage(commonMessages.projectTitle)}
      subtitle={intl.formatMessage({
        defaultMessage:
          "Whether you're thinking about joining government or already an employee, hoping to hire or considering a new role, this is the place to come to be part of the GC digital community.",
        id: "DzCUmx",
        description: "Description of the application on the homepage",
      })}
      img={{
        sources: { sm: img.sm },
        src: img.src,
        className: img?.className,
        alt: intl.formatMessage({
          defaultMessage:
            "A diverse group of people, representing all races, genders, and backgrounds, gathered together in unity. Everyone is welcome here!",
          id: "MCFcrj",
          description: "Hero image alt text.",
        }),
      }}
      callToAction={
        <>
          <CTALink
            color="warning"
            icon={MagnifyingGlassIcon}
            href={paths.jobs()}
          >
            {intl.formatMessage(navigationMessages.browseJobs)}
          </CTALink>
          <CTALink color="primary" icon={StarIcon} href={paths.search()}>
            {intl.formatMessage(navigationMessages.findTalent)}
          </CTALink>
        </>
      }
    />
  );
};

export default Hero;
