import React from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";

import { CardLink, Loading } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";
import { useApiRoutes, useAuthentication } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";
import authMessages from "~/messages/authMessages";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";
import SEO from "~/components/SEO/SEO";

const AdminHomePage = () => {
  const intl = useIntl();
  const adminRoutes = useRoutes();
  const apiRoutes = useApiRoutes();
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedIn } = useAuthentication();

  React.useEffect(() => {
    // If user is logged in, send them to the dashboard instead
    if (loggedIn) {
      navigate(adminRoutes.adminDashboard(), { replace: true });
    }
  }, [adminRoutes, loggedIn, navigate]);

  if (loggedIn) {
    return <Loading />; // Show loading spinner while we process redirect
  }

  const pageTitle = intl.formatMessage({
    defaultMessage: "Home",
    id: "6EOrWk",
    description: "Title for homepage on the talent cloud admin portal.",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <AdminHero
        title={pageTitle}
        subtitle={intl.formatMessage(
          {
            defaultMessage:
              "Welcome to <abbreviation>GC</abbreviation> Digital Talent, please sign in to continue.",
            id: "HNe+Yh",
            description:
              "Instructional text for the talent cloud pool manager portal home page.",
          },
          {
            abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
          },
        )}
      />
      <AdminContentWrapper>
        <CardLink
          external
          href={apiRoutes.login(location.pathname, getLocale(intl))}
          label={intl.formatMessage(authMessages.signIn)}
          icon={ArrowRightOnRectangleIcon}
        >
          {intl.formatMessage({
            defaultMessage: "Portal manager portal",
            id: "u6GmEz",
            description: "Title for the pool manager login link.",
          })}
        </CardLink>
      </AdminContentWrapper>
    </>
  );
};

export default AdminHomePage;
