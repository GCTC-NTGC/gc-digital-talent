import { useState } from "react";
import { useIntl } from "react-intl";

import { toast } from "@gc-digital-talent/toast";
import { Well, Heading, Accordion, Loading } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  LocalizedIndigenousCommunity,
  Maybe,
  UpdateUserAsUserInput,
} from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";

import EquityOption from "./EquityOption";
import type { EquityKeys, UserMutationPromise } from "./types";
import IndigenousEquityOption from "./IndigenousEquityOption";

interface EquityOptionsProps {
  hasDisability?: Maybe<boolean>;
  indigenousCommunities?: Maybe<Maybe<LocalizedIndigenousCommunity>[]>;
  indigenousDeclarationSignature?: Maybe<string>;
  isVisibleMinority?: Maybe<boolean>;
  isWoman?: Maybe<boolean>;
  isDisabled?: boolean;
  onAdd: (key: EquityKeys) => UserMutationPromise;
  onRemove: (key: EquityKeys) => UserMutationPromise;
  onUpdate: (data: UpdateUserAsUserInput) => UserMutationPromise;
  inApplication: boolean;
}

const resolveMaybe = (value: Maybe<boolean> | undefined): boolean => !!value;
const resolveMaybeArray = <T,>(
  value: Maybe<(Maybe<T> | undefined)[]> | undefined,
): T[] => {
  return value?.filter(notEmpty) ?? [];
};

type AccordionItems = "available_options" | "";

const EquityOptions = ({
  hasDisability,
  indigenousCommunities,
  indigenousDeclarationSignature,
  isVisibleMinority,
  isWoman,
  onAdd,
  onRemove,
  onUpdate,
  isDisabled,
  inApplication,
}: EquityOptionsProps) => {
  const intl = useIntl();
  const [accordionOpen, setAccordionOpen] = useState<AccordionItems>(""); // Start with accordion closed

  const resolvedDisability = resolveMaybe(hasDisability);
  const resolvedIndigenousCommunities = resolveMaybeArray(
    indigenousCommunities,
  );
  const resolvedMinority = resolveMaybe(isVisibleMinority);
  const resolvedWoman = resolveMaybe(isWoman);

  const isIndigenous = resolvedIndigenousCommunities.length > 0;

  const hasItems =
    resolvedDisability || isIndigenous || resolvedMinority || resolvedWoman;

  const itemsAvailable =
    !resolvedDisability || !isIndigenous || !resolvedMinority || !resolvedWoman;

  const countRemainingOptions = [
    resolvedDisability,
    isIndigenous,
    resolvedMinority,
    resolvedWoman,
  ].filter((option) => {
    return !option;
  }).length;

  const handleOptionSave = async (key: EquityKeys, value: boolean) => {
    const handler = value ? onAdd : onRemove;
    return handler(key)
      .then((response) => {
        if (response) {
          toast.success(
            intl.formatMessage({
              defaultMessage:
                "Diversity, equity, and inclusion information updated successfully!",
              id: "LCVNJq",
              description:
                "Message displayed when a user successfully updates their diversity, equity, and inclusion information.",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  const handleError = () => {
    toast.error(intl.formatMessage(profileMessages.updatingFailed));
  };

  const handleMultipleFieldSave = async (data: UpdateUserAsUserInput) => {
    return onUpdate(data)
      .then((res) => {
        if (res) toast.success(intl.formatMessage(profileMessages.userUpdated));
        else {
          handleError();
        }
      })
      .catch(handleError);
  };

  return (
    <>
      <Heading
        className="mt-12 mb-6"
        level={inApplication ? "h4" : "h3"}
        size={inApplication ? "h6" : "h4"}
      >
        {intl.formatMessage({
          defaultMessage: "Your equity options",
          id: "6Ji7g2",
          description:
            "Title for the subsection for viewing/selecting employment equity",
        })}
      </Heading>
      {isDisabled && (
        <div className="fixed -inset-6 top-12 z-[2] flex items-center justify-center bg-white dark:bg-gray-600">
          <Loading inline>
            {intl.formatMessage(commonMessages.searching)}
          </Loading>
        </div>
      )}
      {hasItems ? (
        <div className="grid gap-3">
          {isIndigenous && (
            <IndigenousEquityOption
              disabled={isDisabled}
              option="indigenous"
              indigenousCommunities={resolvedIndigenousCommunities}
              signature={indigenousDeclarationSignature ?? undefined}
              onSave={(newValues) => handleMultipleFieldSave(newValues)}
              title={intl.formatMessage(
                getEmploymentEquityStatement("indigenous"),
              )}
            />
          )}
          {hasDisability && (
            <EquityOption
              disabled={isDisabled}
              option="disability"
              isAdded={resolvedDisability}
              onSave={(newValue) => handleOptionSave("hasDisability", newValue)}
              title={intl.formatMessage(
                getEmploymentEquityStatement("disability"),
              )}
            />
          )}
          {isVisibleMinority && (
            <EquityOption
              disabled={isDisabled}
              option="minority"
              isAdded={resolvedMinority}
              onSave={(newValue) =>
                handleOptionSave("isVisibleMinority", newValue)
              }
              title={intl.formatMessage(
                getEmploymentEquityStatement("minority"),
              )}
            />
          )}
          {isWoman && (
            <EquityOption
              disabled={isDisabled}
              option="woman"
              isAdded={resolvedWoman}
              onSave={(newValue) => handleOptionSave("isWoman", newValue)}
              title={intl.formatMessage(getEmploymentEquityStatement("woman"))}
            />
          )}
        </div>
      ) : (
        <Well>
          <p className="text-center">
            {intl.formatMessage({
              defaultMessage:
                "You haven't added any equity options to your profile.",
              id: "a6FJwN",
              description:
                "Message when user has not selected as being in any employment equity groups.",
            })}
          </p>
        </Well>
      )}
      <Accordion.Root
        type="single"
        value={accordionOpen}
        onValueChange={(value: AccordionItems) => setAccordionOpen(value)}
        collapsible
      >
        <Accordion.Item value="available_options" className="pt-6">
          <Accordion.Trigger as="h4">
            {accordionOpen
              ? intl.formatMessage(
                  {
                    defaultMessage:
                      "Hide available equity options ({optionCount})",
                    id: "i+C29d",
                    description:
                      "Heading for closing the accordion with available employment equity options.",
                  },
                  {
                    optionCount: countRemainingOptions,
                  },
                )
              : intl.formatMessage(
                  {
                    defaultMessage:
                      "Show available equity options ({optionCount})",
                    id: "OaaW6Y",
                    description:
                      "Heading for opening the accordion with available employment equity options.",
                  },
                  {
                    optionCount: countRemainingOptions,
                  },
                )}
          </Accordion.Trigger>
          <Accordion.Content>
            {itemsAvailable || !hasItems ? (
              <div className="grid gap-3">
                {!isIndigenous ? (
                  <IndigenousEquityOption
                    disabled={isDisabled}
                    option="indigenous"
                    indigenousCommunities={resolvedIndigenousCommunities}
                    signature={indigenousDeclarationSignature ?? undefined}
                    onSave={(newValues) => handleMultipleFieldSave(newValues)}
                    title={intl.formatMessage(
                      getEmploymentEquityGroup("indigenous"),
                    )}
                    description={intl.formatMessage({
                      defaultMessage:
                        '"Indigenous identity refers to whether the person identified with the Indigenous peoples of Canada. This includes those who identify as First Nations (North American Indian), Métis and/or Inuk (Inuit), and/or those who report being Registered or Treaty Indians (that is, registered under the Indian Act of Canada), and/or those who have membership in a First Nation or Indian band. Aboriginal peoples of Canada (referred to here as Indigenous peoples) are defined in the Constitution Act, 1982, Section 35 (2) as including the Indian, Inuit and Métis peoples of Canada."',
                      id: "Is1RHA",
                      description:
                        "Definition of Indigenous identity from the StatsCan 'Indigenous identity of person' page.",
                    })}
                  />
                ) : null}
                {!resolvedDisability && (
                  <EquityOption
                    disabled={isDisabled}
                    option="disability"
                    isAdded={resolvedDisability}
                    onSave={(newValue) =>
                      handleOptionSave("hasDisability", newValue)
                    }
                    title={intl.formatMessage(
                      getEmploymentEquityGroup("disability"),
                    )}
                    description={intl.formatMessage({
                      defaultMessage:
                        '"Refers to a person whose daily activities are limited as a result of an impairment or difficulty with particular tasks. The only exception to this is for developmental disabilities where a person is considered to be disabled if the respondent has been diagnosed with this condition."',
                      id: "aK5Oop",
                      description:
                        "Definition of Person with a disability from the StatsCan 'Classification of Status of Disability' page.",
                    })}
                  />
                )}
                {!resolvedMinority && (
                  <EquityOption
                    disabled={isDisabled}
                    option="minority"
                    isAdded={resolvedMinority}
                    onSave={(newValue) =>
                      handleOptionSave("isVisibleMinority", newValue)
                    }
                    title={intl.formatMessage(
                      getEmploymentEquityGroup("minority"),
                    )}
                    description={intl.formatMessage({
                      defaultMessage:
                        '"Visible minority refers to whether a person is a visible minority or not, as defined by the Employment Equity Act. The Employment Equity Act defines visible minorities as "persons, other than Aboriginal peoples, who are non-Caucasian in race or non-white in colour". The visible minority population consists mainly of the following groups: South Asian, Chinese, Black, Filipino, Arab, Latin American, Southeast Asian, West Asian, Korean and Japanese."',
                      id: "BDrP1l",
                      description:
                        "Definition of Visible minority from the StatsCan 'Visible minority of person' page.",
                    })}
                  />
                )}
                {!resolvedWoman && (
                  <EquityOption
                    disabled={isDisabled}
                    option="woman"
                    isAdded={resolvedWoman}
                    onSave={(newValue) => handleOptionSave("isWoman", newValue)}
                    title={intl.formatMessage(
                      getEmploymentEquityGroup("woman"),
                    )}
                    description={intl.formatMessage({
                      defaultMessage:
                        '"This category includes persons whose reported gender is female. It includes cisgender (cis) and transgender (trans) women."',
                      id: "4rI0Yj",
                      description:
                        "Definition of the Woman category from the StatsCan 'Classification of gender' page.",
                    })}
                  />
                )}
              </div>
            ) : (
              <Well>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "There are no available employment equity options.",
                    id: "px7yu1",
                    description:
                      "Message displayed when there are no employment equity categories available to be added.",
                  })}
                </p>
              </Well>
            )}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
};

export default EquityOptions;
