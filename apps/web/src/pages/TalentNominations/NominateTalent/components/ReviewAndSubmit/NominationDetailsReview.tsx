import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import messages from "../../messages";
import ReviewHeading from "./ReviewHeading";

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

  const referenceClassification =
    talentNomination?.advancementReference?.classification ??
    talentNomination?.advancementReferenceFallbackClassification;
  const referenceDepartment =
    talentNomination?.advancementReference?.department ??
    talentNomination?.advancementReferenceFallbackDepartment;

  let lateralMoveOptions: ListItem[] = unpackMaybes(
    talentNomination?.lateralMovementOptions,
  ).map((option) => ({
    key: option.value,
    name: option.label.localized ?? "",
  }));
  if (talentNomination?.lateralMovementOptionsOther) {
    lateralMoveOptions = [
      ...lateralMoveOptions,
      {
        key: "laterMoveOptionsOther",
        name: talentNomination.lateralMovementOptionsOther,
      },
    ];
  }

  let developmentPrograms: ListItem[] = unpackMaybes(
    talentNomination?.developmentPrograms,
  ).map((program) => ({
    key: program.id,
    name: program.name?.localized ?? "",
  }));
  if (talentNomination?.developmentProgramOptionsOther) {
    developmentPrograms = [
      ...developmentPrograms,
      {
        key: "developmentProgramsOther",
        name: talentNomination.developmentProgramOptionsOther,
      },
    ];
  }

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
          label={intl.formatMessage({
            defaultMessage: "Your role",
            description: "Label for submitters role in a nomination",
            id: "CKofej",
          })}
        ></FieldDisplay>
      </div>
    </>
  );
};

export default NominationDetailsReview;
