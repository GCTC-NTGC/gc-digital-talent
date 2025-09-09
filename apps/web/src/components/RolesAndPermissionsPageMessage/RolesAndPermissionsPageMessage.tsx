import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import { Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

const styles = tv({ base: "mb-6" });

const link = (path: string, chunks: ReactNode) => (
  <Link href={path} className="font-bold">
    {chunks}
  </Link>
);

interface RolesAndPermissionsPageMessageProps {
  className?: string;
}

const RolesAndPermissionsPageMessage = ({
  className,
}: RolesAndPermissionsPageMessageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <p className={styles({ class: className })}>
      {intl.formatMessage(
        {
          defaultMessage:
            "Review <link>roles and permissions</link> to understand what each role can and cannot do.",
          id: "JpCD8m",
          description:
            "Help text to direct users to more information on roles and permissions",
        },
        {
          link: (chunks) => link(paths.rolesAndPermissions(), chunks),
        },
      )}
    </p>
  );
};

export default RolesAndPermissionsPageMessage;
