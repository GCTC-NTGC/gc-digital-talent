import type { ReactNode } from "react";
import { useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import { navigationMessages } from "@gc-digital-talent/i18n";
import { Container, Flourish } from "@gc-digital-talent/ui";
import { useTheme } from "@gc-digital-talent/theme";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import flourishTopLight from "~/assets/img/browse_top_light.webp";
import flourishBottomLight from "~/assets/img/browse_bottom_light.webp";
import flourishTopDark from "~/assets/img/browse_top_dark.webp";
import flourishBottomDark from "~/assets/img/browse_bottom_dark.webp";

import browseJobsMessages from "./browseJobsMessages";
import ConversionFeatures from "./components/ConversionFeatures/ConversionFeatures";

const flourish = tv({
  base: "absolute z-1 w-[25vw]",
  variants: {
    isTop: {
      true: "top-0 right-0",
      false: "bottom-0 left-0",
    },
  },
});
interface Props {
  children: ReactNode;
}

/*
 * I don't think it's possible to use a React Router Outlet here
 * since PoolAdvertisementPage is in the subtree but doesn't
 * use this layout
 */
export const Component = ({ children }: Props) => {
  const intl = useIntl();
  const paths = useRoutes();
  const theme = useTheme();

  const formattedTitle = intl.formatMessage(navigationMessages.browseJobs);
  const formattedSubtitle = intl.formatMessage({
    defaultMessage: "Browse and apply to jobs in the Government of Canada",
    id: "IwVHgf",
    description: "Subtitle for the browse jobs page",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedTitle,
        url: paths.openOpportunities(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedTitle} description={formattedSubtitle} />
      <Hero
        title={formattedTitle}
        subtitle={formattedSubtitle}
        crumbs={crumbs}
        navTabs={[
          {
            label: intl.formatMessage(browseJobsMessages.openOpportunities),
            url: paths.openOpportunities(),
          },
        ]}
      />
      <div className="relative overflow-hidden py-18">
        <img
          alt=""
          src={theme.mode === "dark" ? flourishTopDark : flourishTopLight}
          className={flourish({ isTop: true })}
        />
        <Container className="relative z-2">{children}</Container>
        <img
          alt=""
          src={theme.mode === "dark" ? flourishBottomDark : flourishBottomLight}
          className={flourish({ isTop: false })}
        />
      </div>
      <ConversionFeatures />
      <Flourish />
    </>
  );
};

Component.displayName = "BrowseJobsLayout";

export default Component;
