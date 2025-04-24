import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import uniq from "lodash/uniq";

import {
  localizedEnumToOptions,
  RadioGroup,
  RichTextInput,
} from "@gc-digital-talent/forms";
import { Heading, Well } from "@gc-digital-talent/ui";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationGroupDecision,
  TalentNominationLateralMovementOption,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

import { formMessages as talentNominationGroupMessages } from "../../NominationGroup/messages";
import { formMessages } from "../messages";
import { FormValues } from "../form";

const NominationGroupEvaluationDialogLateralMovementOptions_Fragment = graphql(
  /* GraphQL */ `
    fragment NominationGroupEvaluationDialogLateralMovementOptions on Query {
      talentNominationLateralMovementOptions: localizedEnumStrings(
        enumName: "TalentNominationLateralMovementOption"
      ) {
        value
        label {
          localized
        }
      }
    }
  `,
);

const NominationGroupEvaluationDialogLateralMovement_Fragment = graphql(
  /* GraphQL */ `
    fragment NominationGroupEvaluationDialogLateralMovement on TalentNominationGroup {
      id
      nominations {
        nominateForLateralMovement
        lateralMovementOptions {
          value
          label {
            localized
          }
        }
        lateralMovementOptionsOther
      }
    }
  `,
);

interface LateralMovementSectionProps {
  talentNominationGroupQuery: FragmentType<
    typeof NominationGroupEvaluationDialogLateralMovement_Fragment
  >;
  talentNominationGroupOptionsQuery: FragmentType<
    typeof NominationGroupEvaluationDialogLateralMovementOptions_Fragment
  >;
}

const LateralMovementSection = ({
  talentNominationGroupQuery,
  talentNominationGroupOptionsQuery,
}: LateralMovementSectionProps) => {
  const intl = useIntl();

  const { watch, resetField } = useFormContext<FormValues>();
  const [selectedLateralMovementDecision] = watch(["lateralMovementDecision"]);

  useEffect(() => {
    const resetDirtyField = (
      name: keyof FormValues,
      defaultValue: null | string | boolean,
    ) => {
      resetField(name, { keepDirty: false, defaultValue });
    };

    if (
      selectedLateralMovementDecision !== TalentNominationGroupDecision.Approved
    ) {
      resetDirtyField("lateralMovementNotes", null);
    }

    if (
      selectedLateralMovementDecision !== TalentNominationGroupDecision.Rejected
    ) {
      resetDirtyField("lateralMovementNotes", null);
    }
  }, [resetField, selectedLateralMovementDecision]);

  const talentNominationGroup = getFragment(
    NominationGroupEvaluationDialogLateralMovement_Fragment,
    talentNominationGroupQuery,
  );

  const talentNominationGroupOptions = getFragment(
    NominationGroupEvaluationDialogLateralMovementOptions_Fragment,
    talentNominationGroupOptionsQuery,
  );
  const nominations = talentNominationGroup.nominations ?? [];
  const lateralMovementOptionValuesInThisNominationGroup = nominations
    .filter((n) => n.nominateForLateralMovement)
    .flatMap((n) => n.lateralMovementOptions)
    .map((o) => o?.value)
    .filter(notEmpty);
  // I don't actually need a set of options but the sort is handy
  const lateralMovementListItems = localizedEnumToOptions(
    talentNominationGroupOptions?.talentNominationLateralMovementOptions,
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
    value: lateralMovementOptionValuesInThisNominationGroup.includes(
      option.value as TalentNominationLateralMovementOption,
    ),
    label: option.label,
  }));

  const lateralMovementOptionsOthersWithDuplicates = nominations
    .filter((n) => n.nominateForLateralMovement)
    .map((n) => n.lateralMovementOptionsOther)
    .filter(notEmpty);
  const lateralMovementOptionsOthers = uniq(
    lateralMovementOptionsOthersWithDuplicates,
  );
  lateralMovementOptionsOthers.sort((a, b) => a.localeCompare(b));

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1)"
    >
      <Heading
        level="h3"
        size="h6"
        data-h2-margin="base(0)"
        data-h2-font-weight="base(normal)"
      >
        {intl.formatMessage({
          defaultMessage: "Nomination for lateral movement",
          id: "rPUWP5",
          description: "heading for lateral movement nomination section",
        })}
      </Heading>
      <FieldDisplay
        label={intl.formatMessage(
          talentNominationGroupMessages.lateralMovementOptions,
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
            <BoolCheckIcon value={item.value}>{item.label}</BoolCheckIcon>
          </li>
        ))}
      </FieldDisplay>
      {/* only display the OTHER option if it is selected */}
      {lateralMovementOptionValuesInThisNominationGroup.includes(
        TalentNominationLateralMovementOption.Other,
      ) ? (
        <FieldDisplay label={intl.formatMessage(commonMessages.other)}>
          {lateralMovementOptionsOthers.map((item) => (
            <li
              key={item}
              data-h2-display="base(flex)"
              data-h2-align-items="base(flex-start)"
              data-h2-gap="base(x.25)"
              data-h2-margin-bottom="base(x.25)"
            >
              <BoolCheckIcon value={true}>{item}</BoolCheckIcon>
            </li>
          ))}
        </FieldDisplay>
      ) : null}
      <RadioGroup
        idPrefix="lateralMovementDecision"
        name="lateralMovementDecision"
        legend={intl.formatMessage(
          formMessages.lateralMovementNominationDecisionLabel,
        )}
        items={[
          {
            value: TalentNominationGroupDecision.Approved,
            label: intl.formatMessage(
              formMessages.lateralMovementNominationDecisionApproved,
            ),
          },
          {
            value: TalentNominationGroupDecision.Rejected,
            label: intl.formatMessage(
              formMessages.lateralMovementNominationDecisionRejected,
            ),
          },
        ]}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      {selectedLateralMovementDecision ==
      TalentNominationGroupDecision.Approved ? (
        <RichTextInput
          id="lateralMovementNotes"
          name="lateralMovementNotes"
          label={intl.formatMessage(formMessages.approvalNotes)}
        />
      ) : null}
      {selectedLateralMovementDecision ==
      TalentNominationGroupDecision.Rejected ? (
        <RichTextInput
          id="lateralMovementNotes"
          name="lateralMovementNotes"
          label={intl.formatMessage(formMessages.rejectionNotes)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      ) : null}
      {selectedLateralMovementDecision == null ? (
        <Well data-h2-text-align="base(center)">
          {intl.formatMessage(formMessages.decisionNullState)}
        </Well>
      ) : null}
    </div>
  );
};

export default LateralMovementSection;
