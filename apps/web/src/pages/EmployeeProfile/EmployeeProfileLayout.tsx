import { useIntl } from "react-intl";
import { Outlet } from "react-router";

import { navigationMessages } from "@gc-digital-talent/i18n";
import { Container } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";

const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();

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

  const crumbs = [
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

  const navTabs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Employee verification",
        id: "ke6NUW",
        description:
          "Description of employee profile, employee verification tab",
      }),
      url: paths.employeeVerification(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Career planning",
        id: "fh6CuQ",
        description: "Description of employee profile, career planning tab",
      }),
      url: paths.careerPlanning(),
    },
  ];

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
