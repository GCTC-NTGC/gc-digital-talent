import { useIntl } from "react-intl";
import { useState } from "react";

import {
  FragmentType,
  getFragment,
  graphql,
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
} from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/ToggleForm/FieldDisplay";
import talentRequestMessages from "~/messages/talentRequestMessages";
import processMessages from "~/messages/processMessages";
import { getClassificationName } from "~/utils/poolUtils";
import {
  applicationStatus,
  deadlineToApply,
  getApplicationStatusChip,
} from "~/utils/poolCandidate";
import { sortPoolSkillsBySkillCategory } from "~/utils/skillUtils";
import useRoutes from "~/hooks/useRoutes";
import { getSalaryRange } from "~/utils/classification";

import StatusSummary from "./StatusSummary";

const ReviewApplicationDialog_Fragment = graphql(/* GraphQL */ `
  fragment ReviewApplicationDialog on PoolCandidate {
    id
    finalDecisionAt
    submittedAt
    removedAt
    finalDecision {
      value
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
        localized
      }
      classification {
        group
        level
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
      screeningQuestions {
        id
      }
    }
  }
`);

interface ReviewApplicationDialogProps {
  applicationQuery: FragmentType<typeof ReviewApplicationDialog_Fragment>;
}

const ReviewApplicationDialog = ({
  applicationQuery,
}: ReviewApplicationDialogProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const application = getFragment(
    ReviewApplicationDialog_Fragment,
    applicationQuery,
  );

  const pool = application?.pool;

  const nullMessage = intl.formatMessage(commonMessages.notFound);

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

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <PreviewList.Button
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
      <Dialog.Content>
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
              decorative
              data-h2-grid-column="p-tablet(span 2)"
              data-h2-margin="base(0)"
            />

            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.jobTitle)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {pool.name?.localized ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.classification)}
            >
              {pool?.classification
                ? getClassificationName(pool?.classification, intl)
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
              data-h2-grid-column="p-tablet(span 2)"
            >
              {pool.department?.name?.localized ?? nullMessage}
            </FieldDisplay>
            {status.value === applicationStatus.DRAFT ||
            status.value === applicationStatus.EXPIRED ? (
              <FieldDisplay
                label={intl.formatMessage(commonMessages.deadlineToApply)}
                data-h2-grid-column="p-tablet(span 2)"
                hasError={deadlineToApply(pool.closingDate, status.value)}
              >
                {pool?.closingDate
                  ? formatDate({
                      date: parseDateTimeUtc(pool?.closingDate),
                      formatString: "PPP",
                      intl,
                      timeZone: "Canada/Pacific",
                    })
                  : nullMessage}
              </FieldDisplay>
            ) : (
              <FieldDisplay
                label={intl.formatMessage(commonMessages.received)}
                data-h2-grid-column="p-tablet(span 2)"
              >
                {application.submittedAt
                  ? formatDate({
                      date: parseDateTimeUtc(application.submittedAt),
                      formatString: "PPP",
                      intl,
                    })
                  : nullMessage}
              </FieldDisplay>
            )}
            <Separator
              decorative
              data-h2-grid-column="p-tablet(span 2)"
              data-h2-margin="base(0)"
            />

            <FieldDisplay
              label={intl.formatMessage(commonMessages.employmentLength)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {pool.workStream?.name?.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.workLocation)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {pool.isRemote
                ? intl.formatMessage(commonMessages.remote)
                : pool.location?.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.securityClearance)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {pool.securityClearance?.label?.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(processMessages.processNumber)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {pool?.processNumber ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Application ID",
                id: "OEk0OP",
                description: "Label for application ID",
              })}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {application.id}
            </FieldDisplay>

            <Separator
              decorative
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
                    {intl.formatMessage(commonMessages.requiredSkills)}
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
                          {skill?.name.localized ?? nullMessage}
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
                    {intl.formatMessage(commonMessages.optionalSkills)}
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
                          {skill?.name.localized ?? nullMessage}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    nullMessage
                  )}
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
            <Separator
              decorative
              data-h2-grid-column="p-tablet(span 2)"
              data-h2-margin="base(0)"
            />
            <p data-h2-grid-column="p-tablet(span 2)">
              {intl.formatMessage({
                defaultMessage: `You can find the recruitment process for which you’ve been qualified for in the "Recruitment process" tool on your dashboard.`,
                id: "1bTFdX",
                description:
                  "Message informing applicant of the connected recruitment process in the preview list below",
              })}
            </p>
          </div>
          <Dialog.Footer data-h2-gap="base(0 x1)">
            <Link
              href={paths.application(application.id)}
              mode="solid"
              color="secondary"
            >
              {status.value === applicationStatus.DRAFT
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

export default ReviewApplicationDialog;
