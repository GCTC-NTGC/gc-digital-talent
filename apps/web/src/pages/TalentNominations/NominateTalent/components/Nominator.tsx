import DocumentCheckIcon from "@heroicons/react/24/outline/DocumentCheckIcon";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { useCallback, useEffect } from "react";

import {
  FragmentType,
  getFragment,
  graphql,
  Maybe,
  Scalars,
  TalentNominationStep,
  TalentNominationSubmitterRelationshipToNominator,
  TalentNominationUserReview,
  UpdateTalentNominationInput,
} from "@gc-digital-talent/graphql";
import {
  HiddenInput,
  Input,
  localizedEnumToOptions,
  RadioGroup,
  Select,
} from "@gc-digital-talent/forms";
import { errorMessages, uiMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes, workEmailDomainRegex } from "@gc-digital-talent/helpers";
import { Notice } from "@gc-digital-talent/ui";

import EmployeeSearchInput from "~/components/EmployeeSearchInput/EmployeeSearchInput";
import { fragmentToEmployee } from "~/components/EmployeeSearchInput/utils";
import ClassificationInput from "~/components/ClassificationInput/ClassificationInput";

import { BaseFormValues } from "../types";
import useCurrentStep from "../useCurrentStep";
import UpdateForm, { SubmitDataTransformer } from "./UpdateForm";
import SubHeading from "./SubHeading";
import messages from "../messages";
import EmployeeSearchWell from "./EmployeeSearchWell";
import labels from "../labels";

type SubmitterRole = "nominator" | "on-behalf";

interface FormValues extends BaseFormValues {
  submitter?: Scalars["UUID"]["input"];
  role?: SubmitterRole;
  submitterRelationshipToNominator?: TalentNominationSubmitterRelationshipToNominator;
  submitterRelationshipToNominatorOther?: string;
  nominator?: Maybe<Scalars["UUID"]["input"]>;
  nominatorReview?: TalentNominationUserReview;
  nominatorFallbackWorkEmail?: string;
  nominatorFallbackName?: string;
  nominatorFallbackClassification?: Scalars["UUID"]["input"];
  nominatorFallbackClassificationGroup?: string;
  nominatorFallbackClassificationLevel?: string;
  nominatorFallbackDepartment?: Scalars["UUID"]["input"];
}

const NominatorEmployee_Fragment = graphql(/* GraphQL */ `
  fragment NominatorEmployee on BasicGovEmployeeProfile {
    ...EmployeeSearchResult
  }
`);

const NominatorFieldOptions_Fragment = graphql(/* GraphQL */ `
  fragment NominatorFieldOptions on Query {
    nomineeReviewOptions: localizedEnumStrings(
      enumName: "TalentNominationUserReview"
    ) {
      value
      label {
        localized
      }
    }
    relationshipToSubmitterOptions: localizedEnumStrings(
      enumName: "TalentNominationSubmitterRelationshipToNominator"
    ) {
      value
      label {
        localized
      }
    }
    departments {
      id
      name {
        localized
      }
    }
    classifications {
      ...ClassificationInput
    }
  }
`);

type NominatorOptionsFragmentType = FragmentType<
  typeof NominatorFieldOptions_Fragment
>;

interface NominatorFieldsProps {
  optionsQuery?: NominatorOptionsFragmentType;
  employeeQuery?: FragmentType<typeof NominatorEmployee_Fragment>;
}

const NominatorFields = ({
  optionsQuery,
  employeeQuery,
}: NominatorFieldsProps) => {
  const intl = useIntl();
  const { watch, resetField: baseReset } = useFormContext<FormValues>();
  const [role, nominator, relationship] = watch([
    "role",
    "nominator",
    "submitterRelationshipToNominator",
  ]);

  const resetField = useCallback(
    (name: keyof FormValues) =>
      baseReset(name, { defaultValue: null, keepDirty: false }),
    [baseReset],
  );

  useEffect(() => {
    if (role === "nominator") {
      resetField("nominator");
      resetField("submitterRelationshipToNominator");
      resetField("submitterRelationshipToNominatorOther");
      resetField("nominatorReview");
      resetField("nominatorFallbackName");
      resetField("nominatorFallbackWorkEmail");
      resetField("nominatorFallbackDepartment");
      resetField("nominatorFallbackClassification");
      resetField("nominatorFallbackClassificationGroup");
      resetField("nominatorFallbackClassificationLevel");
    }
  }, [resetField, role]);

  useEffect(() => {
    if (
      relationship !== TalentNominationSubmitterRelationshipToNominator.Other
    ) {
      resetField("submitterRelationshipToNominatorOther");
    }
  }, [relationship, resetField]);

  useEffect(() => {
    if (nominator) {
      resetField("nominatorFallbackName");
      resetField("nominatorFallbackWorkEmail");
      resetField("nominatorFallbackDepartment");
      resetField("nominatorFallbackClassification");
      resetField("nominatorFallbackClassificationGroup");
      resetField("nominatorFallbackClassificationLevel");
    } else {
      resetField("nominatorReview");
    }
  }, [nominator, resetField]);

  if (!role) {
    return (
      <Notice.Root className="text-center">
        <Notice.Content>
          <p>
            {intl.formatMessage({
              defaultMessage: "Please indicate your role to continue.",
              id: "S4vj9m",
              description:
                "Message displayed when submitter has not selected their role in a nomination",
            })}
          </p>
        </Notice.Content>
      </Notice.Root>
    );
  }

  if (role === "nominator") return null;

  const options = getFragment(NominatorFieldOptions_Fragment, optionsQuery);
  const nominatorResult = getFragment(
    NominatorEmployee_Fragment,
    employeeQuery,
  );

  const nominatorUnset = typeof nominator === "undefined";
  const nominatorNotFound = nominator === null;

  return (
    <>
      <p id="nominatorHelp">
        {intl.formatMessage({
          defaultMessage:
            "Because you’re submitting this nomination on the nominator’s behalf, we’ll need to collect some information about the nominator. This includes your working relationship with them, their name, work email, and classification.",
          id: "EI62F9",
          description:
            "Help text for filling out information about the nominator",
        })}
      </p>
      <RadioGroup
        idPrefix="submitterRelationshipToNominator"
        id="submitterRelationshipToNominator"
        name="submitterRelationshipToNominator"
        rules={{ required: intl.formatMessage(errorMessages.required) }}
        legend={intl.formatMessage({
          defaultMessage: "Your relationship to the nominator",
          id: "hq5u5/",
          description:
            "Label for a nomination submitter's relationship to the nominator",
        })}
        items={localizedEnumToOptions(
          options?.relationshipToSubmitterOptions,
          intl,
          [
            TalentNominationSubmitterRelationshipToNominator.SupportStaff,
            TalentNominationSubmitterRelationshipToNominator.Employee,
            TalentNominationSubmitterRelationshipToNominator.Other,
          ],
        )}
      />
      {relationship ===
        TalentNominationSubmitterRelationshipToNominator.Other && (
        <Input
          type="text"
          id="submitterRelationshipToNominatorOther"
          name="submitterRelationshipToNominatorOther"
          label={intl.formatMessage({
            defaultMessage: "Other relationship",
            id: "vIzha1",
            description:
              "Label for the text input for an other relationship not listed",
          })}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      )}
      <EmployeeSearchInput
        id="nominator"
        name="nominator"
        aria-describedby="nominatorHelp"
        employeeOption={fragmentToEmployee(nominatorResult)}
        searchMessageCase="emailNotification"
        label={intl.formatMessage({
          defaultMessage: "Search nominator's work email",
          id: "tmRaL3",
          description: "Label for search nominator input field on a nomination",
        })}
        errorSeverities={{ NO_PROFILE: "warning" }}
      />
      {!nominatorUnset && !nominatorNotFound && (
        <>
          <EmployeeSearchWell />
          <RadioGroup
            idPrefix="nominatorReview"
            id="nominatorReview"
            name="nominatorReview"
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
        </>
      )}
      {!nominatorUnset && nominatorNotFound && (
        <>
          <div className="grid grid-cols-2 gap-6">
            <Input
              type="text"
              id="nominatorFallbackName"
              name="nominatorFallbackName"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
              label={intl.formatMessage(labels.nominatorName)}
            />
            <Input
              type="email"
              id="nominatorFallbackWorkEmail"
              name="nominatorFallbackWorkEmail"
              rules={{
                required: intl.formatMessage(errorMessages.required),
                pattern: {
                  value: workEmailDomainRegex,
                  message: intl.formatMessage(errorMessages.notGovernmentEmail),
                },
              }}
              label={intl.formatMessage(labels.nominatorWorkEmail)}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-[4fr_1fr]">
            <ClassificationInput
              name="nominatorFallbackClassification"
              classificationsQuery={unpackMaybes(options?.classifications)}
              rules={{
                group: { required: intl.formatMessage(errorMessages.required) },
                level: { required: intl.formatMessage(errorMessages.required) },
              }}
            />
          </div>
          <Select
            id="nominatorFallbackDepartment"
            name="nominatorFallbackDepartment"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
            label={intl.formatMessage(labels.nominatorDepartment)}
            nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
            options={unpackMaybes(options?.departments).map((department) => ({
              value: department.id,
              label: department.name.localized ?? "",
            }))}
          />
        </>
      )}
    </>
  );
};

const NominateTalentNominator_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentNominator on TalentNomination {
    id
    submitter {
      id
    }
    nominator {
      id
      ...NominatorEmployee
    }
    submitterRelationshipToNominator {
      value
    }
    submitterRelationshipToNominatorOther
    nominatorReview {
      value
    }
    nominatorFallbackWorkEmail
    nominatorFallbackName
    nominatorFallbackClassification {
      id
      group
      level
    }
    nominatorFallbackDepartment {
      id
    }
  }
`);

const transformSubmitData: SubmitDataTransformer<FormValues> = (values) => {
  const nominatorId =
    values.role === "nominator" ? values.submitter : values.nominator;
  let nominator: UpdateTalentNominationInput["nominator"] = nominatorId
    ? { connect: nominatorId }
    : null;
  if (values.nominatorFallbackWorkEmail) {
    nominator = { disconnect: true };
  }
  return {
    submitterRelationshipToNominator: values.submitterRelationshipToNominator,
    submitterRelationshipToNominatorOther:
      values.submitterRelationshipToNominatorOther,
    nominator,
    nominatorReview: values.nominatorReview ?? null,
    nominatorFallbackName: values.nominatorFallbackName ?? null,
    nominatorFallbackWorkEmail: values.nominatorFallbackWorkEmail ?? null,
    nominatorFallbackClassification: values.nominatorFallbackClassification
      ? { connect: values.nominatorFallbackClassification }
      : { disconnect: true },
    nominatorFallbackDepartment: values.nominatorFallbackDepartment
      ? { connect: values.nominatorFallbackDepartment }
      : { disconnect: true },
  };
};

interface NominatorProps {
  nominatorQuery: FragmentType<typeof NominateTalentNominator_Fragment>;
  optionsQuery: NominatorOptionsFragmentType;
}

const Nominator = ({ nominatorQuery, optionsQuery }: NominatorProps) => {
  const intl = useIntl();
  const { current } = useCurrentStep();
  const talentNomination = getFragment(
    NominateTalentNominator_Fragment,
    nominatorQuery,
  );

  if (current !== TalentNominationStep.NominatorInformation) {
    return null;
  }

  const preSubmitValidation = (values: FormValues) => {
    if (
      values.role !== "nominator" &&
      !values.nominator &&
      !values.nominatorFallbackWorkEmail
    ) {
      return intl.formatMessage({
        defaultMessage: "To continue, please let us know who the nominator is.",
        id: "h+pOLj",
        description:
          "Error message when a nominator has not been set for a nomination",
      });
    }

    return null;
  };

  const nominatorSet =
    !!talentNomination.nominator?.id ||
    !!talentNomination.nominatorFallbackName;
  const submitterIsNominator =
    talentNomination.submitter?.id === talentNomination.nominator?.id;
  let defaultRole: SubmitterRole | undefined;
  let defaultNominator: Maybe<string> | undefined;
  if (talentNomination.submitter?.id && nominatorSet) {
    defaultRole = submitterIsNominator ? "nominator" : "on-behalf";
  }

  if (nominatorSet) {
    defaultNominator =
      !submitterIsNominator && talentNomination.nominator?.id
        ? talentNomination.nominator.id
        : null;
  }

  return (
    <UpdateForm<FormValues>
      submitDataTransformer={transformSubmitData}
      preSubmitValidation={preSubmitValidation}
      defaultValues={{
        submitter: talentNomination.submitter?.id,
        role: defaultRole,
        nominator: defaultNominator,
        nominatorReview: talentNomination.nominatorReview?.value,
        submitterRelationshipToNominator:
          talentNomination.submitterRelationshipToNominator?.value,
        submitterRelationshipToNominatorOther:
          talentNomination.submitterRelationshipToNominatorOther ?? undefined,
        nominatorFallbackName:
          talentNomination.nominatorFallbackName ?? undefined,
        nominatorFallbackWorkEmail:
          talentNomination.nominatorFallbackWorkEmail ?? undefined,
        nominatorFallbackClassification:
          talentNomination.nominatorFallbackClassification?.id,
        nominatorFallbackClassificationGroup:
          talentNomination.nominatorFallbackClassification?.group,
        nominatorFallbackClassificationLevel:
          talentNomination.nominatorFallbackClassification?.level?.toString(),
        nominatorFallbackDepartment:
          talentNomination.nominatorFallbackDepartment?.id,
      }}
    >
      <SubHeading level="h2" icon={DocumentCheckIcon}>
        {intl.formatMessage(messages.nominatorInfo)}
      </SubHeading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "Let’s get started by learning a little about the nominator.",
          id: "oglvAY",
          description: "Subtitle for nomination nominator step",
        })}
      </p>
      <div className="flex flex-col gap-6">
        <HiddenInput name="submitter" />
        <RadioGroup
          idPrefix="role"
          id="role"
          name="role"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          legend={intl.formatMessage(labels.yourRole)}
          items={[
            {
              value: "nominator",
              label: intl.formatMessage(labels.imNominator),
            },
            {
              value: "on-behalf",
              label: intl.formatMessage(labels.onBehalf),
            },
          ]}
        />
        <NominatorFields
          optionsQuery={optionsQuery}
          employeeQuery={
            submitterIsNominator
              ? undefined
              : (talentNomination?.nominator ?? undefined)
          }
        />
      </div>
    </UpdateForm>
  );
};

export default Nominator;
