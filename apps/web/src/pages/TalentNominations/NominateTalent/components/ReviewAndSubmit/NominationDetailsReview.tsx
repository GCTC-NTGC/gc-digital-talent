import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Ul } from "@gc-digital-talent/ui";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import { getFullNameLabel } from "~/utils/nameUtils";
import { stringifyGroupLevel } from "~/utils/classification";

import messages from "../../messages";
import ReviewHeading from "./ReviewHeading";
import labels from "../../labels";

interface ListItem {
  key: string;
  name: string;
}

const NominationDetailsReview_Fragment = graphql(/* GraphQL */ `
  fragment NominationDetailsReview on TalentNomination {
    # Nomination types
    nominateForAdvancement
    nominateForLateralMovement
    nominateForDevelopmentPrograms

    # Advancement details
    advancementReference {
      firstName
      lastName
      workEmail
      department {
        name {
          localized
        }
      }
      classification {
        group
        level
      }
    }
    advancementReferenceFallbackName
    advancementReferenceFallbackWorkEmail
    advancementReferenceFallbackDepartment {
      name {
        localized
      }
    }
    advancementReferenceFallbackClassification {
      group
      level
    }

    # Lateral movement details
    lateralMovementOptionsOther
    lateralMovementOptions {
      value
      label {
        localized
      }
    }

    # Development program details
    developmentProgramOptionsOther
    developmentPrograms {
      id
      name {
        localized
      }
    }
  }
`);

interface NominationDetailsReviewProps {
  detailsQuery?: FragmentType<typeof NominationDetailsReview_Fragment>;
}

const NominationDetailsReview = ({
  detailsQuery,
}: NominationDetailsReviewProps) => {
  const intl = useIntl();
  const talentNomination = getFragment(
    NominationDetailsReview_Fragment,
    detailsQuery,
  );

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  let types: ListItem[] = [];
  if (talentNomination?.nominateForAdvancement) {
    types = [
      {
        key: "nominationForAdvacement",
        name: intl.formatMessage(labels.advancement),
      },
    ];
  }
  if (talentNomination?.nominateForLateralMovement) {
    types = [
      ...types,
      {
        key: "nominationForLateralMovement",
        name: intl.formatMessage(labels.lateralMovement),
      },
    ];
  }
  if (talentNomination?.nominateForDevelopmentPrograms) {
    types = [
      ...types,
      {
        key: "nominationForDevelopmentPrograms",
        name: intl.formatMessage(labels.developmentProgram),
      },
    ];
  }

  let referenceName =
    talentNomination?.advancementReferenceFallbackName ?? notProvided;
  if (talentNomination?.advancementReference) {
    referenceName = getFullNameLabel(
      talentNomination.advancementReference.firstName,
      talentNomination.advancementReference.lastName,
      intl,
    );
  }

  const referenceClassification =
    talentNomination?.advancementReference?.classification ??
    talentNomination?.advancementReferenceFallbackClassification;
  const referenceDepartment =
    talentNomination?.advancementReference?.department ??
    talentNomination?.advancementReferenceFallbackDepartment;

  const lateralMoveOptions: ListItem[] = unpackMaybes(
    talentNomination?.lateralMovementOptions,
  ).map((option) => ({
    key: option.value,
    name: option.label.localized ?? "",
  }));

  const developmentPrograms: ListItem[] = unpackMaybes(
    talentNomination?.developmentPrograms,
  ).map((program) => ({
    key: program.id,
    name: program.name?.localized ?? "",
  }));

  return (
    <>
      <ReviewHeading
        link={{
          to: TalentNominationStep.NominationDetails,
          name: intl.formatMessage({
            defaultMessage: "Edit nomination details",
            id: "0r1Pr3",
            description: "Link text to edit a nominations details information",
          }),
        }}
      >
        {intl.formatMessage(messages.nominationDetails)}
      </ReviewHeading>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="base(1fr 1fr)"
        data-h2-gap="base(x1)"
      >
        <FieldDisplay
          data-h2-grid-column="base(span 2)"
          label={intl.formatMessage(labels.nominationOptions)}
        >
          {types.length > 0 ? (
            <Ul unStyled space="sm">
              {types.map((t) => (
                <li key={t.key}>
                  <BoolCheckIcon value>{t.name}</BoolCheckIcon>
                </li>
              ))}
            </Ul>
          ) : (
            notProvided
          )}
        </FieldDisplay>
        {talentNomination?.nominateForAdvancement && (
          <>
            <FieldDisplay label={intl.formatMessage(labels.referencesName)}>
              {referenceName}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(labels.referencesWorkEmail)}
            >
              {talentNomination.advancementReference?.workEmail ??
                talentNomination.advancementReferenceFallbackWorkEmail ??
                notProvided}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Reference's classification",
                id: "bCZOr9",
                description:
                  "Label for the advancement referece classification",
              })}
            >
              {referenceClassification
                ? stringifyGroupLevel(
                    referenceClassification.group,
                    referenceClassification.level,
                  )
                : notProvided}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(labels.referencesDepartment)}
            >
              {referenceDepartment?.name?.localized ?? notProvided}
            </FieldDisplay>
          </>
        )}
        {talentNomination?.nominateForLateralMovement && (
          <>
            {lateralMoveOptions.length > 0 && (
              <FieldDisplay
                data-h2-grid-column="base(span 2)"
                label={intl.formatMessage(labels.lateralMovementOptions)}
              >
                <Ul unStyled space="sm">
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
                data-h2-grid-column="base(span 2)"
                label={intl.formatMessage(labels.otherLateralMovement)}
              >
                {talentNomination.lateralMovementOptionsOther}
              </FieldDisplay>
            )}
          </>
        )}
        {talentNomination?.nominateForDevelopmentPrograms && (
          <>
            {developmentPrograms.length > 0 && (
              <FieldDisplay
                data-h2-grid-column="base(span 2)"
                label={intl.formatMessage({
                  defaultMessage: "Development program recommendations",
                  id: "DHIa69",
                  description: "Label for selected development program items",
                })}
              >
                <Ul unStyled space="sm">
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
                data-h2-grid-column="base(span 2)"
                label={intl.formatMessage(labels.otherDevelopmentProgram)}
              >
                {talentNomination.developmentProgramOptionsOther}
              </FieldDisplay>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default NominationDetailsReview;
