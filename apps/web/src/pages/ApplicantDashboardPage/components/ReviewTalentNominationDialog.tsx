import { useIntl } from "react-intl";
import { useState } from "react";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Button,
  Dialog,
  PreviewList,
  Separator,
  Ul,
} from "@gc-digital-talent/ui";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { assertUnreachable, unpackMaybes } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import talentNominationMessages from "~/messages/talentNominationMessages";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import { getFullNameLabel } from "~/utils/nameUtils";

type DialogVariant = "received"; // "under_review" | "withdrawn" | "approved" | "partially_approved" | "rejected" | "expired"

interface ListItem {
  key: string;
  name: string;
}

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
    advancementReferenceFallbackName
    advancementReferenceFallbackWorkEmail
    advancementReference {
      firstName
      lastName
      workEmail
    }
    lateralMovementOptionsOther
    lateralMovementOptions {
      value
      label {
        localized
      }
    }
    developmentProgramOptionsOther
    developmentPrograms {
      id
      name {
        localized
      }
    }
  }
`);

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

  let referenceName =
    talentNomination?.advancementReferenceFallbackName ??
    intl.formatMessage(commonMessages.notProvided);
  if (talentNomination?.advancementReference) {
    referenceName = getFullNameLabel(
      talentNomination.advancementReference.firstName,
      talentNomination.advancementReference.lastName,
      intl,
    );
  }

  const lateralMoveOptions: ListItem[] = unpackMaybes(
    talentNomination.lateralMovementOptions,
  ).map((option) => ({
    key: option.value,
    name: option.label.localized ?? "",
  }));

  const developmentPrograms: ListItem[] = unpackMaybes(
    talentNomination.developmentPrograms,
  ).map((program) => ({
    key: program.id,
    name: program.name?.localized ?? "",
  }));

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
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 xs:grid-cols-2">
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
            <Separator decorative space="none" />
            <div className="grid gap-6 xs:grid-cols-2">
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
                      formatString: DATE_FORMAT_LOCALIZED,
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
                      formatString: DATE_FORMAT_LOCALIZED,
                      intl,
                    })
                  : nullMessage}
              </FieldDisplay>
            </div>
            <Separator decorative space="none" />
            <div className="grid gap-6 xs:grid-cols-2">
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
            {talentNomination.nominateForAdvancement && (
              <>
                <Separator decorative space="none" />
                <div className="grid gap-6 xs:grid-cols-2">
                  <FieldDisplay
                    label={intl.formatMessage({
                      defaultMessage: "Reference’s name",
                      id: "x4/XMp",
                      description:
                        "Label for the text input for the reference's name",
                    })}
                  >
                    {referenceName}
                  </FieldDisplay>
                  <FieldDisplay
                    label={intl.formatMessage({
                      defaultMessage: "Reference's work email",
                      id: "1QKTXO",
                      description:
                        "Label for the reference's input field in nominations details step",
                    })}
                  >
                    {talentNomination.advancementReference?.workEmail ??
                      talentNomination.advancementReferenceFallbackWorkEmail ??
                      intl.formatMessage(commonMessages.notProvided)}
                  </FieldDisplay>
                </div>
              </>
            )}
            {talentNomination.nominateForLateralMovement && (
              <>
                <Separator decorative space="none" />
                <div className="grid gap-6 xs:grid-cols-2">
                  {lateralMoveOptions.length > 0 && (
                    <FieldDisplay
                      className="xs:col-span-2"
                      label={intl.formatMessage({
                        defaultMessage: "Lateral movement options",
                        id: "zLnqLc",
                        description:
                          "Label for the lateral movement options checklist on the details step",
                      })}
                    >
                      <Ul unStyled space="md">
                        {lateralMoveOptions.map((o) => (
                          <li key={o.key}>
                            <BoolCheckIcon value>{o.name}</BoolCheckIcon>
                          </li>
                        ))}
                      </Ul>
                    </FieldDisplay>
                  )}
                  {talentNomination.lateralMovementOptionsOther && (
                    <FieldDisplay
                      className="xs:cols-span-2"
                      label={intl.formatMessage({
                        defaultMessage: "Other lateral move option",
                        id: "BNSbyC",
                        description:
                          "Label other lateral move option input on the details step",
                      })}
                    >
                      {talentNomination.lateralMovementOptionsOther}
                    </FieldDisplay>
                  )}
                </div>
              </>
            )}
            {talentNomination.nominateForDevelopmentPrograms && (
              <>
                <Separator decorative space="none" />
                <div className="grid gap-6 xs:grid-cols-2">
                  {developmentPrograms.length > 0 && (
                    <FieldDisplay
                      className="xs:col-span-2"
                      label={intl.formatMessage({
                        defaultMessage: "Development program recommendations",
                        id: "DHIa69",
                        description:
                          "Label for selected development program items",
                      })}
                    >
                      <Ul unStyled space="md">
                        {developmentPrograms.map((p) => (
                          <li key={p.key}>
                            <BoolCheckIcon value>{p.name}</BoolCheckIcon>
                          </li>
                        ))}
                      </Ul>
                    </FieldDisplay>
                  )}
                  {talentNomination.developmentProgramOptionsOther && (
                    <FieldDisplay
                      className="xs:col-span-2"
                      label={intl.formatMessage({
                        defaultMessage: "Other development program option",
                        id: "xidShX",
                        description:
                          "Label other development program option input on the details step",
                      })}
                    >
                      {talentNomination.developmentProgramOptionsOther}
                    </FieldDisplay>
                  )}
                </div>
              </>
            )}
          </div>
          <Dialog.Footer className="flex-col gap-x-6 gap-y-6 xs:flex-row">
            <FooterButtons dialogVariant={dialogVariant} />
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReviewTalentNominationDialog;
