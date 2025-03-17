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
import {
  FinanceChiefRole,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import { FormValues } from "../form";

const TEXT_AREA_MAX_WORDS_EN = 100;
const TEXT_AREA_MAX_WORDS_FR = Math.round(
  TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD,
);

const AdditionalInformationOptions_Fragment = graphql(/* GraphQL */ `
  fragment AdditionalInformationOptions_Fragment on Query {
    financeChiefDuties: localizedEnumStrings(enumName: "FinanceChiefDuty") {
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
  financeAdditionalDuties: string[] | null;
  financeOtherRoles: string[] | null;
  financeOtherRolesOther: string | null;
  additionalInformation: string | null;
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
  const financeAdditionalDutiesDescription = useId();
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
  ] = watch(["communityId", "financeIsChief", "financeOtherRoles"]);

  useEffect(() => {
    const resetDirtyField = (name: keyof FormValues) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };
    if (!selectedFinanceOtherRoles?.includes(FinanceChiefRole.Other)) {
      resetDirtyField("financeOtherRolesOther");
    }
  }, [resetField, selectedFinanceOtherRoles]);

  // some fields are only shown for the finance community
  const financeCommunityId = optionsData.communities.find(
    (c) => c?.key === "finance",
  )?.id;

  const wordLimits = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: TEXT_AREA_MAX_WORDS_FR,
  } as const;

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1.25)"
    >
      {/* heading and description */}
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <Heading
          level="h2"
          data-h2-font-weight="base(400)"
          Icon={ClipboardDocumentCheckIcon}
          color="primary"
          data-h2-margin="base(0)"
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
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        {/* Some fields only appear if the interest is for the finance community */}
        {selectedCommunityId === financeCommunityId ? (
          <>
            <Checkbox
              id="financeIsChief"
              name="financeIsChief"
              label={intl.formatMessage({
                defaultMessage:
                  "I’m a Chief Finance Officer (CFO) or Deputy Chief Finance Officer (DCFO).",
                id: "RWueRJ",
                description: "Message when user is a finance chief",
              })}
              disabled={formDisabled}
              boundingBox={true}
              boundingBoxLabel={intl.formatMessage({
                defaultMessage: "CFO or DCFO status",
                id: "P3LzUb",
                description:
                  "Bounding box label for the finance chief checkbox",
              })}
            />
            {/* Some fields only appear if the user is a chief */}
            {selectedFinanceIsChief === true ? (
              <>
                <p id={financeAdditionalDutiesDescription}>
                  {intl.formatMessage({
                    defaultMessage:
                      "Please indicate if you perform any of the following additional duties in your CDO or DCFO role.",
                    id: "kVmWVW",
                    description:
                      "Description for the 'Additional duties' checkbox group",
                  })}
                </p>
                <Checklist
                  idPrefix="financeAdditionalDuties"
                  name="financeAdditionalDuties"
                  legend={intl.formatMessage({
                    defaultMessage: "Additional duties",
                    id: "E32ToC",
                    description:
                      "Label for additional duties of a finance chief",
                  })}
                  items={localizedEnumToOptions(
                    optionsData.financeChiefDuties,
                    intl,
                  )}
                  disabled={formDisabled}
                  aria-describedby={financeAdditionalDutiesDescription}
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
                {selectedFinanceOtherRoles?.includes(FinanceChiefRole.Other) ? (
                  <Input
                    id="financeOtherRolesOther"
                    name="financeOtherRolesOther"
                    type="text"
                    label={intl.formatMessage({
                      defaultMessage:
                        "Other senior delegated official (SDO) position",
                      id: "qQYO+V",
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
