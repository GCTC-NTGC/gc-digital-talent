import ArrowLongRightIcon from "@heroicons/react/16/solid/ArrowLongRightIcon";
import { useIntl } from "react-intl";

import { navigationMessages } from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

const SharedTocLinks = () => {
  const intl = useIntl();
  const paths = useRoutes();
  return (
    <div className="flex flex-col gap-y-3">
      <Link
        href={paths.profile()}
        utilityIcon={ArrowLongRightIcon}
        className="font-bold"
      >
        {intl.formatMessage(navigationMessages.applicantProfile)}
      </Link>
      <Link
        href={paths.accountSettings()}
        utilityIcon={ArrowLongRightIcon}
        className="font-bold"
      >
        {intl.formatMessage(navigationMessages.accountSettings)}
      </Link>
    </div>
  );
};

export default SharedTocLinks;
