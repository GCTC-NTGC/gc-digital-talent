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
