import * as React from "react";
import Breadcrumbs, { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import { UserIcon } from "@heroicons/react/solid";
import { useIntl } from "react-intl";
import { imageUrl } from "@common/helpers/router";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import CancelButton from "./CancelButton";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";

export interface ProfileFormWrapperProps {
  crumbs: BreadcrumbsProps["links"];
  description: string;
  title: string;
  cancelLink?: string;
  userId: string;
}

const ProfileFormWrapper: React.FunctionComponent<ProfileFormWrapperProps> = ({
  crumbs,
  description,
  title,
  cancelLink,
  userId,
  children,
}) => {
  const intl = useIntl();
  const profilePath = useApplicantProfileRoutes();
  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "My Profile",
        description: "Breadcrumb from applicant profile wrapper.",
      }),
      href: profilePath.home(userId),
      icon: <UserIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    ...crumbs,
  ];

  const breadcrumbs = (
    <div
      data-h2-padding="b(top-bottom, m) b(right-left, s) s(right-left, xxl)"
      data-h2-font-color="b(white)"
      style={{
        background: `url(${imageUrl(
          TALENTSEARCH_APP_DIR,
          "applicant-profile-banner.png",
        )})`,
        backgroundSize: "100vw 5rem",
      }}
    >
      <Breadcrumbs links={links} />
    </div>
  );

  return (
    <section>
      {breadcrumbs}
      <div
        data-h2-margin="b(right-left, none) s(right-left, xxl)"
        data-h2-width="b(100) s(75)"
      >
        <div data-h2-margin="b(top-bottom, l)">
          <CancelButton userId={userId} link={cancelLink} />
        </div>
        <h1
          data-h2-margin="b(all, none)"
          data-h2-font-size="b(h2)"
          data-h2-font-weight="b(200)"
        >
          {title}
        </h1>
        <p>{description}</p>
        <div>{children}</div>
      </div>
      {breadcrumbs}
    </section>
  );
};

export default ProfileFormWrapper;
