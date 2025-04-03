import { defineMessage, useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationLateralMovementOption,
} from "@gc-digital-talent/graphql";
import { Accordion } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { localizedEnumToOptions } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getFullNameLabel } from "~/utils/nameUtils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { formatClassificationString } from "~/utils/poolUtils";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

import { formMessages } from "../messages";

const TalentNominationAccordionItemOptions_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationAccordionItemOptions on Query {
    talentNominationLateralMovementOptions: localizedEnumStrings(
      enumName: "TalentNominationLateralMovementOption"
    ) {
      value
      label {
        localized
      }
    }
  }
`);

const TalentNominationAccordionItem_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationAccordionItem on TalentNomination {
    id

    talentNominationEvent {
      developmentPrograms {
        id
        name {
          localized
        }
      }
      includeLeadershipCompetencies
    }

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
      currentClassification {
        group
        level
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

    lateralMovementOptions {
      value
      label {
        localized
      }
    }
    lateralMovementOptionsOther

    developmentPrograms {
      id
      name {
        localized
      }
    }
    developmentProgramOptionsOther

    nominationRationale

    skills {
      id
      name {
        localized
      }
    }

    additionalComments
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
  optionsQuery: FragmentType<
    typeof TalentNominationAccordionItemOptions_Fragment
  >;
}

const TalentNominationAccordionItem = ({
  query,
  optionsQuery,
  ...rest
}: TalentNominationAccordionItemProps) => {
  const intl = useIntl();
  const talentNomination = getFragment(
    TalentNominationAccordionItem_Fragment,
    query,
  );
  const options = getFragment(
    TalentNominationAccordionItemOptions_Fragment,
    optionsQuery,
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

  const lateralMovementOptionValuesInThisNomination =
    talentNomination.lateralMovementOptions?.map((option) => option.value) ??
    [];

  // I don't actually need a set of options but the sort is handy
  const lateralMovementListItems = localizedEnumToOptions(
    options?.talentNominationLateralMovementOptions,
    intl,
    [
      TalentNominationLateralMovementOption.SmallDepartment,
      TalentNominationLateralMovementOption.LargeDepartment,
      TalentNominationLateralMovementOption.CentralDepartment,
      TalentNominationLateralMovementOption.NewDepartment,
      TalentNominationLateralMovementOption.ProgramExperience,
      TalentNominationLateralMovementOption.PolicyExperience,
      TalentNominationLateralMovementOption.Other,
    ],
  ).map((option) => ({
    key: option.value,
    value: lateralMovementOptionValuesInThisNomination.includes(
      option.value as TalentNominationLateralMovementOption,
    ),
    label: option.label,
  }));

  const developmentProgramIdsInThisNomination =
    talentNomination.developmentPrograms?.map((program) => program.id) ?? [];

  const developmentProgramListItems =
    talentNomination.talentNominationEvent.developmentPrograms?.map(
      (program) => ({
        key: program.id,
        value: developmentProgramIdsInThisNomination.includes(program.id),
        label:
          program.name?.localized ??
          intl.formatMessage(commonMessages.notFound),
      }),
    ) ?? [];

  // OTHER is not a real development program so we have to add a fake option
  developmentProgramListItems.push({
    key: "OTHER",
    value: !!talentNomination.developmentProgramOptionsOther,
    label: intl.formatMessage(formMessages.otherOption),
  });

  const skillListItems =
    unpackMaybes(talentNomination.skills).map((skill) => ({
      key: skill.id,
      label:
        skill.name.localized ?? intl.formatMessage(commonMessages.notFound),
    })) ?? [];
  skillListItems.sort();

  return (
    <Accordion.Item value={talentNomination.id} {...rest}>
      <Accordion.Trigger as="h3">
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
                  as="h4"
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

          {/* fields only rendered if nominated for lateral movement */}
          {talentNomination.nominateForLateralMovement ? (
            <Accordion.Root mode="simple" type="multiple">
              <Accordion.Item value="Lateral movement options">
                <Accordion.Trigger
                  as="h4"
                  subtitle={intl.formatMessage({
                    defaultMessage:
                      "A nomination for lateral movement requires the nominator to recommend one or more types of experience for the nominee.",
                    id: "HhL+EB",
                    description: "Trigger subtitle for lateral movement",
                  })}
                >
                  {intl.formatMessage({
                    defaultMessage: "Lateral movement options",
                    id: "ohS7IA",
                    description: "Trigger title for lateral movement",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <div
                    data-h2-display="base(grid)"
                    data-h2-gap="base(x1)"
                    data-h2-grid-template-columns="p-tablet(repeat(1, 1fr))"
                    data-h2-padding-top="base(x.5)"
                  >
                    <FieldDisplay
                      label={intl.formatMessage(
                        formMessages.lateralMovementOptions,
                      )}
                    >
                      {lateralMovementListItems.map((item) => (
                        <li
                          key={item.key}
                          data-h2-display="base(flex)"
                          data-h2-align-items="base(flex-start)"
                          data-h2-gap="base(x.25)"
                          data-h2-margin-bottom="base(x.25)"
                        >
                          <BoolCheckIcon value={item.value}>
                            {item.label}
                          </BoolCheckIcon>
                        </li>
                      ))}
                    </FieldDisplay>
                    {/* only display the OTHER option if it is selected */}
                    {lateralMovementOptionValuesInThisNomination.includes(
                      TalentNominationLateralMovementOption.Other,
                    ) ? (
                      <FieldDisplay
                        label={intl.formatMessage(formMessages.otherOption)}
                      >
                        {talentNomination.lateralMovementOptionsOther ? (
                          <BoolCheckIcon value={true}>
                            {talentNomination.lateralMovementOptionsOther}
                          </BoolCheckIcon>
                        ) : (
                          intl.formatMessage(commonMessages.notFound)
                        )}
                      </FieldDisplay>
                    ) : null}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          ) : null}

          {/* fields only rendered if nominated for development programs */}
          {talentNomination.nominateForDevelopmentPrograms ? (
            <Accordion.Root mode="simple" type="multiple">
              <Accordion.Item value="Development program recommendations">
                <Accordion.Trigger
                  as="h4"
                  subtitle={intl.formatMessage({
                    defaultMessage:
                      "A nomination for development programs requires the nominator to select which of the training and development programs offered by the functional community would benefit the nominee.",
                    id: "x1oBLr",
                    description: "Trigger subtitle for development programs",
                  })}
                >
                  {intl.formatMessage({
                    defaultMessage: "Development program recommendations",
                    id: "nF//P1",
                    description: "Trigger title for development programs",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <div
                    data-h2-display="base(grid)"
                    data-h2-gap="base(x1)"
                    data-h2-grid-template-columns="p-tablet(repeat(1, 1fr))"
                    data-h2-padding-top="base(x.5)"
                  >
                    <FieldDisplay
                      label={intl.formatMessage(
                        formMessages.developmentPrograms,
                      )}
                    >
                      {developmentProgramListItems.map((item) => (
                        <li
                          key={item.key}
                          data-h2-display="base(flex)"
                          data-h2-align-items="base(flex-start)"
                          data-h2-gap="base(x.25)"
                          data-h2-margin-bottom="base(x.25)"
                        >
                          <BoolCheckIcon value={item.value}>
                            {item.label}
                          </BoolCheckIcon>
                        </li>
                      ))}
                    </FieldDisplay>
                    {/* only display the OTHER option if it is selected */}
                    {talentNomination.developmentProgramOptionsOther ? (
                      <FieldDisplay
                        label={intl.formatMessage(formMessages.otherOption)}
                      >
                        <BoolCheckIcon value={true}>
                          {talentNomination.developmentProgramOptionsOther}
                        </BoolCheckIcon>
                      </FieldDisplay>
                    ) : null}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          ) : null}

          <FieldDisplay label={intl.formatMessage(formMessages.rationale)}>
            <p>
              {talentNomination.nominationRationale ??
                intl.formatMessage(commonMessages.notFound)}
            </p>
          </FieldDisplay>

          {/* leadership competencies only displayed if enabled for the event */}
          {talentNomination.talentNominationEvent
            .includeLeadershipCompetencies ? (
            <FieldDisplay
              label={intl.formatMessage(
                formMessages.top3LeadershipCompetencies,
              )}
            >
              {skillListItems.length > 0 ? (
                <ul
                  data-h2-margin-top="base(x.25)"
                  data-h2-margin-bottom="base:children[li:not(:last-child)](x.25)"
                  data-h2-padding-inline-start="base(x1)"
                >
                  {skillListItems.map((skill) => (
                    <li key={skill.key}>{skill.label}</li>
                  ))}
                </ul>
              ) : (
                intl.formatMessage(commonMessages.notFound)
              )}
            </FieldDisplay>
          ) : null}

          <FieldDisplay
            label={intl.formatMessage(formMessages.additionalComments)}
          >
            <p>
              {talentNomination.additionalComments ??
                intl.formatMessage(commonMessages.notFound)}
            </p>
          </FieldDisplay>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default TalentNominationAccordionItem;
