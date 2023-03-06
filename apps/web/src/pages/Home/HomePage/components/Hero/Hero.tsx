import React from "react";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";
import { imageUrl } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";

import { wrapAbbr } from "~/utils/nameUtils";
import CallToAction from "~/components/CallToAction/CallToAction";

import "./hero.css";

const landscapeRandomize = (index?: number | undefined) => {
  const items = [
    imageUrl("/", "hero-1-landscape.jpg"),
    imageUrl("/", "hero-2-landscape.jpg"),
    imageUrl("/", "hero-3-landscape.jpg"),
    imageUrl("/", "hero-4-landscape.jpg"),
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
    <div
      data-h2-background-color="base(black.darkest)"
      data-h2-padding-top="base(x3) p-tablet(x4) l-tablet(x6)"
      data-h2-padding-bottom="
      base(calc(50vh + 3%))
      p-tablet(calc(60vh + 3%))
      l-tablet(calc((6rem * var(--h2-line-height-copy)) + 3%))"
      className="hero-bg-image"
      style={{
        backgroundImage: `url('${landscapeRandomize(defaultImage)}')`,
      }}
    >
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-layer="base(1, relative)"
      >
        <div
          data-h2-color="base(white)"
          data-h2-text-align="base(center) p-tablet(left)"
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
        </div>
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(flex-start)"
          data-h2-gap="base(x1)"
          data-h2-justify-content="base(center) p-tablet(flex-start)"
          data-h2-flex-wrap="base(wrap) p-tablet(initial)"
        >
          <CallToAction
            type="link"
            context="job"
            content={{
              path: paths.allPools(),
              label: intl.formatMessage({
                defaultMessage: "Looking for a job?",
                id: "Tk2HJy",
                description: "Link text for applicant call to action",
              }),
            }}
          />
          <CallToAction
            type="link"
            context="hire"
            content={{
              path: paths.search(),
              label: intl.formatMessage({
                defaultMessage: "Looking to hire?",
                id: "1wFFIx",
                description: "Link text for hiring manager call to action",
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
