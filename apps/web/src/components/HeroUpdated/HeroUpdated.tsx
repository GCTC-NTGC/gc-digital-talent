import { ReactNode, useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import {
  Heading,
  type HeadingRef,
  type BreadcrumbsProps,
  Crumb,
  Flourish,
} from "@gc-digital-talent/ui";
import { uiMessages } from "@gc-digital-talent/i18n";

import BackgroundGraphic from "../Hero/BackgroundPattern";
import { ButtonLinksArrayProps } from "./ButtonLinksArray";
import NavigationMenu from "./NavigationMenu";

const paddingMap = new Map([
  [
    "default",
    {
      "data-h2-padding": "base(x4, 0)",
    },
  ],
  [
    "image",
    {
      "data-h2-padding":
        "base(x3, 0, 50vh, 0) p-tablet(x3, 0, 60vh, 0) l-tablet(x4, 0)",
    },
  ],
  [
    "overlap",
    {
      "data-h2-padding": "base(x4, 0, x8, 0)",
    },
  ],
]);

interface HeroUpdatedProps {
  imgPath?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  crumbs?: BreadcrumbsProps["crumbs"];
  buttonLinks?: ButtonLinksArrayProps;
  children?: ReactNode;
  centered?: boolean;
  linkSlot?: ReactNode;
}

const HeroUpdated = ({
  imgPath,
  title,
  subtitle,
  crumbs,
  children,
  linkSlot,
  centered = false,
}: HeroUpdatedProps) => {
  const intl = useIntl();

  const headingRef = useRef<HeadingRef>(null);
  const showImg = imgPath && !centered && !children;
  const textAlignment = centered
    ? {
        "data-h2-text-align": "base(center)",
      }
    : {
        "data-h2-text-align": "base(center) l-tablet(left)",
      };
  let padding = paddingMap.get("default");
  if (showImg) {
    padding = paddingMap.get("image");
  } else if (children) {
    padding = paddingMap.get("overlap");
  }

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  return (
    <>
      <Flourish />
      <div
        data-h2-background="base(rgba(0, 0, 0, 1)) base:iap(linear-gradient(90deg, primary, rgb(104, 23, 53)))"
        data-h2-overflow="base(hidden)"
        data-h2-position="base(relative)"
        {...padding}
      >
        <NavigationMenu></NavigationMenu>
        <div
          data-h2-display="base(none) base:iap(block)"
          data-h2-position="base(absolute)"
          data-h2-location="base(auto, 0, 0, auto)"
          data-h2-transform="base(translate(65%, 75%))"
        >
          <div
            data-h2-height="base(x30)"
            data-h2-width="base(x30)"
            data-h2-background-color="base:all(secondary.darker)"
            data-h2-radius="base(circle)"
          >
            &nbsp;
          </div>
        </div>
        <div
          data-h2-display="base(none) base:iap(block)"
          data-h2-position="base(absolute)"
          data-h2-location="base(0, auto, auto, 0)"
          data-h2-transform="base(translate(-75%, -65%))"
        >
          <div
            data-h2-height="base(x30)"
            data-h2-width="base(x30)"
            data-h2-border="base:all(x.25 solid secondary.darker)"
            data-h2-radius="base(circle)"
          />
          <div
            data-h2-height="base(x25)"
            data-h2-width="base(x25)"
            data-h2-border="base:all(x.25 solid secondary.darker)"
            data-h2-radius="base(circle)"
            data-h2-position="base(center)"
          />
          <div
            data-h2-height="base(x20)"
            data-h2-width="base(x20)"
            data-h2-border="base:all(x.25 solid secondary.darker)"
            data-h2-radius="base(circle)"
            data-h2-position="base(center)"
          >
            &nbsp;
          </div>
        </div>
        <div
          data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
          data-h2-layer="base(3, relative)"
        >
          <div
            data-h2-color="base:all(white)"
            {...textAlignment}
            {...(showImg && {
              "data-h2-margin-right": "l-tablet(x18)",
            })}
          >
            <Heading
              ref={headingRef}
              tabIndex={-1}
              data-h2-outline="base(none)"
              level="h1"
              size="h2"
              data-h2-margin="base(0)"
            >
              {title}
            </Heading>
            {subtitle && (
              <p
                data-h2-font-size="base(h5, 1.4)"
                data-h2-margin="base(x1, 0, 0, 0)"
              >
                {subtitle}
              </p>
            )}
            {linkSlot && (
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(flex-start)"
                data-h2-margin="base(x1.5, 0, 0, 0)"
                data-h2-gap="base(x1)"
                data-h2-justify-content="base(center) p-tablet(flex-start)"
                data-h2-flex-wrap="base(wrap) p-tablet(initial)"
              >
                {linkSlot}
              </div>
            )}
            {crumbs && (
              <nav
                aria-label={intl.formatMessage(uiMessages.breadcrumbs)}
                data-h2-padding-top="base(x2)"
              >
                <ol
                  data-h2-list-style="base(none)"
                  data-h2-display="base(flex) base:children[>li](inline-block)"
                  data-h2-flex-wrap="base(wrap)"
                  data-h2-gap="base(x.5)"
                  data-h2-padding="base(0)"
                >
                  {crumbs.map((crumb, index) => (
                    <Crumb
                      key={crumb.url}
                      url={crumb.url}
                      isCurrent={index + 1 === crumbs.length}
                    >
                      {crumb.label}
                    </Crumb>
                  ))}
                </ol>
              </nav>
            )}
          </div>
        </div>
        {showImg ? (
          <div
            data-h2-position="base(absolute)"
            data-h2-location="base(0)"
            data-h2-height="base(auto)"
            data-h2-width="base(100%)"
            data-h2-z-index="base(2)"
            data-h2-background-position="base(50% 110%) l-tablet(calc(50% + 25rem) 50%)"
            data-h2-background-size="base(auto 50vh) p-tablet(auto 60vh) l-tablet(auto 110%)"
            data-h2-background-repeat="base(no-repeat)"
            style={{ backgroundImage: `url('${imgPath}')` }}
          />
        ) : (
          <BackgroundGraphic
            aria-hidden="true"
            data-h2-display="base(block) base:iap(none)"
            data-h2-position="base(absolute)"
            data-h2-location="base(0, 0, auto, auto)"
            data-h2-height="base(auto)"
            data-h2-min-width="base(x20)"
            data-h2-width="base(75%)"
            data-h2-z-index="base(1)"
          />
        )}
      </div>
    </>
  );
};

export default HeroUpdated;
