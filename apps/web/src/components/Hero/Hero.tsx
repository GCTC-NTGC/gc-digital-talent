import { ReactNode, useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import {
  Heading,
  type HeadingRef,
  type BreadcrumbsProps,
  Crumb,
  NavTabs,
} from "@gc-digital-talent/ui";
import { uiMessages } from "@gc-digital-talent/i18n";

import BackgroundGraphic from "./BackgroundPattern";
import ButtonLinksArray, { ButtonLinkType } from "./ButtonLinksArray";

const paddingMap = {
  default: {
    "data-h2-padding": "base(x2.5 0 x2 0)",
  },
  image: {
    "data-h2-padding": "base(x2.5 0 0 0) p-tablet(x2.5 0 x2 0)",
  },
  overlap: {
    "data-h2-padding": "base(x2.5, 0, x6, 0)",
  },
  navTabs: {
    "data-h2-padding": "base(x2.5 0 0 0)",
  },
} as const;

interface NavTab {
  url: string;
  label: ReactNode;
}

interface HeroSharedProps {
  imgPath?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  crumbs?: BreadcrumbsProps["crumbs"];
  buttonLinks?: ButtonLinkType[];
  children?: ReactNode;
  centered?: boolean;
  status?: ReactNode;
  additionalContent?: ReactNode;
}

type HeroWithNavTabsProps = HeroSharedProps & {
  navTabs?: NavTab[];
  overlap?: never;
};

type HeroWithOverlapProps = HeroSharedProps & {
  navTabs?: never;
  overlap: boolean;
};

const Hero = (props: HeroWithNavTabsProps | HeroWithOverlapProps) => {
  // shared props
  const {
    imgPath,
    title,
    subtitle,
    crumbs,
    buttonLinks,
    children,
    centered = false,
    status,
    additionalContent,
  } = props;
  // conditional props
  const navTabs = "navTabs" in props ? props.navTabs : null;
  const overlap = "overlap" in props ? props.overlap : false;

  const intl = useIntl();

  const headingRef = useRef<HeadingRef>(null);
  const showImg = imgPath && !children;
  const applyOverlap = overlap && !navTabs;
  const textAlignment = centered
    ? {
        "data-h2-text-align": "base(center)",
      }
    : {
        "data-h2-text-align": "base(center) p-tablet(left)",
      };
  let padding: (typeof paddingMap)[keyof typeof paddingMap] =
    paddingMap.default;
  if (showImg) {
    padding = paddingMap.image;
  } else if (applyOverlap) {
    padding = paddingMap.overlap;
  } else if (navTabs) {
    padding = paddingMap.navTabs;
  }

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  return (
    <>
      <div
        data-h2-background="base(rgba(0, 0, 0, 1)) base:iap(linear-gradient(90deg, primary, rgb(104, 23, 53)))"
        data-h2-overflow="base(hidden)"
        data-h2-position="base(relative)"
        {...padding}
      >
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          <div
            data-h2-color="base:all(white)"
            data-h2-position="base(relative)"
            data-h2-z-index="base(3)"
            {...textAlignment}
          >
            <Heading
              ref={headingRef}
              tabIndex={-1}
              data-h2-outline="base(none)"
              level="h1"
              size="h2"
              data-h2-margin="base(0)"
              data-h2-margin-top="base(x2) p-tablet(0)"
            >
              {title}
            </Heading>
            {subtitle && (
              <p
                data-h2-font-size="base(h5, 1.4)"
                data-h2-margin="base(x0.25, 0, x1.25, 0)"
              >
                {subtitle}
              </p>
            )}
            {buttonLinks ? (
              <ButtonLinksArray
                buttonLinkArray={buttonLinks}
                centered={centered}
              ></ButtonLinksArray>
            ) : null}
            {crumbs && (
              <nav
                aria-label={intl.formatMessage(uiMessages.breadcrumbs)}
                data-h2-margin-top="base(x1.25)"
              >
                <ol
                  data-h2-list-style="base(none)"
                  data-h2-display="base(flex) base:children[>li](inline-block)"
                  data-h2-flex-wrap="base(wrap)"
                  data-h2-gap="base(x.5)"
                  data-h2-padding="base(0)"
                  {...(centered
                    ? {
                        "data-h2-justify-content": "base(center)",
                      }
                    : {
                        "data-h2-justify-content":
                          "base(center) p-tablet(flex-start)",
                      })}
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
          {showImg ? (
            <div
              data-h2-position="p-tablet(absolute)"
              data-h2-top="p-tablet(x1)"
              data-h2-right="base(0)"
              data-h2-height="base(50vh) p-tablet(100%)"
              data-h2-width="base(100%)"
              data-h2-background-position="base(50% 110%) p-tablet(140% 100%) l-tablet(115% 100%) laptop(110% 100%) desktop(105% 100%)"
              data-h2-background-size="base(auto 50vh) p-tablet(auto 60vh) p-tablet(auto 110%)"
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
              data-h2-z-index="base(0)"
            />
          )}
          {navTabs ? (
            <div
              data-h2-margin-top="base(x2)"
              data-h2-display="base(flex)"
              {...(centered
                ? {
                    "data-h2-justify-content": "base(center)",
                  }
                : {})}
            >
              <NavTabs.Root>
                <NavTabs.List data-h2-wrapper="base(center, full, 0)">
                  {navTabs.map((navTab) => (
                    <NavTabs.Item key={navTab.url}>
                      <NavTabs.Link href={navTab.url}>
                        {navTab.label}
                      </NavTabs.Link>
                    </NavTabs.Item>
                  ))}
                </NavTabs.List>
              </NavTabs.Root>
            </div>
          ) : null}
        </div>
        <div
          data-h2-position="base(absolute)"
          data-h2-top="base(x1) p-tablet(x1.5)"
          data-h2-right="base(x1) p-tablet(x5)"
        >
          {status}
        </div>
        {additionalContent ? (
          <>
            <div
              data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
              data-h2-position="base(relative)"
              data-h2-z-index="base(3)"
            >
              {additionalContent}
            </div>
          </>
        ) : null}
      </div>
      {children ? (
        <>
          <div
            data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
            data-h2-position="base(relative)"
            data-h2-margin="base(-x5, auto, 0, auto)"
          >
            {children}
          </div>
        </>
      ) : null}
    </>
  );
};

export default Hero;
