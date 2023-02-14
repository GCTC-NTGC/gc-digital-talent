import * as React from "react";
import { useIntl } from "react-intl";

import { BreadcrumbsProps } from "@gc-digital-talent/ui";
import { useAuthorization } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";

import useRoutes from "~/hooks/useRoutes";

import CancelButton from "./CancelButton";
import ProfileFormFooter from "./ProfileFormFooter";
import SaveButton from "./SaveButton";

export interface ProfileFormWrapperProps {
  crumbs: BreadcrumbsProps["crumbs"];
  description?: React.ReactNode;
  title: string;
  metaTitle?: string; // Used to override <head><title /></head>
  children?: React.ReactNode;
  prefixBreadcrumbs?: boolean;
}

const ProfileFormWrapper: React.FunctionComponent<ProfileFormWrapperProps> = ({
  crumbs,
  description,
  title,
  metaTitle,
  children,
  prefixBreadcrumbs = true,
}) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { loggedInUser } = useAuthorization();
  let links = [...crumbs];
  if (prefixBreadcrumbs) {
    links = [
      {
        label: intl.formatMessage({
          defaultMessage: "My Profile",
          id: "tlsomU",
          description: "Breadcrumb from applicant profile wrapper.",
        }),
        url: loggedInUser?.id
          ? paths.profile(loggedInUser.id)
          : paths.myProfile(),
      },
      ...links,
    ];
  }

  return (
    <>
      <SEO title={metaTitle || title} />
      <Hero title={title} subtitle={description} crumbs={links} />
      <section data-h2-margin="base(x3, 0)">
        <div data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)">
          {children}
        </div>
      </section>
    </>
  );
};

export { CancelButton, ProfileFormFooter, SaveButton };
export default ProfileFormWrapper;
