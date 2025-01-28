import { useIntl } from "react-intl";
import { differenceInDays } from "date-fns/differenceInDays";
import { useRef, useState } from "react";

import {
  graphql,
  PoolSkillType,
  ReviewApplicationPreviewListFragment,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  Accordion,
  Button,
  Dialog,
  Link,
  PreviewList,
  PreviewMetaData,
  Separator,
  Well,
} from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/ToggleForm/FieldDisplay";
import talentRequestMessages from "~/messages/talentRequestMessages";
import processMessages from "~/messages/processMessages";
import { getClassificationName } from "~/utils/poolUtils";
import {
  ApplicationStatus,
  getApplicationStatusChip,
  getSalaryRange,
} from "~/utils/poolCandidate";
import { sortPoolSkillsBySkillCategory } from "~/utils/skillUtils";
import useRoutes from "~/hooks/useRoutes";

import { ApplicationDate } from "./MetadataDate";
import StatusSummary from "./StatusSummary";

export const ReviewApplicationPreviewList_Fragment = graphql(/* GraphQL */ `
  fragment ReviewApplicationPreviewList on PoolCandidate {
    id
    expiryDate
    finalDecisionAt
    submittedAt
    removedAt
    status {
      value
      label {
        en
        fr
      }
    }
    finalDecision {
      value
      label {
        en
        fr
      }
    }
    assessmentStatus {
      assessmentStepStatuses {
        step
      }
      overallAssessmentStatus
      currentStep
    }
    pool {
      id
      name {
        en
        fr
      }
      classification {
        group
        level
        minSalary
        maxSalary
      }
      workStream {
        name {
          en
          fr
        }
      }
      language {
        value
        label {
          en
          fr
        }
      }
      department {
        name {
          en
          fr
        }
      }
      closingDate
      opportunityLength {
        value
        label {
          en
          fr
        }
      }
      isRemote
      location {
        en
        fr
      }
      securityClearance {
        value
        label {
          en
          fr
        }
      }
      areaOfSelection {
        value
        label {
          en
          fr
        }
      }
      processNumber
      poolSkills {
        id
        type {
          value
          label {
            en
            fr
          }
        }
        skill {
          id
          key
          name {
            en
            fr
          }
          category {
            value
            label {
              en
              fr
            }
          }
        }
      }
      screeningQuestions {
        id
      }
    }
  }
`);

interface ReviewApplicationDialogProps {
  applicationQuery: ReviewApplicationPreviewListFragment;
}

const ReviewApplicationDialog = ({
  applicationQuery,
}: ReviewApplicationDialogProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const application = applicationQuery;
  const pool = application?.pool;

  const nullMessage = intl.formatMessage(commonMessages.notFound);
  const poolName = getLocalizedName(pool?.name, intl);

  // Separate essential and asset skills, sort them by category, and confirm they include skill data
  const poolSkills = unpackMaybes(pool?.poolSkills);
  const essentialPoolSkills = sortPoolSkillsBySkillCategory(
    poolSkills.filter(
      (poolSkill) => poolSkill.type?.value === PoolSkillType.Essential,
    ),
  );
  const nonessentialPoolSkills = sortPoolSkillsBySkillCategory(
    poolSkills.filter(
      (poolSkill) => poolSkill.type?.value === PoolSkillType.Nonessential,
    ),
  );

  const focusOnRecruitment = useRef(false);

  const status = getApplicationStatusChip(
    application.submittedAt,
    pool.closingDate,
    application.removedAt,
    application.finalDecisionAt,
    application.finalDecision?.value,
    pool.areaOfSelection?.value,
    application.assessmentStatus,
    pool.screeningQuestions,
    intl,
  );

  const isDraftStatus = status.value === ApplicationStatus.DRAFT;
  const isExpiredStatus = status.value === ApplicationStatus.EXPIRED;
  const lessThanThreeDaysTillClosingDate = pool?.closingDate
    ? differenceInDays(Date.now(), parseDateTimeUtc(pool.closingDate)) < 3
    : null;
  const showDeadlineToApply =
    isDraftStatus ||
    (isDraftStatus && lessThanThreeDaysTillClosingDate) ||
    isExpiredStatus;

  const isSuccessfulStatus = status.value === ApplicationStatus.SUCCESSFUL;

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <PreviewList.Button label={poolName} />
      </Dialog.Trigger>
      <Dialog.Content
        onCloseAutoFocus={(e) => {
          if (focusOnRecruitment.current) {
            e.preventDefault();
            document.getElementById(`${application.id}-test`)?.focus();
          }

          focusOnRecruitment.current = false;
        }}
      >
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
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr))"
            data-h2-gap="base(x1)"
          >
            <StatusSummary
              label={status.label}
              description={status.description}
              color={status.color}
              data-h2-grid-column="p-tablet(span 2)"
            />

            <Separator
              data-h2-grid-column="p-tablet(span 2)"
              data-h2-margin="base(0)"
            />

            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.jobTitle)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {poolName ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.classification)}
            >
              {pool?.classification
                ? getClassificationName(pool?.classification, intl)
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.salaryRange)}
            >
              {pool?.classification
                ? getSalaryRange(locale, pool.classification)
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.workStream)}
            >
              {getLocalizedName(pool?.workStream?.name, intl)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(processMessages.languageRequirement)}
            >
              {getLocalizedName(pool?.language?.label, intl)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.department)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {getLocalizedName(pool?.department?.name, intl)}
            </FieldDisplay>
            <FieldDisplay
              label={
                showDeadlineToApply ? (
                  <span data-h2-color="base(black)">
                    {intl.formatMessage(commonMessages.deadlineToApply)}
                  </span>
                ) : (
                  intl.formatMessage(commonMessages.received)
                )
              }
              data-h2-grid-column="p-tablet(span 2)"
              hasError={
                (isDraftStatus && lessThanThreeDaysTillClosingDate) ||
                isExpiredStatus
              }
            >
              {showDeadlineToApply ? (
                <>
                  {pool?.closingDate
                    ? formatDate({
                        date: parseDateTimeUtc(pool?.closingDate),
                        formatString: "PPP",
                        intl,
                        timeZone: "Canada/Pacific",
                      })
                    : nullMessage}
                </>
              ) : (
                <>
                  {application.submittedAt
                    ? formatDate({
                        date: parseDateTimeUtc(application.submittedAt),
                        formatString: "PPP",
                        intl,
                        timeZone: "Canada/Pacific",
                      })
                    : nullMessage}
                </>
              )}
            </FieldDisplay>

            <Separator
              data-h2-grid-column="p-tablet(span 2)"
              data-h2-margin="base(0)"
            />

            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.employmentLength)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {getLocalizedName(pool?.opportunityLength?.label, intl)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.workLocation)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {getLocalizedName(pool?.location, intl)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(
                talentRequestMessages.securityClearance,
              )}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {getLocalizedName(pool?.securityClearance?.label, intl)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(processMessages.processNumber)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {pool?.processNumber ?? nullMessage}
            </FieldDisplay>

            <Separator
              data-h2-grid-column="p-tablet(span 2)"
              data-h2-margin="base(0)"
            />

            <Accordion.Root
              type="multiple"
              data-h2-margin="base(0)"
              data-h2-grid-column="p-tablet(span 2)"
            >
              <Accordion.Item value="essential-skills">
                <Accordion.Trigger>
                  <span>
                    {intl.formatMessage(talentRequestMessages.requiredSkills)}
                  </span>
                  <span
                    data-h2-font-weight="base(normal)"
                    data-h2-color="base(black.light)"
                  >{` (${essentialPoolSkills.length ?? 0})`}</span>
                </Accordion.Trigger>
                <Accordion.Content>
                  {essentialPoolSkills.length ? (
                    <ul>
                      {essentialPoolSkills.map(({ skill }) => (
                        <li key={skill?.id}>
                          {getLocalizedName(skill?.name, intl)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    nullMessage
                  )}
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="optional-skills">
                <Accordion.Trigger>
                  <span>
                    {intl.formatMessage(talentRequestMessages.optionalSkills)}
                  </span>
                  <span
                    data-h2-font-weight="base(normal)"
                    data-h2-color="base(black.light)"
                  >{` (${nonessentialPoolSkills.length ?? 0})`}</span>
                </Accordion.Trigger>
                <Accordion.Content data-h2-margin-bottom="base(-x.5)">
                  {nonessentialPoolSkills.length ? (
                    <ul>
                      {nonessentialPoolSkills.map(({ skill }) => (
                        <li key={skill?.id}>
                          {getLocalizedName(skill?.name, intl)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    nullMessage
                  )}
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
          <Dialog.Footer data-h2-gap="base(0 x1)">
            {isSuccessfulStatus && (
              <Button
                mode="solid"
                color="secondary"
                onClick={() => {
                  setIsOpen(false);
                  focusOnRecruitment.current = true;
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "View recruitment process",
                  id: "CMD0wo",
                  description: "Label for view recruitment process link",
                })}
              </Button>
            )}
            <Link
              href={paths.application(application.id)}
              mode="solid"
              color="secondary"
            >
              {isDraftStatus
                ? intl.formatMessage({
                    defaultMessage: "Continue application",
                    id: "1sppLE",
                    description: "Label for continue application link",
                  })
                : intl.formatMessage({
                    defaultMessage: "View application",
                    id: "xg/wvH",
                    description: "Label for view application link",
                  })}
            </Link>
            <Link href={paths.pool(pool.id)} mode="inline" color="secondary">
              {intl.formatMessage({
                defaultMessage: "View job advertisement",
                id: "eZlUrp",
                description: "Label for view job advertisement link",
              })}
            </Link>
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

const ReviewApplicationPreviewList = ({
  applications,
}: {
  applications: ReviewApplicationPreviewListFragment[];
}) => {
  const intl = useIntl();

  return (
    <>
      {applications.length ? (
        <PreviewList.Root>
          {applications.map((application) => {
            const { id, pool, submittedAt, finalDecisionAt } = application;

            const status = getApplicationStatusChip(
              application.submittedAt,
              pool.closingDate,
              application.removedAt,
              application.finalDecisionAt,
              application.finalDecision?.value,
              pool.areaOfSelection?.value,
              application.assessmentStatus,
              pool.screeningQuestions,
              intl,
            );

            const applicationMetadata: PreviewMetaData[] = [
              {
                key: "status",
                type: "chip",
                color: status.color,
                children: status.label,
              },
              {
                key: "classification",
                type: "text",
                children: pool?.classification
                  ? getClassificationName(pool?.classification, intl)
                  : intl.formatMessage(commonMessages.notFound),
              },
              {
                key: "date",
                type: "text",
                children: (
                  <ApplicationDate
                    closingDate={pool?.closingDate}
                    submittedAt={submittedAt}
                    finalDecisionAt={finalDecisionAt}
                    status={status.value}
                  />
                ),
              },
            ];

            return (
              <PreviewList.Item
                key={id}
                title={getLocalizedName(pool.name, intl)}
                metaData={applicationMetadata}
                action={
                  <ReviewApplicationDialog applicationQuery={application} />
                }
                headingAs="h4"
              />
            );
          })}
        </PreviewList.Root>
      ) : (
        <Well data-h2-text-align="base(center)">
          <p data-h2-font-weight="base(bold)">
            {intl.formatMessage({
              defaultMessage: "You don't have any applications at the moment.",
              id: "ok2eWp",
              description: "Title for notice when there are no applications",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                'You can find a job using the "Browse jobs" button or navigation to the "Browse jobs" page from the main navigation.',
              id: "zeEjHi",
              description: "Body for notice when there are no applications",
            })}
          </p>
        </Well>
      )}
    </>
  );
};

export default ReviewApplicationPreviewList;
