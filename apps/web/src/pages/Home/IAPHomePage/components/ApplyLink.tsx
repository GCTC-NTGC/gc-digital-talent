import { useIntl } from "react-intl";

import { Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

interface ApplyLinkProps {
  id: string;
}

const ApplyLink = ({ id }: ApplyLinkProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <Link
      color="primary"
      mode="solid"
      block
      href={`${paths.createApplication(id)}?personality=iap`}
    >
      {intl.formatMessage({
        defaultMessage: "Apply Now",
        id: "DvmNR7",
        description: "Button text to apply for program",
      })}
    </Link>
  );
};

export default ApplyLink;
