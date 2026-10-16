import { useIntl } from "react-intl";
import { useRef, useState } from "react";
import type { RefObject } from "react";
import { useMutation } from "urql";

import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  CandidateStatus,
  getFragment,
  graphql,
  PoolAreaOfSelection,
  PoolSkillType,
} from "@gc-digital-talent/graphql";
import { commonMessages, getLocale } from "@gc-digital-talent/i18n";
import {
  Accordion,
  Button,
  Dialog,
  Link,
  PreviewList,
  Separator,
  Ul,
  wrapParens,
} from "@gc-digital-talent/ui";
import {
  DATE_FORMAT_LOCALIZED,
  TZ_VANCOUVER,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import talentRequestMessages from "~/messages/talentRequestMessages";
import processMessages from "~/messages/processMessages";
import {
  candidateStatusColorMap,
  deadlineToApply,
} from "~/utils/poolCandidate";
import { sortPoolSkillsBySkillCategory } from "~/utils/skillUtils";
import useRoutes from "~/hooks/useRoutes";
import { getSalaryRange } from "~/utils/classification";
import { wrapAbbr } from "~/utils/nameUtils";

import StatusSummary from "./StatusSummary";
import { candidateStatusDesc } from "./utils";

const ReviewApplicationDialog_Fragment = graphql(/* GraphQL */ `
  fragment ReviewApplicationDialog on PoolCandidate {
    id
    submittedAt
    candidateStatus {
      value
      label {
        localized
      }
    }
    isDashboardViewable
    pool {
      id
      name {
        localized
      }
      classification {
        groupAndLevel
        minSalary
        maxSalary
      }
      workStream {
        name {
          localized
        }
      }
      language {
        value
        label {
          localized
        }
      }
      department {
        name {
          localized
        }
      }
      closingDate
      isRemote
      location {
        localized
      }
      securityClearance {
        value
        label {
          localized
        }
      }
      areaOfSelection {
        value
      }
      processNumber
      poolSkills {
        id
        type {
          value
          label {
            localized
          }
        }
        skill {
          id
          key
          name {
            localized
          }
          category {
            value
            label {
              localized
            }
          }
        }
      }
      opportunityLength {
        label {
          localized
        }
      }
      contactEmail
    }
  }
`);

const ToggleIsDashboardViewable_Mutation = graphql(/** GraphQL */ `
  mutation ToggleIsDashboardViewable($id: UUID!) {
    toggleIsDashboardViewable(id: $id) {
      id
      isDashboardViewable
    }
  }
`);

interface ReviewApplicationDialogProps {
  applicationQuery: FragmentType<typeof ReviewApplicationDialog_Fragment>;
  filterForDashboardViewable?: boolean;
  fallbackFocusRef?: RefObject<HTMLElement | null>;
}

const ReviewApplicationDialog = ({
  applicationQuery,
  filterForDashboardViewable,
  fallbackFocusRef,
}: ReviewApplicationDialogProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isLeavingListRef = useRef(false);

  const application = getFragment(
    ReviewApplicationDialog_Fragment,
    applicationQuery,
  );

  const pool = application?.pool;

  const nullMessage = intl.formatMessage(commonMessages.notFound);

  const poolName = pool.name?.localized ?? nullMessage;

  // Separate essential and asset skills, sort them by category, and confirm they include skill data
  const poolSkills = unpackMaybes(pool?.poolSkills);
  const essentialSkills = sortPoolSkillsBySkillCategory(
    poolSkills.filter(
      (poolSkill) => poolSkill.type?.value === PoolSkillType.Essential,
    ),
  )
    .flatMap(({ skill }) => skill)
    .filter(notEmpty);
  const nonessentialSkills = sortPoolSkillsBySkillCategory(
    poolSkills.filter(
      (poolSkill) => poolSkill.type?.value === PoolSkillType.Nonessential,
    ),
  )
    .flatMap(({ skill }) => skill)
    .filter(notEmpty);

  const [{ fetching }, executeMutation] = useMutation(
    ToggleIsDashboardViewable_Mutation,
  );
  const handleIsDashboardViewableToggle = () => {
    const originalToggleValue = application.isDashboardViewable;
    if (fetching) return;

    executeMutation({ id: application.id })
      .then((res) => {
        if (res.error) throw new Error(res.error.message);
        if (!res.data?.toggleIsDashboardViewable?.id)
          throw new Error("Could not add/remove application from dashboard");

        const newToggleValue =
          res.data.toggleIsDashboardViewable.isDashboardViewable;

        if (newToggleValue) {
          toast.success(
            intl.formatMessage(
              {
                defaultMessage: "Successfully added {poolName} to dashboard.",
                id: "0kUhc0",
                description:
                  "Success message for pool visible in dashboard again",
              },
              {
                poolName: poolName,
              },
            ),
          );
        } else {
          toast.success(
            intl.formatMessage(
              {
                defaultMessage:
                  "Successfully removed {poolName} from dashboard.",
                id: "TF3Bvn",
                description:
                  "Success message for pool no longer visible in dashboard",
              },
              {
                poolName: poolName,
              },
            ),
          );
        }
        isLeavingListRef.current =
          !newToggleValue && !!filterForDashboardViewable;
        setIsOpen(false);
      })
      .catch(() => {
        if (originalToggleValue) {
          toast.error(
            intl.formatMessage(
              {
                defaultMessage: "Failure removing {poolName} from dashboard.",
                id: "9HP8+b",
                description: "Failure message for hiding pool from dashboard",
              },
              {
                poolName: poolName,
              },
            ),
          );
        } else {
          toast.error(
            intl.formatMessage(
              {
                defaultMessage: "Failure adding {poolName} to dashboard.",
                id: "MIicIe",
                description:
                  "Failure message for adding pool back to dashboard",
              },
              {
                poolName: poolName,
              },
            ),
          );
        }
      });
  };

  // reference handleDialogCloseAutoFocus() from TalentRequestTrackedUsersInbox.tsx
  const handleCloseAutoFocus = (event: Event) => {
    if (!isLeavingListRef.current) return;
    isLeavingListRef.current = false;
    event.preventDefault();

    const previousAction = triggerRef.current
      ?.closest("li")
      ?.previousElementSibling?.querySelector<HTMLElement>("a[href], button");
    (previousAction ?? fallbackFocusRef?.current)?.focus();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <PreviewList.Button
          ref={triggerRef}
          label={
            pool.name?.localized
              ? intl.formatMessage(
                  {
                    defaultMessage:
                      "<hidden>Application for </hidden>{poolName}",
                    id: "LC1Rsg",
                    description:
                      "Text before application pool name in application preview list.",
                  },
                  {
                    poolName: pool.name.localized,
                  },
                )
              : nullMessage
          }
        />
      </Dialog.Trigger>
      <Dialog.Content onCloseAutoFocus={handleCloseAutoFocus}>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Check out various details about the opportunity or continue your application.",
            id: "AtMQ8c",
            description: "Subtitle for the review application dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Review your application",
            id: "vRNv4w",
            description: "Title for the review application dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div className="grid gap-6 xs:grid-cols-2">
            {application.candidateStatus && (
              <StatusSummary
                label={application.candidateStatus.label.localized}
                description={candidateStatusDesc({
                  status: application.candidateStatus.value,
                  employeesOnly:
                    pool.areaOfSelection?.value ===
                    PoolAreaOfSelection.Employees,
                  contactEmail: pool.contactEmail,
                  intl,
                })}
                color={
                  candidateStatusColorMap.get(
                    application.candidateStatus.value,
                  ) ?? "gray"
                }
                className="xs:col-span-2"
              />
            )}

            <Separator decorative className="m-0 xs:col-span-2" />

            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.jobTitle)}
              className="xs:col-span-2"
            >
              {pool.name?.localized ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.classification)}
            >
              {pool?.classification
                ? wrapAbbr(pool.classification.groupAndLevel, intl)
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.salaryRange)}
            >
              {pool?.classification
                ? getSalaryRange(locale, pool.classification)
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.workStream)}
            >
              {pool.workStream?.name?.localized ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(processMessages.languageRequirement)}
            >
              {pool.language?.label.localized ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.department)}
              className="xs:col-span-2"
            >
              {pool.department?.name?.localized ?? nullMessage}
            </FieldDisplay>
            {application?.candidateStatus?.value === CandidateStatus.Expired ? (
              <FieldDisplay
                label={intl.formatMessage({
                  defaultMessage: "Deadline to apply",
                  id: "ZoYqEo",
                  description: "Title for deadline to apply",
                })}
                className="xs:col-span-2"
                hasError={deadlineToApply(
                  pool.closingDate,
                  CandidateStatus.Expired,
                )}
              >
                {pool?.closingDate
                  ? formatDate({
                      date: parseDateTimeUtc(pool?.closingDate),
                      formatString: DATE_FORMAT_LOCALIZED,
                      intl,
                      timeZone: TZ_VANCOUVER,
                    })
                  : nullMessage}
              </FieldDisplay>
            ) : (
              <FieldDisplay
                label={intl.formatMessage(commonMessages.received)}
                className="xs:col-span-2"
              >
                {application.submittedAt
                  ? formatDate({
                      date: parseDateTimeUtc(application.submittedAt),
                      formatString: DATE_FORMAT_LOCALIZED,
                      intl,
                    })
                  : nullMessage}
              </FieldDisplay>
            )}
            <Separator decorative className="m-0 xs:col-span-2" />

            <FieldDisplay
              label={intl.formatMessage(commonMessages.employmentLength)}
              className="xs:col-span-2"
            >
              {pool.opportunityLength?.label.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.workLocation)}
              className="xs:col-span-2"
            >
              {pool.isRemote
                ? intl.formatMessage(commonMessages.remote)
                : pool.location?.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.securityClearance)}
              className="xs:col-span-2"
            >
              {pool.securityClearance?.label?.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(processMessages.processNumber)}
              className="xs:col-span-2"
            >
              {pool?.processNumber ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Application ID",
                id: "OEk0OP",
                description: "Label for application ID",
              })}
              className="xs:col-span-2"
            >
              {application.id}
            </FieldDisplay>

            <Separator decorative className="m-0 xs:col-span-2" />

            <Accordion.Root type="multiple" className="xs:col-span-2">
              <Accordion.Item value="essential-skills">
                <Accordion.Trigger>
                  <span>
                    {intl.formatMessage({
                      id: "WZ17s5",
                      defaultMessage: "Required skills",
                      description: "Title for required skills",
                    })}
                  </span>
                  <span className="ml-1 font-normal text-gray-500 dark:text-gray-200">
                    {wrapParens(essentialSkills.length ?? 0)}
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  {essentialSkills.length ? (
                    <Ul>
                      {essentialSkills.map(({ id, name }) => (
                        <li key={id}>{name.localized ?? nullMessage}</li>
                      ))}
                    </Ul>
                  ) : (
                    nullMessage
                  )}
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="optional-skills">
                <Accordion.Trigger>
                  <span>
                    {intl.formatMessage({
                      id: "Ojevvl",
                      defaultMessage: "Optional skills",
                      description: "Title for optional skills",
                    })}
                  </span>
                  <span className="ml-1 font-normal text-gray-500 dark:text-gray-200">
                    {wrapParens(nonessentialSkills.length ?? 0)}
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  {nonessentialSkills.length ? (
                    <Ul>
                      {nonessentialSkills.map(({ id, name }) => (
                        <li key={id}>{name.localized ?? nullMessage}</li>
                      ))}
                    </Ul>
                  ) : (
                    nullMessage
                  )}
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
            {application.candidateStatus?.value ===
              CandidateStatus.Qualified && (
              <>
                <Separator decorative className="m-0 xs:col-span-2" />
                <p className="xs:col-span-2">
                  {intl.formatMessage({
                    defaultMessage: `You can find the recruitment processes you've been qualified for in the "Recruitment processes" tool on your dashboard.`,
                    id: "/6obwT",
                    description:
                      "Message informing applicant of the connected recruitment process in the preview list below",
                  })}
                </p>
              </>
            )}
          </div>
          <Dialog.Footer className="flex flex-col gap-y-6 xs:flex-row xs:gap-x-6 xs:gap-y-0">
            <Link
              href={paths.application(application.id)}
              mode="solid"
              color="primary"
            >
              {intl.formatMessage({
                defaultMessage: "View application",
                id: "xg/wvH",
                description: "Label for view application link",
              })}
            </Link>
            <Link href={paths.jobPoster(pool.id)} mode="inline" color="primary">
              {intl.formatMessage({
                defaultMessage: "View job advertisement",
                id: "eZlUrp",
                description: "Label for view job advertisement link",
              })}
            </Link>
            <Button
              color="primary"
              type="button"
              mode="inline"
              onClick={handleIsDashboardViewableToggle}
            >
              {application.isDashboardViewable ? (
                <>
                  {intl.formatMessage({
                    defaultMessage: "Remove from dashboard",
                    id: "r0Fp7/",
                    description:
                      "Button label to hide application from your dashboard",
                  })}
                </>
              ) : (
                <>
                  {intl.formatMessage({
                    defaultMessage: "Add to dashboard",
                    id: "TiOiHX",
                    description:
                      "Button label to add back application to your dashboard",
                  })}
                </>
              )}
            </Button>
            <Dialog.Close>
              <Button color="warning" mode="inline">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReviewApplicationDialog;
