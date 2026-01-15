import { useIntl } from "react-intl";
import { useState } from "react";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages, getLocale } from "@gc-digital-talent/i18n";
import { Dialog, PreviewList, Separator } from "@gc-digital-talent/ui";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import talentRequestMessages from "~/messages/talentRequestMessages";
import processMessages from "~/messages/processMessages";
import { getClassificationName } from "~/utils/poolUtils";
import { getSalaryRange } from "~/utils/classification";
import { wrapAbbr } from "~/utils/nameUtils";

const RecruitmentProcessDialog_Fragment = graphql(/* GraphQL */ `
  fragment RecruitmentProcessDialog on PoolCandidate {
    id
    expiryDate
    statusUpdatedAt
    suspendedAt
    placedAt
    status {
      value
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
      opportunityLength {
        value
        label {
          localized
        }
      }
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
      processNumber
    }
  }
`);

interface RecruitmentProcessDialogProps {
  recruitmentProcessQuery: FragmentType<
    typeof RecruitmentProcessDialog_Fragment
  >;
}

const RecruitmentProcessDialog = ({
  recruitmentProcessQuery,
}: RecruitmentProcessDialogProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const recruitmentProcess = getFragment(
    RecruitmentProcessDialog_Fragment,
    recruitmentProcessQuery,
  );

  const pool = recruitmentProcess?.pool;
  const nullMessage = intl.formatMessage(commonMessages.notFound);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <PreviewList.Button
          label={
            pool.name?.localized
              ? intl.formatMessage(
                  {
                    defaultMessage:
                      "{poolName}<hidden> recruitment process</hidden>",
                    id: "wrg4fw",
                    description:
                      "Text before recruitment process pool name in recruitment process preview list.",
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
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Review a recruitment process",
            id: "mivSCS",
            description: "Title for the review recruitment process dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div className="grid gap-6 xs:grid-cols-2">
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
              {pool.workStream?.name?.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(processMessages.languageRequirement)}
            >
              {pool.language?.label.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.department)}
              className="xs:col-span-2"
            >
              {pool.department?.name.localized}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(commonMessages.qualified)}>
              {recruitmentProcess.statusUpdatedAt
                ? formatDate({
                    date: parseDateTimeUtc(recruitmentProcess.statusUpdatedAt),
                    formatString: DATE_FORMAT_LOCALIZED,
                    intl,
                  })
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(commonMessages.expires)}>
              {recruitmentProcess.expiryDate
                ? formatDate({
                    date: parseDateTimeUtc(recruitmentProcess.expiryDate),
                    formatString: DATE_FORMAT_LOCALIZED,
                    intl,
                  })
                : nullMessage}
            </FieldDisplay>
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
              {pool.securityClearance?.label.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(processMessages.processNumber)}
              className="xs:col-span-2"
            >
              {pool?.processNumber ?? nullMessage}
            </FieldDisplay>
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RecruitmentProcessDialog;
