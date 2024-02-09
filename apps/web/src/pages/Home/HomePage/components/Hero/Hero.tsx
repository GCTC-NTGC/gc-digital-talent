import React from "react";
import { useIntl } from "react-intl";
import StarIcon from "@heroicons/react/24/outline/StarIcon";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";

import { Heading, Link } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import HomeHero from "~/components/Hero/HomeHero";
import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";
import hero1Landscape from "~/assets/img/hero-1-landscape.webp";
import hero1Portrait from "~/assets/img/hero-1-portrait.webp";
import hero1Tablet from "~/assets/img/hero-1-tablet-portrait.webp";
import hero2Landscape from "~/assets/img/hero-2-landscape.webp";
import hero2Portrait from "~/assets/img/hero-2-portrait.webp";
import hero2Tablet from "~/assets/img/hero-2-tablet-portrait.webp";
import hero3Landscape from "~/assets/img/hero-3-landscape.webp";
import hero3Portrait from "~/assets/img/hero-3-portrait.webp";
import hero3Tablet from "~/assets/img/hero-3-tablet-portrait.webp";
import hero4Landscape from "~/assets/img/hero-4-landscape.webp";
import hero4Portrait from "~/assets/img/hero-4-portrait.webp";
import hero4Tablet from "~/assets/img/hero-4-tablet-portrait.webp";

const landscapeRandomize = (index?: number | undefined) => {
  const imageSets = {
    "1": {
      mobile: hero1Portrait,
      tablet: hero1Tablet,
      desktop: hero1Landscape,
    },
    "2": {
      mobile: hero2Portrait,
      tablet: hero2Tablet,
      desktop: hero2Landscape,
    },
    "3": {
      mobile: hero3Portrait,
      tablet: hero3Tablet,
      desktop: hero3Landscape,
    },
    "4": {
      mobile: hero4Portrait,
      tablet: hero4Tablet,
      desktop: hero4Landscape,
    },
  };
  const values = Object.values(imageSets);
  return values[index ?? Math.floor(Math.random() * values.length)];
};

export interface HeroProps {
  defaultImage?: number;
}

const Hero = ({ defaultImage }: HeroProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const getHeroImage = landscapeRandomize(defaultImage);
  return (
    <HomeHero
      img={{
        srcset: `${getHeroImage.mobile} 600w, ${getHeroImage.tablet} 900w, ${getHeroImage.desktop} 1200w`,
        src: getHeroImage.desktop,
        alt: intl.formatMessage({
          defaultMessage:
            "A diverse group of people, representing all races, genders, and backgrounds, gathered together in unity. Everyone is welcome here!",
          id: "MCFcrj",
          description: "Hero image alt text.",
        }),
      }}
      callToAction={
        <>
          <Link
            color="quaternary"
            mode="cta"
            icon={MagnifyingGlassIcon}
            href={paths.browsePools()}
          >
            {intl.formatMessage(navigationMessages.browseJobs)}
          </Link>
          <Link
            color="secondary"
            mode="cta"
            icon={StarIcon}
            href={paths.search()}
          >
            {intl.formatMessage(navigationMessages.findTalent)}
          </Link>
        </>
      }
    >
      <Heading level="h1" data-h2-margin="base(0, 0, x0.5, 0)">
        {intl.formatMessage({
          defaultMessage: "GC Digital Talent",
          id: "MS9dB9",
          description: "Application title",
        })}
      </Heading>
      <p
        data-h2-font-size="base(h6, 1.4)"
        data-h2-font-weight="base(300)"
        data-h2-margin="base(x1, 0, x2, 0)"
        data-h2-max-width="p-tablet(65%) l-tablet(50%)"
      >
        {intl.formatMessage(
          {
            defaultMessage:
              "Whether you're thinking about joining government or already an employee, hoping to hire or considering a new role, this is the place to come to be part of the GC digital community.",
            id: "DzCUmx",
            description: "Description of the application on the homepage",
          },
          {
            abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
          },
        )}
      </p>
    </HomeHero>
  );
};

export default Hero;
