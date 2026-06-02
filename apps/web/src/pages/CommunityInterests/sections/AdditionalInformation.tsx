import { useIntl } from "react-intl";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";
import { useFormContext } from "react-hook-form";
import { useEffect, useId } from "react";

import { Heading } from "@gc-digital-talent/ui";
import {
  Checkbox,
  Checklist,
  Input,
  localizedEnumToOptions,
  TextArea,
} from "@gc-digital-talent/forms";
import { errorMessages, getLocale } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  FinanceChiefRole,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import type { FormValues } from "../form";

const TEXT_AREA_MAX_WORDS_EN = 100;
const TEXT_AREA_MAX_WORDS_FR = Math.round(
  TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD,
);

const AdditionalInformationOptions_Fragment = graphql(/* GraphQL */ `
  fragment AdditionalInformationOptions_Fragment on Query {
    communityInterestAdditionalDuties: localizedEnumStrings(
      enumName: "CommunityInterestAdditionalDuty"
    ) {
      value
      label {
        en
        fr
      }
    }
    financeChiefRoles: localizedEnumStrings(enumName: "FinanceChiefRole") {
      value
      label {
        en
        fr
      }
    }
    communities {
      id
      key
    }
  }
`);

export interface SubformValues {
  financeIsChief: boolean | null;
  communityInterestAdditionalDuties: string[] | null;
  financeOtherRoles: string[] | null;
  financeOtherRolesOther: string | null;
  additionalInformation: string | null;
  procurementIsSDO: boolean | null;
}

interface AdditionalInformationProps {
  optionsQuery: FragmentType<typeof AdditionalInformationOptions_Fragment>;
  formDisabled: boolean;
}

const AdditionalInformation = ({
  optionsQuery,
  formDisabled,
}: AdditionalInformationProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const communityInterestAdditionalDuties = useId();
  const financeOtherRolesDescription = useId();
  const optionsData = getFragment(
    AdditionalInformationOptions_Fragment,
    optionsQuery,
  );

  const { watch, resetField } = useFormContext<FormValues>();
  const [
    selectedCommunityId,
    selectedFinanceIsChief,
    selectedFinanceOtherRoles,
    selectedProcurementIsSDO,
  ] = watch([
    "communityId",
    "financeIsChief",
    "financeOtherRoles",
    "procurementIsSDO",
  ]);

  useEffect(() => {
    const resetDirtyField = (
      name: keyof FormValues,
      defaultValue: null | string[],
    ) => {
      resetField(name, { keepDirty: false, defaultValue });
    };

    // if not a finance chief then clear all finance fields
    if (!selectedFinanceIsChief) {
      resetDirtyField("financeOtherRoles", []);
      resetDirtyField("financeOtherRolesOther", null);
    }

    // if not a finance OR procurement then clear additional duties
    if (!selectedFinanceIsChief && !selectedProcurementIsSDO) {
      resetDirtyField("communityInterestAdditionalDuties", []);
    }

    // if the "other" role is not selected then clear the other role input
    if (
      !Array.isArray(selectedFinanceOtherRoles) ||
      !selectedFinanceOtherRoles.includes(FinanceChiefRole.Other)
    ) {
      resetDirtyField("financeOtherRolesOther", null);
    }
  }, [
    resetField,
    selectedFinanceIsChief,
    selectedFinanceOtherRoles,
    selectedProcurementIsSDO,
  ]);

  // some fields are community conditional
  const financeCommunityId = optionsData.communities.find(
    (c) => c?.key === "finance",
  )?.id;
  const procurementCommunityId = optionsData.communities.find(
    (c) => c?.key === "procurement",
  )?.id;

  const wordLimits = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: TEXT_AREA_MAX_WORDS_FR,
  } as const;

  return (
    <div className="flex flex-col gap-7.5">
      {/* heading and description */}
      <div className="flex flex-col gap-6">
        <Heading
          level="h2"
          icon={ClipboardDocumentCheckIcon}
          color="primary"
          className="mt-0 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Additional information",
            id: "JFFBhZ",
            description: "Heading for the 'Additional information' section",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "In some cases, a functional community might have domain-specific questions that will help them better understand how you fit into roles within that community. This section also provides you with an opportunity to describe any other relevant information you might want to offer about yourself or your fit.",
            id: "YiC/Xi",
            description: "Description of the 'Additional information' section",
          })}
        </p>
      </div>
      {/* form */}
      <div className="flex flex-col gap-6">
        {/* Some fields only appear if the interest is for the finance community */}
        {selectedCommunityId === financeCommunityId ? (
          <>
            <Checkbox
              id="financeIsChief"
              name="financeIsChief"
              label={intl.formatMessage({
                defaultMessage: "I'm a Chief Financial Officer (CFO).",
                id: "duKO+o",
                description: "Message when user is a finance chief",
              })}
              disabled={formDisabled}
              boundingBox={true}
              boundingBoxLabel={intl.formatMessage({
                defaultMessage: "CFO status",
                id: "2KQdGz",
                description:
                  "Bounding box label for the finance chief checkbox",
              })}
            />
            {/* Some fields only appear if the user is a chief */}
            {selectedFinanceIsChief === true ? (
              <>
                <p id={communityInterestAdditionalDuties}>
                  {intl.formatMessage({
                    defaultMessage:
                      "Please indicate if you perform any of the following additional duties in your CFO role.",
                    id: "DQ2DKZ",
                    description:
                      "Description for the 'Additional duties' checkbox group",
                  })}
                </p>
                <Checklist
                  idPrefix="communityInterestAdditionalDuties"
                  name="communityInterestAdditionalDuties"
                  legend={intl.formatMessage({
                    defaultMessage: "Additional duties",
                    id: "E32ToC",
                    description:
                      "Label for additional duties of a finance chief",
                  })}
                  items={localizedEnumToOptions(
                    optionsData.communityInterestAdditionalDuties,
                    intl,
                  )}
                  disabled={formDisabled}
                  aria-describedby={communityInterestAdditionalDuties}
                />
                <p id={financeOtherRolesDescription}>
                  {intl.formatMessage({
                    defaultMessage:
                      "Please indicate if you also occupy any of the following roles.",
                    id: "t1JWwl",
                    description:
                      "Description for the 'other roles' checkbox group",
                  })}
                </p>
                <Checklist
                  idPrefix="financeOtherRoles"
                  name="financeOtherRoles"
                  legend={intl.formatMessage({
                    defaultMessage: "Other roles",
                    id: "z20NMR",
                    description: "Label for other roles of a finance chief",
                  })}
                  items={localizedEnumToOptions(
                    optionsData.financeChiefRoles,
                    intl,
                  )}
                  disabled={formDisabled}
                  aria-describedby={financeOtherRolesDescription}
                />
                {/* Other position input only appears if the user selects "Other" in the other roles checklist */}
                {Array.isArray(selectedFinanceOtherRoles) &&
                selectedFinanceOtherRoles.includes(FinanceChiefRole.Other) ? (
                  <Input
                    id="financeOtherRolesOther"
                    name="financeOtherRolesOther"
                    type="text"
                    label={intl.formatMessage({
                      defaultMessage:
                        "Other senior designated official (SDO) position",
                      id: "q8ztSV",
                      description: "Label for the 'Other role' input",
                    })}
                    disabled={formDisabled}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
        {/* Some fields only appear if the interest is for the procurement community */}
        {selectedCommunityId === procurementCommunityId ? (
          <>
            <Checkbox
              id="procurementIsSDO"
              name="procurementIsSDO"
              label={intl.formatMessage({
                defaultMessage:
                  "I am currently in a Senior Designated Official role",
                id: "+2vO9m",
                description:
                  "Message when user is a Senior Designated Official",
              })}
              disabled={formDisabled}
              boundingBox={true}
              boundingBoxLabel={intl.formatMessage({
                defaultMessage: "Senior Designated Official (SDO) role",
                id: "U1GjYG",
                description: "Bounding box label for the SDO checkbox",
              })}
            />
            {/* Some fields only appear if the user is an SDO */}
            {selectedProcurementIsSDO === true ? (
              <>
                <p id={communityInterestAdditionalDuties}>
                  {intl.formatMessage({
                    defaultMessage:
                      "Please indicate if you perform any of the following additional duties in your SDO role.",
                    id: "eO6RfE",
                    description:
                      "Description for additional duties referencing a Senior Designated Official (SDO) role",
                  })}
                </p>
                <Checklist
                  idPrefix="communityInterestAdditionalDuties"
                  name="communityInterestAdditionalDuties"
                  legend={intl.formatMessage({
                    defaultMessage: "Additional duties",
                    id: "E32ToC",
                    description:
                      "Label for additional duties of a finance chief",
                  })}
                  items={localizedEnumToOptions(
                    optionsData.communityInterestAdditionalDuties,
                    intl,
                  )}
                  disabled={formDisabled}
                  aria-describedby={communityInterestAdditionalDuties}
                />
              </>
            ) : null}
          </>
        ) : null}
        <TextArea
          id="additionalInformation"
          name="additionalInformation"
          label={intl.formatMessage({
            defaultMessage: "Additional information",
            id: "i37tmL",
            description:
              "Description for a form input for adding Additional information",
          })}
          wordLimit={wordLimits[locale]}
          disabled={formDisabled}
        />
      </div>
    </div>
  );
};

export default AdditionalInformation;
