import { defineMessage, useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Accordion } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { formatClassificationString } from "~/utils/poolUtils";

import { formMessages } from "../messages";

const TalentNominationAccordionItem_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationAccordionItem on TalentNomination {
    id
    nominator {
      firstName
      lastName
    }

    nominateForAdvancement
    nominateForLateralMovement
    nominateForDevelopmentPrograms

    advancementReference {
      workEmail
      firstName
      lastName
      role
      department {
        name {
          localized
        }
      }
    }
    advancementReferenceFallbackWorkEmail
    advancementReferenceFallbackName
    advancementReferenceFallbackClassification {
      group
      level
    }
    advancementReferenceFallbackDepartment {
      name {
        localized
      }
    }
  }
`);

// util wrapper to handle nulls
function formatMaybeClassificationString(
  param: Parameters<typeof formatClassificationString>[0] | null | undefined,
) {
  if (param == null) {
    return null;
  }
  return formatClassificationString(param);
}

interface TalentNominationAccordionItemProps {
  query: FragmentType<typeof TalentNominationAccordionItem_Fragment>;
}

const TalentNominationAccordionItem = ({
  query,
  ...rest
}: TalentNominationAccordionItemProps) => {
  const intl = useIntl();
  const talentNomination = getFragment(
    TalentNominationAccordionItem_Fragment,
    query,
  );

  const advancementStatusDescription = talentNomination.nominateForAdvancement
    ? defineMessage({
        defaultMessage: "Advancement<hidden> nomination accepted</hidden>",
        id: "BPNvxn",
        description:
          "Status description when the nomination includes the advancement option",
      })
    : defineMessage({
        defaultMessage: "Advancement<hidden> nomination declined</hidden>",
        id: "gtm9Tl",
        description:
          "Status description when the nomination doest not include the advancement option",
      });

  const lateralMovementStatusDescription =
    talentNomination.nominateForLateralMovement
      ? defineMessage({
          defaultMessage:
            "Lateral movement<hidden> nomination accepted</hidden>",
          id: "kvk5vt",
          description:
            "Status description when the nomination includes the lateral movement option",
        })
      : defineMessage({
          defaultMessage:
            "Lateral movement<hidden> nomination declined</hidden>",
          id: "2VqFMs",
          description:
            "Status description when the nomination doest not include the lateral movement option",
        });

  const developmentProgramsStatusDescription =
    talentNomination.nominateForDevelopmentPrograms
      ? defineMessage({
          defaultMessage:
            "Development programs<hidden> nomination accepted</hidden>",
          id: "13C3j8",
          description:
            "Status description when the nomination includes the development programs option",
        })
      : defineMessage({
          defaultMessage:
            "Development programs<hidden> nomination declined</hidden>",
          id: "DRrUMl",
          description:
            "Status description when the nomination doest not include the development programs option",
        });

  const advancementReferenceIsAUser = !!talentNomination.advancementReference;

  return (
    <Accordion.Item value={talentNomination.id} {...rest}>
      <Accordion.Trigger>
        {intl.formatMessage(
          {
            defaultMessage: "Nominated by {name}",
            id: "9SSreE",
            description: "Nomination group accordion trigger title ",
          },
          {
            name: getFullNameLabel(
              talentNomination.nominator?.firstName,
              talentNomination.nominator?.lastName,
              intl,
            ),
          },
        )}
      </Accordion.Trigger>
      <Accordion.MetaData
        metadata={[
          {
            key: "nominateForAdvancement",
            type: "status_item",
            label: intl.formatMessage(advancementStatusDescription),
            status: talentNomination.nominateForAdvancement
              ? "selected"
              : "declined",
          },
          {
            key: "nominateForLateralMovement",
            type: "status_item",
            label: intl.formatMessage(lateralMovementStatusDescription),
            status: talentNomination.nominateForLateralMovement
              ? "selected"
              : "declined",
          },
          {
            key: "nominateForDevelopmentPrograms",
            type: "status_item",
            label: intl.formatMessage(developmentProgramsStatusDescription),
            status: talentNomination.nominateForDevelopmentPrograms
              ? "selected"
              : "declined",
          },
        ]}
      />
      <Accordion.Content>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1)"
          data-h2-padding-top="base(x.5)"
        >
          {/* fields only rendered if nominated for advancement */}
          {talentNomination.nominateForAdvancement ? (
            <Accordion.Root mode="simple" type="multiple">
              <Accordion.Item value="Secondary reference for advancement">
                <Accordion.Trigger
                  subtitle={intl.formatMessage({
                    defaultMessage:
                      "A nomination for advancement requires that the nominator provide a secondary reference. If the reference’s work email matched a profile on the platform, we used their most recent information. If we couldn’t find a match, the nominator provided basic contact information.",
                    id: "veMhwl",
                    description: "Trigger subtitle for advancement reference",
                  })}
                >
                  {intl.formatMessage({
                    defaultMessage: "Secondary reference for advancement",
                    id: "Lwz/VQ",
                    description: "Trigger title for advancement reference",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <div
                    data-h2-display="base(grid)"
                    data-h2-gap="base(x1)"
                    data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
                    data-h2-padding-top="base(x.5)"
                  >
                    <FieldDisplay
                      label={intl.formatMessage(formMessages.referenceName)}
                    >
                      {(advancementReferenceIsAUser
                        ? getFullNameLabel(
                            talentNomination.advancementReference?.firstName,
                            talentNomination.advancementReference?.lastName,
                            intl,
                          )
                        : talentNomination.advancementReferenceFallbackName) ??
                        intl.formatMessage(commonMessages.notFound)}
                    </FieldDisplay>
                    <FieldDisplay
                      label={intl.formatMessage(
                        formMessages.referenceWorkEmail,
                      )}
                    >
                      {(advancementReferenceIsAUser
                        ? talentNomination.advancementReference?.workEmail
                        : talentNomination.advancementReferenceFallbackWorkEmail) ??
                        intl.formatMessage(commonMessages.notFound)}
                    </FieldDisplay>
                    <FieldDisplay
                      label={intl.formatMessage(
                        formMessages.referenceClassification,
                      )}
                    >
                      {(advancementReferenceIsAUser
                        ? intl.formatMessage(commonMessages.notFound) // TODO
                        : formatMaybeClassificationString(
                            talentNomination.advancementReferenceFallbackClassification,
                          )) ?? intl.formatMessage(commonMessages.notFound)}
                    </FieldDisplay>
                    <FieldDisplay
                      label={intl.formatMessage(
                        formMessages.referenceDepartment,
                      )}
                    >
                      {(advancementReferenceIsAUser
                        ? talentNomination.advancementReference?.department
                            ?.name.localized
                        : talentNomination
                            .advancementReferenceFallbackDepartment?.name
                            .localized) ??
                        intl.formatMessage(commonMessages.notFound)}
                    </FieldDisplay>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          ) : null}
          <p>Lateral movement options</p>
          <p>Development program recommendations</p>
          <p>Rationale</p>
          <p>Top 3 key leadership competencies</p>
          <p>Additional comments</p>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default TalentNominationAccordionItem;
