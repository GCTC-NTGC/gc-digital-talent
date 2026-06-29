import { useIntl } from "react-intl";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import { tv, type VariantProps } from "tailwind-variants";

import { Button, Card, Heading, Link, Ul } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { EmailType, getFragment, graphql } from "@gc-digital-talent/graphql";

import EmailVerificationDialog from "~/components/EmailVerificationDialog/EmailVerificationDialog";
import { getExperienceName } from "~/utils/experienceUtils";
import useRoutes from "~/hooks/useRoutes";
import experienceMessages from "~/messages/experienceMessages";

const grid = tv({
  base: "mt-6 grid grid-cols-1 gap-3 xs:grid-cols-3",
  variants: {
    context: {
      admin: "xs:grid-cols-2",
      applicant: "xs:grid-cols-3",
    },
  },
});

export const UserEmployeeVerification_Fragment = graphql(/* GraphQL */ `
  fragment UserEmployeeVerification on User {
    isVerifiedGovEmployee
    workEmail
    isWorkEmailVerified
    latestCurrentGovernmentWorkExperience {
      id
      __typename
      role
      organization
      employmentCategory {
        value
      }
      department {
        name {
          en
          fr
        }
      }
      cafForce {
        label {
          en
          fr
        }
      }
    }
    employeeProfile {
      communityInterests {
        id
        community {
          name {
            localized
          }
        }
      }
    }
  }
`);

type EmployeeVerificationContext = VariantProps<typeof grid>["context"];

export interface EmployeeVerificationSectionProps {
  userQuery: FragmentType<typeof UserEmployeeVerification_Fragment>;
  context: EmployeeVerificationContext;
}

const EmployeeVerificationSection = ({
  userQuery,
  context = "applicant",
}: EmployeeVerificationSectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const user = getFragment(UserEmployeeVerification_Fragment, userQuery);
  const communityInterests = user.employeeProfile?.communityInterests ?? [];

  return (
    <>
      <Heading
        level="h2"
        size={context === "admin" ? "h3" : "h2"}
        icon={IdentificationIcon}
        color={context === "admin" ? "secondary" : "primary"}
        className="mt-0 font-normal sm:text-left"
      >
        {intl.formatMessage(commonMessages.employeeVerification)}
      </Heading>
      <p>
        {context === "admin"
          ? intl.formatMessage({
              defaultMessage:
                "View this employee’s verified Government of Canada work email address and current work experience.",
              id: "XjtKKm",
              description:
                "Lead-in text explaining employee verification for admins",
            })
          : intl.formatMessage({
              defaultMessage:
                "Verify your Government of Canada work email address and update your career experience with your latest Government of Canada role to gain access to useful career management tools and profile settings.",
              id: "gikOBE",
              description: "Lead-in text explaining employee verification",
            })}
      </p>
      <div className={grid({ context })}>
        <Card className="grid gap-3">
          <div className="flex min-h-8.5 flex-col gap-3 wrap-break-word">
            <p className="font-bold">
              {intl.formatMessage({
                defaultMessage: "Work email verification",
                id: "1zsfA7",
                description: "Label for gov of canada work email verification",
              })}
            </p>
            <p>
              {user.workEmail ? (
                <span className="flex gap-1.5">
                  {user.isWorkEmailVerified ? (
                    <CheckCircleIcon
                      className="mt-1 size-4.5 shrink-0 text-success"
                      aria-hidden="false"
                      aria-label={intl.formatMessage({
                        defaultMessage: "Verified",
                        id: "GMglI5",
                        description:
                          "The email address has been verified to be owned by user",
                      })}
                    />
                  ) : (
                    <ExclamationCircleIcon
                      className="mt-1 size-4.5 shrink-0 text-error"
                      aria-hidden="false"
                      aria-label={intl.formatMessage({
                        defaultMessage: "Not verified",
                        id: "U56T9c",
                        description:
                          "The email address has not been verified to be owned by user",
                      })}
                    />
                  )}
                  <span className="grid grid-cols-1">{user.workEmail}</span>
                </span>
              ) : (
                <span className="flex gap-1.5">
                  <XCircleIcon
                    className="mt-1 size-4.5 shrink-0 text-gray"
                    aria-hidden="false"
                    aria-label={intl.formatMessage(commonMessages.notProvided)}
                  />
                  <span>
                    {intl.formatMessage({
                      defaultMessage:
                        "Government of Canada work email not provided.",
                      id: "CTk374",
                      description: "Error message when work email is null.",
                    })}
                  </span>
                </span>
              )}
            </p>
          </div>
          {context === "applicant" && (
            <div className="mt-auto">
              <Card.Separator space="xs" />
              <div className="items-center">
                <EmailVerificationDialog
                  emailType={EmailType.Work}
                  emailAddress={user.workEmail ?? null}
                >
                  <Button
                    color="secondary"
                    mode="inline"
                    className="text-center xs:text-left"
                  >
                    {user.workEmail
                      ? user.isWorkEmailVerified
                        ? intl.formatMessage({
                            defaultMessage: "Update work email",
                            id: "9jO3/H",
                            description: "Link to update email",
                          })
                        : intl.formatMessage({
                            defaultMessage: "Re-verify work email",
                            id: "mriIoW",
                            description: "Link to redo email verification",
                          })
                      : intl.formatMessage({
                          defaultMessage: "Verify work email",
                          id: "OvusdX",
                          description: "Label to go to email verification",
                        })}
                  </Button>
                </EmailVerificationDialog>
              </div>
            </div>
          )}
        </Card>
        <Card className="grid gap-3">
          <div className="flex min-h-8.5 flex-col gap-3">
            <p className="font-bold">
              {intl.formatMessage({
                defaultMessage: "Current work experience",
                id: "b9aCAt",
                description:
                  "Title for current experience part of employee verification ",
              })}
            </p>
            <p>
              {user.latestCurrentGovernmentWorkExperience ? (
                <span className="flex gap-1.5">
                  <CheckCircleIcon
                    className="mt-1 size-4.5 shrink-0 text-success"
                    aria-hidden="false"
                    aria-label={intl.formatMessage(commonMessages.complete)}
                  />
                  <span>
                    {getExperienceName(
                      user.latestCurrentGovernmentWorkExperience,
                      intl,
                    )}
                  </span>
                </span>
              ) : (
                <span className="flex gap-1.5">
                  <XCircleIcon
                    className="mt-1 size-4.5 shrink-0 text-gray"
                    aria-hidden="false"
                    aria-label={intl.formatMessage(commonMessages.notProvided)}
                  />
                  <span>
                    {intl.formatMessage({
                      defaultMessage:
                        "Current Government of Canada work experience not provided.",
                      id: "JqCgiW",
                      description:
                        "Error message when user has no current government experience.",
                    })}
                  </span>
                </span>
              )}
            </p>
          </div>
          {context === "applicant" && (
            <div className="mt-auto">
              <Card.Separator space="xs" />
              <div className="items-center">
                {user.latestCurrentGovernmentWorkExperience ? (
                  <Link
                    href={paths.editExperience(
                      user.latestCurrentGovernmentWorkExperience.id,
                    )}
                    mode="inline"
                    color="secondary"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Update work experience",
                      id: "LUh/KI",
                      description:
                        "Link to edit the users current government experience",
                    })}
                  </Link>
                ) : (
                  <Link
                    href={paths.createExperience()}
                    mode="inline"
                    color="secondary"
                  >
                    {intl.formatMessage(experienceMessages.addNewExperience)}
                  </Link>
                )}
              </div>
            </div>
          )}
        </Card>
        {context === "applicant" && (
          <Card className="grid gap-3">
            <div className="flex min-h-8.5 flex-col gap-3">
              <p className="font-bold">
                {intl.formatMessage({
                  defaultMessage: "Functional communities",
                  id: "QuVtMh",
                  description: "Label for functional communities field",
                })}
              </p>
              <div>
                {user.isVerifiedGovEmployee ? (
                  communityInterests.length > 0 ? (
                    <Ul unStyled space="md">
                      {communityInterests.map((interest) => {
                        return (
                          <li key={interest.id}>
                            <div className="flex items-start gap-1.5">
                              <CheckCircleIcon
                                className="mt-1 size-4.5 shrink-0 text-success"
                                aria-hidden="false"
                                aria-label={intl.formatMessage(
                                  commonMessages.complete,
                                )}
                              />
                              <span>{interest.community?.name?.localized}</span>
                            </div>
                          </li>
                        );
                      })}
                    </Ul>
                  ) : (
                    <span className="flex gap-1.5">
                      <XCircleIcon
                        className="mt-1 size-4.5 shrink-0 text-gray"
                        aria-hidden="false"
                        aria-label={intl.formatMessage(
                          commonMessages.notSelected,
                        )}
                      />
                      <span>
                        {intl.formatMessage({
                          defaultMessage: "No functional communities joined.",
                          id: "o7j1Gc",
                          description:
                            "Label for when user has not expressed interest in any communities",
                        })}
                      </span>
                    </span>
                  )
                ) : (
                  <span className="flex gap-1.5">
                    <LockClosedIcon
                      className="mt-1 size-4.5 shrink-0 text-gray"
                      aria-hidden="false"
                      aria-label={intl.formatMessage(
                        commonMessages.notAvailable,
                      )}
                    />
                    <span>
                      {intl.formatMessage({
                        defaultMessage:
                          "Verify your email and add GC work experience to join a functional community.",
                        id: "rTu/kK",
                        description:
                          "Message displayed for community interests when the user is not a verified employee",
                      })}
                    </span>
                  </span>
                )}
              </div>
            </div>
            <div className="mt-auto">
              <Card.Separator space="xs" />
              <div className="items-center">
                {user.isVerifiedGovEmployee ? (
                  communityInterests.length > 0 ? (
                    <Link
                      href={paths.applicantDashboard("functional-communities")}
                      mode="inline"
                      color="secondary"
                    >
                      {intl.formatMessage({
                        defaultMessage: "Manage communities",
                        id: "NxIPbD",
                        description:
                          "Link to manage the users community interests",
                      })}
                    </Link>
                  ) : (
                    <Link
                      href={paths.createCommunityInterest()}
                      mode="inline"
                      color="secondary"
                    >
                      {intl.formatMessage({
                        defaultMessage: "Join a community",
                        id: "BeCVcA",
                        description: "Link to add a community interest",
                      })}
                    </Link>
                  )
                ) : (
                  <span className="font-bold text-gray underline">
                    {intl.formatMessage({
                      defaultMessage: "Join a community",
                      id: "BeCVcA",
                      description: "Link to add a community interest",
                    })}
                  </span>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default EmployeeVerificationSection;
