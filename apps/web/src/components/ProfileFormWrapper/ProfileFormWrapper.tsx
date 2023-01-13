import * as React from "react";
import { useIntl } from "react-intl";

import SEO from "@common/components/SEO/SEO";
import Breadcrumbs, { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import imageUrl from "@common/helpers/imageUrl";

import TALENTSEARCH_APP_DIR from "~/constants/talentSearchConstants";
import useRoutes from "~/hooks/useRoutes";

import CancelButton, { type CancelButtonProps } from "./CancelButton";
import ProfileFormFooter from "./ProfileFormFooter";
import SaveButton from "./SaveButton";

export interface ProfileFormWrapperProps {
  crumbs: BreadcrumbsProps["links"];
  description?: string;
  title: string;
  metaTitle?: string; // Used to override <head><title /></head>
  cancelLink?: CancelButtonProps;
  children?: React.ReactNode;
  prefixBreadcrumbs?: boolean;
}

const ProfileFormWrapper: React.FunctionComponent<ProfileFormWrapperProps> = ({
  crumbs,
  description,
  title,
  metaTitle,
  cancelLink,
  children,
  prefixBreadcrumbs = true,
}) => {
  const intl = useIntl();
  const paths = useRoutes();
  let links = [...crumbs];
  if (prefixBreadcrumbs) {
    links = [
      {
        title: intl.formatMessage({
          defaultMessage: "My Profile",
          id: "tlsomU",
          description: "Breadcrumb from applicant profile wrapper.",
        }),
        href: paths.myProfile(),
      },
      ...links,
    ];
  }

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
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <Breadcrumbs links={links} />
      </div>
    </div>
  );

  return (
    <>
      <SEO title={metaTitle || title} />
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
          {description && (
            <p data-h2-margin="base(0, 0, x1, 0)">{description}</p>
          )}
          <div data-h2-margin="base(0, 0, x3, 0)">{children}</div>
        </div>
        {breadcrumbs}
      </section>
    </>
  );
};

export { CancelButton, ProfileFormFooter, SaveButton };
export default ProfileFormWrapper;
