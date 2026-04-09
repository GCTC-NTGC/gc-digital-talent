import { useIntl } from "react-intl";

import { type Scalars } from "@gc-digital-talent/graphql";
import { Link, type LinkProps } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { type PoolCompleteness } from "~/types/pool";

interface ProcessPreviwLinkProps extends Omit<LinkProps, "href"> {
  id: Scalars["UUID"]["output"];
  status: PoolCompleteness;
}

const ProcessPreviwLink = ({ id, status, ...rest }: ProcessPreviwLinkProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <Link
      mode="inline"
      color="primary"
      href={
        status === "submitted" ? paths.jobPoster(id) : paths.poolPreview(id)
      }
      newTab
      {...rest}
    >
      {status === "submitted"
        ? intl.formatMessage({
            defaultMessage: "View advertisement",
            id: "8gyWTT",
            description: "Link text to view a specific pool advertisement",
          })
        : intl.formatMessage({
            defaultMessage: "Preview advertisement",
            id: "AhZlU1",
            description: "Link text to preview a specific pool advertisement",
          })}
    </Link>
  );
};

export default ProcessPreviwLink;
