import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { useCallback, useEffect } from "react";

import {
  FragmentType,
  getFragment,
  graphql,
  Maybe,
  Scalars,
  TalentNominationNomineeRelationshipToNominator,
  TalentNominationStep,
  TalentNominationUserReview,
} from "@gc-digital-talent/graphql";
import { errorMessages } from "@gc-digital-talent/i18n";
import {
  Input,
  localizedEnumToOptions,
  RadioGroup,
} from "@gc-digital-talent/forms";

import EmployeeSearchInput from "~/components/EmployeeSearchInput/EmployeeSearchInput";
import { fragmentToEmployee } from "~/components/EmployeeSearchInput/utils";

import { BaseFormValues } from "../types";
import useCurrentStep from "../useCurrentStep";
import UpdateForm, { SubmitDataTransformer } from "./UpdateForm";
import SubHeading from "./SubHeading";
import messages from "../messages";
import EmployeeSearchWell from "./EmployeeSearchWell";

interface FormValues extends BaseFormValues {
  nominee: Scalars["UUID"]["input"];
  nomineeReview: TalentNominationUserReview;
  nomineeRelationshipToNominator: TalentNominationNomineeRelationshipToNominator;
  nomineeRelationshipToNominatorOther?: Maybe<string>;
}

const NomineeFieldOptions_Fragment = graphql(/* GraphQL */ `
  fragment NomineeFieldOptions on Query {
    nomineeReviewOptions: localizedEnumStrings(
      enumName: "TalentNominationUserReview"
    ) {
      value
      label {
        localized
      }
    }

    relationshipToNominatorOptions: localizedEnumStrings(
      enumName: "TalentNominationNomineeRelationshipToNominator"
    ) {
      value
      label {
        localized
      }
    }
  }
`);

type NomineeOptionsFragmentType = FragmentType<
  typeof NomineeFieldOptions_Fragment
>;

interface NomineeFieldsProps {
  optionsQuery?: NomineeOptionsFragmentType;
}

const NomineeFields = ({ optionsQuery }: NomineeFieldsProps) => {
  const intl = useIntl();
  const { watch, resetField: baseReset } = useFormContext<FormValues>();
  const [nominee, relationship] = watch([
    "nominee",
    "nomineeRelationshipToNominator",
  ]);

  const resetField = useCallback(
    (name: keyof FormValues) =>
      baseReset(name, { defaultValue: null, keepDirty: false }),
    [baseReset],
  );

  useEffect(() => {
    if (relationship !== TalentNominationNomineeRelationshipToNominator.Other) {
      resetField("nomineeRelationshipToNominatorOther");
    }
  }, [relationship, resetField]);

  if (!nominee) return null;

  const options = getFragment(NomineeFieldOptions_Fragment, optionsQuery);

  return (
    <>
      <EmployeeSearchWell />
      <RadioGroup
        idPrefix="nomineeReview"
        id="nomineeReview"
        name="nomineeReview"
        trackUnsaved={false}
        legend={intl.formatMessage({
          defaultMessage: "Review incorrect or out of date information",
          id: "dDdsk2",
          description: "Label for review of nominee information",
        })}
        rules={{ required: intl.formatMessage(errorMessages.required) }}
        items={localizedEnumToOptions(options?.nomineeReviewOptions, intl, [
          TalentNominationUserReview.Correct,
          TalentNominationUserReview.Incorrect,
          TalentNominationUserReview.OutOfDate,
        ])}
      />
      <RadioGroup
        idPrefix="nomineeRelationshipToNominator"
        id="nomineeRelationshipToNominator"
        name="nomineeRelationshipToNominator"
        trackUnsaved={false}
        legend={intl.formatMessage({
          defaultMessage: "Nominee's relationship to nominator",
          id: "aYyceB",
          description:
            "Label for the nominee's relation to the person nominating them",
        })}
        rules={{ required: intl.formatMessage(errorMessages.required) }}
        items={localizedEnumToOptions(
          options?.relationshipToNominatorOptions,
          intl,
          [
            TalentNominationNomineeRelationshipToNominator.CurrentEmployee,
            TalentNominationNomineeRelationshipToNominator.FormerEmployee,
            TalentNominationNomineeRelationshipToNominator.AnotherWorkEmployee,
            TalentNominationNomineeRelationshipToNominator.Mentee,
            TalentNominationNomineeRelationshipToNominator.Other,
          ],
        )}
      />
      {relationship ===
        TalentNominationNomineeRelationshipToNominator.Other && (
        <Input
          type="text"
          name="nomineeRelationshipToNominatorOther"
          id="nomineeRelationshipToNominatorOther"
          trackUnsaved={false}
          label={intl.formatMessage({
            defaultMessage: "Other relationship",
            id: "vIzha1",
            description:
              "Label for the text input for an other relationship not listed",
          })}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      )}
    </>
  );
};

const NominateTalentNominee_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentNominee on TalentNomination {
    id
    nominee {
      id
      ...EmployeeSearchResult
    }
    nomineeReview {
      value
    }
    nomineeRelationshipToNominator {
      value
    }
    nomineeRelationshipToNominatorOther
  }
`);

const transformSubmitData: SubmitDataTransformer<FormValues> = (values) => {
  return {
    nominee: { connect: values.nominee },
    nomineeReview: values.nomineeReview,
    nomineeRelationshipToNominator: values.nomineeRelationshipToNominator,
    nomineeRelationshipToNominatorOther:
      values.nomineeRelationshipToNominatorOther ?? null,
  };
};

interface NomineeProps extends NomineeFieldsProps {
  nomineeQuery: FragmentType<typeof NominateTalentNominee_Fragment>;
}

const Nominee = ({ nomineeQuery, optionsQuery }: NomineeProps) => {
  const intl = useIntl();
  const { current } = useCurrentStep();
  const talentNomination = getFragment(
    NominateTalentNominee_Fragment,
    nomineeQuery,
  );

  if (current !== TalentNominationStep.NomineeInformation) {
    return null;
  }

  return (
    <UpdateForm<FormValues>
      submitDataTransformer={transformSubmitData}
      defaultValues={{
        nominee: talentNomination.nominee?.id,
        nomineeReview: talentNomination.nomineeReview?.value,
        nomineeRelationshipToNominator:
          talentNomination.nomineeRelationshipToNominator?.value,
        nomineeRelationshipToNominatorOther:
          talentNomination.nomineeRelationshipToNominatorOther ?? "",
      }}
    >
      <SubHeading level="h2" icon={UserCircleIcon}>
        {intl.formatMessage(messages.nomineeInfo)}
      </SubHeading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Now that we know a little about who is submitting the nomination, let’s collect some information about the nominee. We'll start by checking if they have a GC Digital Talent account using their work email.",
          id: "BG9koi",
          description: "Subtitle for nomination nominee step",
        })}
      </p>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <EmployeeSearchInput
          id="nominee"
          name="nominee"
          label={intl.formatMessage({
            defaultMessage: "Search nominee's work email",
            id: "Ax4fN+",
            description: "Label for search nominee input field on a nomination",
          })}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          employeeOption={fragmentToEmployee(talentNomination.nominee)}
          searchMessageCase="base"
          errorMessages={{
            NO_PROFILE: {
              body: intl.formatMessage({
                defaultMessage:
                  "It appears that this work email address isn't linked to a profile. We require nominees to have a GC Digital Talent account in order to be nominated. Please contact the nominee and ask them to create a profile before continuing.",
                id: "/eyJbp",
                description:
                  "Body of the error message when the profile of a nominee cannot be found",
              }),
            },
          }}
        />
        <NomineeFields optionsQuery={optionsQuery} />
      </div>
    </UpdateForm>
  );
};

export default Nominee;
