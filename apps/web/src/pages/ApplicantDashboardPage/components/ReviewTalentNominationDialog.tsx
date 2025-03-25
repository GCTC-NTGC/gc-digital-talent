import { useIntl } from "react-intl";
import { useState } from "react";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  formMessages,
  getLocale,
} from "@gc-digital-talent/i18n";
import {
  Button,
  Dialog,
  Link,
  PreviewList,
  Separator,
} from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { RadioGroup } from "@gc-digital-talent/forms";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import talentRequestMessages from "~/messages/talentRequestMessages";
import processMessages from "~/messages/processMessages";
import { getClassificationName } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";
import { getSalaryRange } from "~/utils/classification";
import { wrapAbbr } from "~/utils/nameUtils";

import StatusSummary from "./StatusSummary";

const ReviewTalentNominationDialog_Fragment = graphql(/* GraphQL */ `
  fragment ReviewTalentNominationDialog on TalentNomination {
    id
  }
`);

interface ReviewTalentNominationDialogProps {
  talentNominationQuery: FragmentType<
    typeof ReviewTalentNominationDialog_Fragment
  >;
}

const ReviewTalentNominationDialog = ({
  talentNominationQuery,
}: ReviewTalentNominationDialogProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const talentNomination = getFragment(
    ReviewTalentNominationDialog_Fragment,
    talentNominationQuery,
  );

  const nullMessage = intl.formatMessage(commonMessages.notFound);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // const status = getQualifiedRecruitmentStatusChip(
  //   talentNomination.suspendedAt,
  //   talentNomination.placedAt,
  //   talentNomination.status?.value ?? null,
  //   intl,
  // );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <PreviewList.Button
          label="click me"
          // label={
          //   pool.name?.localized
          //     ? intl.formatMessage(
          //         {
          //           defaultMessage:
          //             "{poolName}<hidden> recruitment process</hidden>",
          //           id: "wrg4fw",
          //           description:
          //             "Text before recruitment process pool name in recruitment process preview list.",
          //         },
          //         {
          //           poolName: pool.name.localized,
          //         },
          //       )
          //     : nullMessage
          // }
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Check out the details of a recruitment process you belong to and update your interest in receiving job offers.",
            id: "Hwt9jD",
            description: "Subtitle for the review recruitment process dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Review a recruitment process",
            id: "mivSCS",
            description: "Title for the review recruitment process dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          {/* <div
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
              data-h2-grid-column="p-tablet(span 2)"
            >
              {pool.department?.name.localized}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(commonMessages.qualified)}>
              {talentNomination.finalDecisionAt
                ? formatDate({
                    date: parseDateTimeUtc(talentNomination.finalDecisionAt),
                    formatString: "PPP",
                    intl,
                  })
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(commonMessages.expires)}>
              {talentNomination.expiryDate
                ? formatDate({
                    date: parseDateTimeUtc(talentNomination.expiryDate),
                    formatString: "PPP",
                    intl,
                  })
                : nullMessage}
            </FieldDisplay>
            <Separator
              decorative
              data-h2-grid-column="p-tablet(span 2)"
              data-h2-margin="base(0)"
            />
            <FieldDisplay
              label={intl.formatMessage(commonMessages.employmentLength)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {pool.opportunityLength?.label.localized}
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
              {pool.securityClearance?.label.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(processMessages.processNumber)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {pool?.processNumber ?? nullMessage}
            </FieldDisplay>

            <Separator
              decorative
              data-h2-grid-column="p-tablet(span 2)"
              data-h2-margin="base(0)"
            />

            <div
              data-h2-display="base(grid)"
              data-h2-gap="base(x1)"
              data-h2-grid-column="p-tablet(span 2)"
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Congratulations on being accepted into this recruitment process! You’ll now be considered for related opportunities. If you’ve recently taken a new job or no longer want to be contacted about opportunities, you can change your availability here. <strong>This choice can be reversed at any time if you change your mind</strong>.",
                  id: "xHAPBe",
                  description:
                    "Message congratulating the applicant into the recruitment process.",
                })}
              </p>
              <RadioGroup
                legend={intl.formatMessage({
                  defaultMessage: "Your availability",
                  id: "jaMIil",
                  description:
                    "Label for available for opportunities radio group",
                })}
                idPrefix="availability"
                id="isSuspended"
                name="isSuspended"
                items={[
                  {
                    label: intl.formatMessage({
                      defaultMessage:
                        "I am <strong>available</strong> for hire and want to be contacted about opportunities from this recruitment process.",
                      id: "cAOf3a",
                      description:
                        "Radio button label for available for opportunities option",
                    }),
                    value: "false",
                  },
                  {
                    label: intl.formatMessage({
                      defaultMessage:
                        "I am <strong>unavailable</strong> and do not want to be contacted about opportunities from this recruitment process.",
                      id: "1mYPEx",
                      description:
                        "Radio button label for not available for opportunities option",
                    }),
                    value: "true",
                  },
                ]}
              />
              <Dialog.Footer
                data-h2-gap="base(x1 0) p-tablet(0 x1)"
                data-h2-flex-direction="base(column) p-tablet(row)"
              >
                <Button type="submit" color="secondary">
                  {intl.formatMessage(formMessages.saveChanges)}
                </Button>
                <Link
                  href={paths.application(talentNomination.id)}
                  mode="inline"
                  color="secondary"
                >
                  {intl.formatMessage({
                    defaultMessage: "View application",
                    id: "xg/wvH",
                    description: "Label for view application link",
                  })}
                </Link>
                <Link
                  href={paths.pool(pool.id)}
                  mode="inline"
                  color="secondary"
                >
                  {intl.formatMessage({
                    defaultMessage: "View job advertisement",
                    id: "eZlUrp",
                    description: "Label for view job advertisement link",
                  })}
                </Link>
                <Dialog.Close>
                  <Button mode="inline" color="warning">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </div>
          </div> */}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReviewTalentNominationDialog;
