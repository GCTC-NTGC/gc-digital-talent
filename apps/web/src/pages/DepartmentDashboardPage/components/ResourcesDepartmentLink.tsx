import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import ArrowLongRightIcon from "@heroicons/react/16/solid/ArrowLongRightIcon";
import type { ReactNode } from "react";

import type { HeadingRank } from "@gc-digital-talent/ui";
import { Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

interface WrapperProps {
  as?: HeadingRank;
  children: ReactNode;
}

const Wrapper = ({ as, children }: WrapperProps) => {
  if (!as) return <>{children}</>;

  const Heading = as;
  return <Heading className="text-base">{children}</Heading>;
};

interface BaseItemProps {
  title: ReactNode;
  content: ReactNode;
}

const BaseItem = ({ title, content }: BaseItemProps) => (
  <div
    className={
      "relative flex flex-col gap-1 p-6 not-last:border-b not-last:border-b-gray-300 sm:px-8 dark:not-last:border-b-gray-100"
    }
    role="listitem"
  >
    <div className="pr-3">{title}</div>
    {content}
  </div>
);

export interface DepartmentWithRolesObject {
  departmentId: string;
  departmentName: string;
  rolesArray: {
    roleName: "department_admin" | "department_hr_advisor";
    roleDisplayName: string;
  }[];
}

interface ResourcesDepartmentLinkProps {
  departmentWithRoles: DepartmentWithRolesObject;
}

const ResourcesDepartmentLink = ({
  departmentWithRoles,
}: ResourcesDepartmentLinkProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const departmentAdminObject = departmentWithRoles.rolesArray.find(
    (roleObject) => roleObject.roleName === "department_admin",
  );
  const departmentAdvisorObject = departmentWithRoles.rolesArray.find(
    (roleObject) => roleObject.roleName === "department_hr_advisor",
  );

  return (
    <BaseItem
      title={
        <Wrapper as={"h3"}>
          <Link
            href={paths.departmentView(departmentWithRoles.departmentId)}
            color="black"
            className="font-bold"
            utilityIcon={ArrowLongRightIcon}
          >
            {departmentWithRoles.departmentName}
          </Link>
        </Wrapper>
      }
      content={
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-200">
            {intl.formatMessage({
              defaultMessage: "View and manage department.",
              id: "BKKZUH",
              description: "Link to department page",
            })}
          </p>
          <div className="mt-2.5 flex flex-col gap-1">
            {departmentAdminObject && (
              <div className="flex items-start gap-1.5">
                <UserCircleIcon
                  className={"mt-1 size-4.5 shrink-0 text-primary-500"}
                  role="img"
                />
                <span>{departmentAdminObject.roleDisplayName}</span>
              </div>
            )}
            {departmentAdvisorObject && (
              <div className="flex items-start gap-1.5">
                <UserCircleIcon
                  className={"mt-1 size-4.5 shrink-0 text-primary-500"}
                  role="img"
                />
                <span>{departmentAdvisorObject.roleDisplayName}</span>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
};

export default ResourcesDepartmentLink;
