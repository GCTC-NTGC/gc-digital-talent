import React from "react";
import { useIntl } from "react-intl";
import StarIcon from "@heroicons/react/24/outline/StarIcon";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";

import { Heading, Link } from "@gc-digital-talent/ui";

import HomeHero from "~/components/Hero/HomeHero";
import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";

import hero1Landscape from "~/assets/img/hero-1-landscape.jpg";
import hero2Landscape from "~/assets/img/hero-2-landscape.jpg";
import hero3Landscape from "~/assets/img/hero-3-landscape.jpg";
import hero4Landscape from "~/assets/img/hero-4-landscape.jpg";

const landscapeRandomize = (index?: number | undefined) => {
  const items = [
    hero1Landscape,
    hero2Landscape,
    hero3Landscape,
    hero4Landscape,
  ];
  return items[index ?? Math.floor(Math.random() * items.length)];
};

export interface HeroProps {
  defaultImage?: number;
}

const Hero = ({ defaultImage }: HeroProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <HomeHero
      img={{
        alt: intl.formatMessage({
          defaultMessage:
            "A diverse group of people, representing all races, genders, and backgrounds, gathered together in unity. Everyone is welcome here!",
          id: "MCFcrj",
          description: "Hero image alt text.",
        }),
        src: landscapeRandomize(defaultImage),
      }}
      callToAction={
        <>
          <Link
            color="quaternary"
            mode="cta"
            icon={MagnifyingGlassIcon}
            href={paths.browsePools()}
          >
            {intl.formatMessage({
              defaultMessage: "Browse jobs",
              id: "SUlb9U",
              description: "Link text for applicant call to action",
            })}
          </Link>
          <Link
            color="secondary"
            mode="cta"
            icon={StarIcon}
            href={paths.search()}
          >
            {intl.formatMessage({
              defaultMessage: "Find talent",
              id: "sbEk4X",
              description: "Link text for hiring manager call to action",
            })}
          </Link>
        </>
      }
    >
      <Heading level="h1" size="h2" data-h2-margin="base(0, 0, x0.5, 0)">
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
        data-h2-max-width="p-tablet(50%)"
      >
        {intl.formatMessage(
          {
            defaultMessage:
              "Whether you're thinking about joining government or already an employee, hoping to hire or considering an executive role, this is the place to come to be part of the <abbreviation>GC</abbreviation> digital community.",
            id: "58Z5Ld",
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
