import * as React from "react";
import Breadcrumbs, { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import { UserIcon } from "@heroicons/react/solid";
import { useIntl } from "react-intl";
import { imageUrl } from "@common/helpers/router";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import CancelButton, { type CancelButtonProps } from "./CancelButton";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";

export interface ProfileFormWrapperProps {
  crumbs: BreadcrumbsProps["links"];
  description: string;
  title: string;
  cancelLink?: CancelButtonProps;
}

const ProfileFormWrapper: React.FunctionComponent<ProfileFormWrapperProps> = ({
  crumbs,
  description,
  title,
  cancelLink,
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
      href: profilePath.myProfile(),
      icon: <UserIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    ...crumbs,
  ];

  const breadcrumbs = (
    <div
      data-h2-padding="base(x1, 0)"
      data-h2-color="base(dt-white)"
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
      <div data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)">
          <div data-h2-margin="base(x3, 0, x1, 0)">
          <CancelButton {...cancelLink} />
          </div>
          <h1
            data-h2-margin="base(0, 0, x1, 0)"
            data-h2-font-size="base(h2, 1)"
            data-h2-font-weight="base(700)"
          >
            {title}
          </h1>
          <p data-h2-margin="base(0, 0, x1, 0)">{description}</p>
          <div data-h2-margin="base(0, 0, x3, 0)">{children}</div>
      </div>
      {breadcrumbs}
    </section>
  );
};

export default ProfileFormWrapper;
