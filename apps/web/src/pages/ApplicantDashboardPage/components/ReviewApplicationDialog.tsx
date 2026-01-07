import { useIntl } from "react-intl";
import { useState } from "react";

import {
  CandidateStatus,
  FragmentType,
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
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import talentRequestMessages from "~/messages/talentRequestMessages";
import processMessages from "~/messages/processMessages";
import { getClassificationName } from "~/utils/poolUtils";
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
      screeningQuestionsCount
      opportunityLength {
        label {
          localized
        }
      }
      contactEmail
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
                ? wrapAbbr(
                    getClassificationName(pool?.classification, intl),
                    intl,
                  )
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
                label={intl.formatMessage(commonMessages.deadlineToApply)}
                className="xs:col-span-2"
                hasError={deadlineToApply(
                  pool.closingDate,
                  application.candidateStatus.value,
                )}
              >
                {pool?.closingDate
                  ? formatDate({
                      date: parseDateTimeUtc(pool?.closingDate),
                      formatString: DATE_FORMAT_LOCALIZED,
                      intl,
                      timeZone: "Canada/Pacific",
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
                    {intl.formatMessage(commonMessages.requiredSkills)}
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
                    {intl.formatMessage(commonMessages.optionalSkills)}
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
