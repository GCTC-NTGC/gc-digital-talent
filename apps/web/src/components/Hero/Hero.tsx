import { ReactNode, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { tv, VariantProps } from "tailwind-variants";

import {
  Heading,
  type HeadingRef,
  type BreadcrumbsProps,
  Crumb,
  NavTabs,
  Container,
} from "@gc-digital-talent/ui";
import { uiMessages } from "@gc-digital-talent/i18n";

import BackgroundGraphic from "./BackgroundPattern";
import ButtonLinksArray, { ButtonLinkType } from "./ButtonLinksArray";

const hero = tv({
  slots: {
    wrapper:
      "Hero relative overflow-hidden bg-[#000] iap:bg-linear-90 iap:from-primary iap:to-primary-600",
    container: "relative pt-15",
    content: "relative z-3 text-center text-white xs:w-3/5",
    breadcrumbs: "flex flex-wrap justify-center gap-3 p-0 [&_li]:inline-block",
    tabs: "mt-12 flex",
  },
  variants: {
    centered: {
      true: {
        tabs: "justify-center",
      },
      false: {
        content: "xs:text-left",
        breadcrumbs: "xs:justify-start",
      },
    },
    mode: {
      default: {
        container: "pb-12",
      },
      image: {
        container: "pb-12",
      },
      overlap: {
        container: "pb-36",
      },
      navTabs: {
        container: "",
      },
    },
  },
  defaultVariants: {
    mode: "default",
  },
});

type HeroVariants = VariantProps<typeof hero>;

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

interface HeroWithNavTabsProps extends HeroSharedProps {
  navTabs?: NavTab[];
  overlap?: never;
}

interface HeroWithOverlapProps extends HeroSharedProps {
  navTabs?: never;
  overlap: boolean;
}

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

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  let mode: HeroVariants["mode"] = "default";
  if (showImg) {
    mode = "image";
  } else if (applyOverlap) {
    mode = "overlap";
  } else if (navTabs) {
    mode = "navTabs";
  }

  const { wrapper, container, content, breadcrumbs, tabs } = hero({
    mode,
    centered,
  });

  return (
    <>
      <div className={wrapper()}>
        <Container size="lg" className={container()}>
          <div className={content()}>
            <Heading
              ref={headingRef}
              tabIndex={-1}
              level="h1"
              size="h2"
              className="mt-12 outline-none xs:m-0"
            >
              {title}
            </Heading>
            {subtitle && (
              <p className="mt-1.5 mb-7.5 text-xl/[1.4] lg:text-2xl/[1.4]">
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
                className="mt-7.5"
              >
                <ol className={breadcrumbs()}>
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
            <>
              <div
                className="absolute top-1/2 -right-6 hidden h-full w-2/5 -translate-y-1/2 bg-cover bg-center xs:block"
                style={{ backgroundImage: `url('${imgPath}')` }}
              >
                <div className="absolute inset-0 hidden bg-radial from-transparent from-30% to-[#000] to-85% xs:block" />
              </div>
              <BackgroundGraphic
                aria-hidden="true"
                className="absolute top-0 right-0 z-0 block h-auto w-3/4 min-w-120 xs:hidden iap:hidden"
              />
            </>
          ) : (
            <BackgroundGraphic
              aria-hidden="true"
              className="absolute top-0 right-0 z-0 block h-auto w-3/4 min-w-120 iap:hidden"
            />
          )}
          {navTabs ? (
            <div className={tabs()}>
              <NavTabs.Root>
                <NavTabs.List className="mx-auto w-full p-0">
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
        </Container>
        {status && (
          <div className="absolute top-6 right-6 xs:top-9 xs:right-30">
            {status}
          </div>
        )}
        {additionalContent ? (
          <>
            <Container size="lg" className="relative z-3">
              {additionalContent}
            </Container>
          </>
        ) : null}
      </div>
      {children ? (
        <Container size="lg" className="relative z-3 mx-auto -mt-30 mb-0">
          {children}
        </Container>
      ) : null}
    </>
  );
};

export default Hero;
