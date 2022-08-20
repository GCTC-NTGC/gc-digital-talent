import * as React from "react";
import Breadcrumbs, { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import { BriefcaseIcon, UserIcon } from "@heroicons/react/solid";
import { useIntl } from "react-intl";
import { imageUrl } from "@common/helpers/router";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { getLocale } from "@common/helpers/localize";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import CancelButton, { type CancelButtonProps } from "./CancelButton";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import { PoolCandidate } from "../../api/generated";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";

export interface ProfileFormWrapperProps {
  crumbs: BreadcrumbsProps["links"];
  description: string;
  title: string;
  originApplication?: PoolCandidate;
  cancelLink?: CancelButtonProps;
}

const ProfileFormWrapper: React.FunctionComponent<ProfileFormWrapperProps> = ({
  crumbs,
  description,
  title,
  originApplication,
  cancelLink,
  children,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const profilePaths = useApplicantProfileRoutes();
  const directIntakePaths = useDirectIntakeRoutes();
  const links =
    originApplication && checkFeatureFlag("FEATURE_DIRECTINTAKE")
      ? [
          {
            title: intl.formatMessage({
              defaultMessage: "My Applications",
              description:
                "'My Applications' breadcrumb from applicant profile wrapper.",
            }),
            href: directIntakePaths.applications(originApplication.user.id),
            icon: (
              <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />
            ),
          },
          {
            title:
              originApplication.pool.name?.[locale] ||
              intl.formatMessage({
                defaultMessage: "Pool name not found",
                description:
                  "Pools name breadcrumb from applicant profile wrapper if no name set.",
              }),
            href: directIntakePaths.poolApply(originApplication.pool.id),
          },
          ...crumbs,
        ]
      : [
          {
            title: intl.formatMessage({
              defaultMessage: "My Profile",
              description: "Breadcrumb from applicant profile wrapper.",
            }),
            href: profilePaths.myProfile(),
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
          <CancelButton {...cancelLink} />
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
