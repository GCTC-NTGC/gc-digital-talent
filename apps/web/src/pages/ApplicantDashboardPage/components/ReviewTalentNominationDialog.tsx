import { useIntl } from "react-intl";
import { useState } from "react";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Button,
  Dialog,
  PreviewList,
  Separator,
  Well,
} from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { assertUnreachable } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import talentNominationMessages from "~/messages/talentNominationMessages";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import { getFullNameLabel } from "~/utils/nameUtils";

type DialogVariant = "received"; // "under_review" | "withdrawn" | "approved" | "partially_approved" | "rejected" | "expired"

const ReviewTalentNominationDialog_Fragment = graphql(/* GraphQL */ `
  fragment ReviewTalentNominationDialog on TalentNomination {
    id
    nominee {
      firstName
      lastName
      workEmail
    }
    nominatorFallbackName
    nominatorFallbackWorkEmail
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

function StatusWell({ dialogVariant }: { dialogVariant: DialogVariant }) {
  const intl = useIntl();
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
  assertUnreachable(dialogVariant);
  return null;
}

function FooterButtons({ dialogVariant }: { dialogVariant: DialogVariant }) {
  const intl = useIntl();
  if (dialogVariant === "received") {
    return (
      <Dialog.Close>
        <Button color="secondary">
          {intl.formatMessage(commonMessages.close)}
        </Button>
      </Dialog.Close>
    );
  }
  // there will be other button sets in the future for other variants
  assertUnreachable(dialogVariant);
  return null;
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

  const talentNomination = getFragment(
    ReviewTalentNominationDialog_Fragment,
    talentNominationQuery,
  );

  const dialogVariant: DialogVariant = "received"; // will have to handle other variants later

  const nullMessage = intl.formatMessage(commonMessages.notFound);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  let nominatorName = talentNomination?.nominatorFallbackName ?? nullMessage;
  if (talentNomination?.nominator) {
    nominatorName = getFullNameLabel(
      talentNomination.nominator.firstName,
      talentNomination.nominator.lastName,
      intl,
    );
  }

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
              "Check out the details of a nomination you’ve submitted.",
            id: "CTxxiq",
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
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x1)"
          >
            <StatusWell dialogVariant={dialogVariant} />

            <Separator decorative data-h2-margin="base(0)" />

            <div
              data-h2-display="base(grid)"
              data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr))"
              data-h2-gap="base(x1)"
            >
              <FieldDisplay
                label={intl.formatMessage(talentNominationMessages.nomineeName)}
              >
                {talentNomination.nominee?.firstName ||
                talentNomination.nominee?.lastName
                  ? getFullNameLabel(
                      talentNomination.nominee?.firstName,
                      talentNomination.nominee?.lastName,
                      intl,
                    )
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
                label={intl.formatMessage(
                  talentNominationMessages.nomineeTypes,
                )}
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
            </div>
            <Separator decorative data-h2-margin="base(0)" />
            <div
              data-h2-display="base(grid)"
              data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr))"
              data-h2-gap="base(x1)"
            >
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
                  talentNominationMessages.submissionDate,
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
            </div>
            <Separator decorative data-h2-margin="base(0)" />
            <div
              data-h2-display="base(grid)"
              data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr))"
              data-h2-gap="base(x1)"
            >
              <FieldDisplay
                label={intl.formatMessage(
                  talentNominationMessages.nominatorName,
                )}
              >
                {nominatorName}
              </FieldDisplay>
              <FieldDisplay
                label={intl.formatMessage(
                  talentNominationMessages.nominatorWorkEmail,
                )}
              >
                {talentNomination?.nominator?.workEmail ??
                  talentNomination?.nominatorFallbackWorkEmail ??
                  intl.formatMessage(commonMessages.notProvided)}
              </FieldDisplay>
            </div>
          </div>
          <Dialog.Footer
            data-h2-gap="base(x1 0) p-tablet(0 x1)"
            data-h2-flex-direction="base(column) p-tablet(row)"
          >
            <FooterButtons dialogVariant={dialogVariant} />
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReviewTalentNominationDialog;
