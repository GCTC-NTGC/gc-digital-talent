import { useIntl } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Chip, Chips } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import { RoleObject } from "./CreatePoolPage";

interface YourRolesSectionProps {
  rolesArray: RoleObject[];
}

const YourRolesSection = ({ rolesArray }: YourRolesSectionProps) => {
  const intl = useIntl();

  const roleChips = rolesArray
    ? rolesArray.map((role) => (
        <Chip color="primary" key={role.id} className="mr-1.5">
          {role.displayName ?? intl.formatMessage(commonMessages.notApplicable)}
        </Chip>
      ))
    : null;

  const rolesPossessed = rolesArray.map((role) => role.name);

  // determine which of three states to render
  let applicableCase: "DEPARTMENT" | "COMMUNITY" | "BOTH" = "BOTH";

  if (
    rolesPossessed.some((role) =>
      [
        ROLE_NAME.DepartmentAdmin as string,
        ROLE_NAME.DepartmentHRAdvisor as string,
      ].includes(role),
    ) &&
    rolesPossessed.some((role) =>
      [
        ROLE_NAME.CommunityAdmin as string,
        ROLE_NAME.CommunityRecruiter as string,
      ].includes(role),
    )
  ) {
    // stays as BOTH
  } else if (
    rolesPossessed.some((role) =>
      [
        ROLE_NAME.DepartmentAdmin as string,
        ROLE_NAME.DepartmentHRAdvisor as string,
      ].includes(role),
    )
  ) {
    // becomes DEPARTMENT
    applicableCase = "DEPARTMENT";
  } else if (
    rolesPossessed.some((role) =>
      [
        ROLE_NAME.CommunityAdmin as string,
        ROLE_NAME.CommunityRecruiter as string,
      ].includes(role),
    )
  ) {
    // becomes COMMUNITY
    applicableCase = "COMMUNITY";
  } else {
    // stays as both, should never be applicable just completeness sake
  }

  return (
    <div>
      <p className="mb-1.5 font-bold">
        {intl.formatMessage({
          defaultMessage: "Your roles",
          id: "IJlJF1",
          description: "Header for section displaying logged in user's roles",
        })}
      </p>
      {roleChips ? <Chips>{roleChips}</Chips> : null}
      <div>
        <p className="mt-4 mb-1.5 font-bold">
          {intl.formatMessage({
            defaultMessage: "Process requirements",
            id: "Cgn4bA",
            description: "Process requirements section",
          })}
        </p>
        <p className="mb-3">
          {intl.formatMessage({
            defaultMessage:
              "Based on the roles linked to your account, you can create a job process under these conditions:",
            id: "eoUAu8",
            description:
              "Before displaying a list of process creation requirements",
          })}
        </p>
        {applicableCase === "BOTH" && (
          <>
            <div className="flex items-start gap-1.5">
              <ExclamationCircleIcon
                className={"mt-1 size-4.5 shrink-0 text-warning-500"}
                role="img"
              />
              <span>
                {intl.formatMessage({
                  defaultMessage:
                    "You must select either a department or a community of which you are a member.",
                  id: "nYGLyk",
                  description: "Requirement statement",
                })}
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircleIcon
                className={"mt-1 size-4.5 shrink-0 text-success-500"}
                role="img"
              />
              <span>
                {intl.formatMessage({
                  defaultMessage: "You can add this process to any department.",
                  id: "opjriz",
                  description: "Flexible requirement statement",
                })}
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircleIcon
                className={"mt-1 size-4.5 shrink-0 text-success-500"}
                role="img"
              />
              <span>
                {intl.formatMessage({
                  defaultMessage: "Optionally you can add a community.",
                  id: "USbBWE",
                  description:
                    "Flexible requirement statement for process creation",
                })}
              </span>
            </div>
          </>
        )}
        {applicableCase === "DEPARTMENT" && (
          <>
            <div className="flex items-start gap-1.5">
              <ExclamationCircleIcon
                className={"mt-1 size-4.5 shrink-0 text-warning-500"}
                role="img"
              />
              <span>
                {intl.formatMessage({
                  defaultMessage:
                    "You must select a department of which you are a member.",
                  id: "IYWL4H",
                  description: "Requirement statement",
                })}
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircleIcon
                className={"mt-1 size-4.5 shrink-0 text-success-500"}
                role="img"
              />
              <span>
                {intl.formatMessage({
                  defaultMessage: "Optionally you can add a community.",
                  id: "pSgzCi",
                  description: "Flexible option for process creation",
                })}
              </span>
            </div>
          </>
        )}
        {applicableCase === "COMMUNITY" && (
          <>
            <div className="flex items-start gap-1.5">
              <ExclamationCircleIcon
                className={"mt-1 size-4.5 shrink-0 text-warning-500"}
                role="img"
              />
              <span>
                {intl.formatMessage({
                  defaultMessage:
                    "You must select a community of which you are a member.",
                  id: "S/Tb6N",
                  description: "Requirement statement",
                })}
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <ExclamationCircleIcon
                className={"mt-1 size-4.5 shrink-0 text-warning-500"}
                role="img"
              />
              <span>
                {intl.formatMessage({
                  defaultMessage: "You must select a department.",
                  id: "6yqOxo",
                  description: "Requirement statement",
                })}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YourRolesSection;
