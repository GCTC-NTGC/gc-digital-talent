import { useIntl } from "react-intl";
import { Outlet, useLocation } from "react-router";

import { navigationMessages } from "@gc-digital-talent/i18n";
import { Container } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";

// index all the sub pages for this layout
type SubpageIds = "employee-verification" | "career-planning";

const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { pathname } = useLocation();

  const title = intl.formatMessage({
    defaultMessage: "Employee profile",
    id: "4BWod5",
    description: "Page title for a user's GC employee profile",
  });

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Manage your government employee information, including career development preferences and work styles",
    id: "ecHyZS",
    description: "Description of the employee profile page",
  });

  const subpageMetadata: Record<
    SubpageIds,
    {
      label: string;
      url: string;
      hasCrumb: boolean; // show the extra crumb after the base crumbs
    }
  > = {
    "employee-verification": {
      label: intl.formatMessage({
        defaultMessage: "Employee verification",
        id: "ke6NUW",
        description:
          "Description of employee profile, employee verification tab",
      }),
      url: paths.employeeVerification(),
      hasCrumb: false,
    },
    "career-planning": {
      label: intl.formatMessage({
        defaultMessage: "Career planning",
        id: "fh6CuQ",
        description: "Description of employee profile, career planning tab",
      }),
      url: paths.careerPlanning(),
      hasCrumb: true,
    },
  } as const;

  // what subpage is currently showing?
  // similar logic to hero navtab highlighting
  const currentSubpage = Object.values(subpageMetadata).find(
    (p) => p.url === pathname,
  );

  // always show tabs for all subpages
  const navTabs = Object.values(subpageMetadata);

  // base crumbs are shown for every subpage
  const baseCrumbs = [
    {
      label: intl.formatMessage(navigationMessages.applicantDashboard),
      url: paths.applicantDashboard(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Employee profile",
        id: "QgE+ei",
        description: "Short title for a user's GC employee profile",
      }),
      url: paths.employeeVerification(),
    },
  ];

  const crumbs = baseCrumbs.concat(
    currentSubpage?.hasCrumb ? [currentSubpage] : [],
  );

  return (
    <>
      <SEO title={title} description={subtitle} />
      <Hero
        title={title}
        subtitle={subtitle}
        crumbs={crumbs}
        navTabs={navTabs}
      />
      <Container className="my-18">
        <Outlet />
      </Container>
    </>
  );
};

Component.displayName = "EmployeeProfileLayout";

export default Component;
