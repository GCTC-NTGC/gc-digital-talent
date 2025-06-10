import { useIntl } from "react-intl";

import { Link, LinkProps } from "@gc-digital-talent/ui";
import { Scalars } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

export interface ApplicationLinkProps {
  poolId: Scalars["ID"]["output"];
  applicationId?: Scalars["ID"]["output"];
  hasApplied?: boolean;
  canApply?: boolean;
  linkProps?: Omit<LinkProps, "ref" | "href">;
  linkText?: string;
}

const ApplicationLink = ({
  poolId,
  applicationId,
  hasApplied,
  canApply,
  linkProps,
  linkText,
}: ApplicationLinkProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  // Application does not exist and user cannot apply.
  // So, do not show anything
  if (!canApply && !applicationId) {
    return null;
  }

  const href = applicationId
    ? paths.application(applicationId)
    : paths.createApplication(poolId);
  let linkTextLabel;
  if (!linkText) {
    linkTextLabel = intl.formatMessage({
      defaultMessage: "Apply now",
      id: "KghI8A",
      description: "Link text to apply for a pool advertisement",
    });
    if (applicationId) {
      linkTextLabel = hasApplied
        ? intl.formatMessage({
            defaultMessage: "View my application",
            id: "btCYxZ",
            description: "Link text to view an existing, submitted application",
          })
        : intl.formatMessage({
            defaultMessage: "Continue my application",
            id: "g5JeNf",
            description: "Link text to continue an existing, draft application",
          });
    }
  } else {
    linkTextLabel = linkText;
  }

  return (
    <Link mode="solid" color="primary" href={href} {...linkProps}>
      {linkTextLabel}
    </Link>
  );
};

export default ApplicationLink;
