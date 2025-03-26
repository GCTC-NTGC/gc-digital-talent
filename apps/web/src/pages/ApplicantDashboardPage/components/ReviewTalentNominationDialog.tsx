import { IntlShape, useIntl } from "react-intl";
import { ReactNode, useState } from "react";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  Button,
  Dialog,
  Link,
  PreviewList,
  Separator,
  Well,
} from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { assertUnreachable } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import useRoutes from "~/hooks/useRoutes";
import talentNominationMessages from "~/messages/talentNominationMessages";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

type DialogVariant = "received"; // "under_review" | "withdrawn" | "approved" | "partially_approved" | "rejected" | "expired"

const ReviewTalentNominationDialog_Fragment = graphql(/* GraphQL */ `
  fragment ReviewTalentNominationDialog on TalentNomination {
    id
    nominee {
      firstName
      lastName
      workEmail
    }
    nominateForAdvancement
    nominateForLateralMovement
    nominateForDevelopmentPrograms
    talentNominationEvent {
      name {
        localized
      }
      community {
        name {
          localized
        }
      }
      closeDate
    }
    submittedAt
    nominator {
      firstName
      lastName
      workEmail
    }
  }
`);

function getStatusWell(
  dialogVariant: DialogVariant,
  intl: IntlShape,
): ReactNode {
  if (dialogVariant === "received") {
    return (
      <Well color="secondary">
        <p data-h2-font-weight="base(bold)">
          {intl.formatMessage({
            defaultMessage: "Received",
            id: "lwRIsY",
            description: "The title of the 'received' nomination status",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Your nomination has been successfully submitted and is awaiting review. We’ll notify you when the functional community begins the review process.",
            id: "VDNYQU",
            description: "The description of the 'received' nomination status",
          })}
        </p>
      </Well>
    );
  }
  // there will be other wells in the future for other variants
  return assertUnreachable(dialogVariant);
}

interface ReviewTalentNominationDialogProps {
  talentNominationQuery: FragmentType<
    typeof ReviewTalentNominationDialog_Fragment
  >;
}

const ReviewTalentNominationDialog = ({
  talentNominationQuery,
}: ReviewTalentNominationDialogProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const talentNomination = getFragment(
    ReviewTalentNominationDialog_Fragment,
    talentNominationQuery,
  );

  const dialogVariant: DialogVariant = "received"; // will have to handle other variants later
  const statusWell = getStatusWell(dialogVariant, intl);

  const nullMessage = intl.formatMessage(commonMessages.notFound);

  const [isOpen, setIsOpen] = useState<boolean>(true); // TODO: default false

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <PreviewList.Button
          label={
            talentNomination.nominee
              ? intl.formatMessage(
                  {
                    defaultMessage: "{name}<hidden> talent nomination</hidden>",
                    id: "uaVogJ",
                    description:
                      "Label for talent nomination review dialog button",
                  },
                  {
                    name: `${talentNomination.nominee.firstName} ${talentNomination.nominee.lastName}`,
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
              "Check out the details of a nomination you’ve submitted and track its progress.",
            id: "LOwBJx",
            description: "Subtitle for the review talent nomination dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Review a nomination",
            id: "2wbcfE",
            description: "Title for the review talent nomination dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr))"
            data-h2-gap="base(x1)"
          >
            {statusWell ? (
              <div data-h2-grid-column="p-tablet(span 2)">{statusWell}</div>
            ) : null}

            <Separator
              decorative
              data-h2-grid-column="p-tablet(span 2)"
              data-h2-margin="base(0)"
            />

            <FieldDisplay
              label={intl.formatMessage(talentNominationMessages.nomineeName)}
            >
              {talentNomination.nominee?.firstName ||
              talentNomination.nominee?.lastName
                ? `${talentNomination.nominee?.firstName} ${talentNomination.nominee?.lastName}`.trim()
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(
                talentNominationMessages.nomineeWorkEmail,
              )}
            >
              {talentNomination.nominee?.workEmail ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentNominationMessages.nomineeTypes)}
            >
              <BoolCheckIcon value={talentNomination.nominateForAdvancement}>
                {intl.formatMessage(
                  talentNominationMessages.nominateForAdvancement,
                )}
              </BoolCheckIcon>
              <BoolCheckIcon
                value={talentNomination.nominateForLateralMovement}
              >
                {intl.formatMessage(
                  talentNominationMessages.nominateForLateralMovement,
                )}
              </BoolCheckIcon>
              <BoolCheckIcon
                value={talentNomination.nominateForDevelopmentPrograms}
              >
                {intl.formatMessage(
                  talentNominationMessages.nominateForDevelopmentPrograms,
                )}
              </BoolCheckIcon>
            </FieldDisplay>
            <Separator
              decorative
              data-h2-grid-column="p-tablet(span 2)"
              data-h2-margin="base(0)"
            />
            <FieldDisplay
              label={intl.formatMessage(talentNominationMessages.eventName)}
            >
              {talentNomination.talentNominationEvent.name.localized ??
                nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(
                talentNominationMessages.functionalCommunity,
              )}
            >
              {talentNomination.talentNominationEvent.community.name
                ?.localized ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(
                talentNominationMessages.nominationDeadline,
              )}
            >
              {talentNomination.talentNominationEvent.closeDate
                ? formatDate({
                    date: parseDateTimeUtc(
                      talentNomination.talentNominationEvent.closeDate,
                    ),
                    formatString: "PPP",
                    intl,
                  })
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(
                talentNominationMessages.nominationDeadline,
              )}
            >
              {talentNomination.submittedAt
                ? formatDate({
                    date: parseDateTimeUtc(talentNomination.submittedAt),
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
              label={intl.formatMessage(talentNominationMessages.nominatorName)}
            >
              {talentNomination.nominator?.firstName ||
              talentNomination.nominator?.lastName
                ? `${talentNomination.nominator?.firstName} ${talentNomination.nominator?.lastName}`.trim()
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(
                talentNominationMessages.nominatorWorkEmail,
              )}
            >
              {talentNomination.nominator?.workEmail ?? nullMessage}
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
                {/* <Link
                  href={paths.pool(pool.id)}
                  mode="inline"
                  color="secondary"
                >
                  {intl.formatMessage({
                    defaultMessage: "View job advertisement",
                    id: "eZlUrp",
                    description: "Label for view job advertisement link",
                  })}
                </Link> */}
                <Dialog.Close>
                  <Button mode="inline" color="warning">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </div>
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReviewTalentNominationDialog;
