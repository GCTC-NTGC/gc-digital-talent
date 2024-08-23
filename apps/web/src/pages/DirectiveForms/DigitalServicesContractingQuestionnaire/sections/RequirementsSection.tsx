import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import {
  Checklist,
  Input,
  RadioGroup,
  TextArea,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import {
  PersonnelLanguage,
  PersonnelOtherRequirement,
  PersonnelScreeningLevel,
  PersonnelWorkLocation,
  Skill,
  YesNo,
} from "@gc-digital-talent/graphql";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { enumToOptions } from "../../util";
import {
  getPersonnelLanguage,
  getPersonnelOtherRequirement,
  getPersonnelScreeningLevel,
  getPersonnelWorkLocation,
  getYesNo,
  personnelLanguageSortOrder,
  personnelOtherRequirementSortOrder,
  personnelScreeningLevelSortOrder,
  personnelWorkLocationSortOrder,
  yesNoSortOrder,
} from "../../localizedConstants";
import PersonnelRequirementsSection from "./PersonnelRequirementsSection";
import useLabels from "../useLabels";
import CompoundQuestion from "../../CompoundQuestion";
import SignPost from "../../SignPost";

type RequirementsSectionProps = {
  skills: Array<Skill>;
};

const RequirementsSection = ({ skills }: RequirementsSectionProps) => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();
  const labels = useLabels();

  // hooks to watch, needed for conditional rendering
  const [
    selectedRequirementScreeningLevels,
    selectedRequirementWorkLanguages,
    selectedRequirementWorkLocations,
    selectHasOtherRequirements,
    selectedRequirementOthers,
    selectedHasPersonnelRequirements,
  ] = watch([
    "requirementScreeningLevels",
    "requirementWorkLanguages",
    "requirementWorkLocations",
    "hasOtherRequirements",
    "requirementOthers",
    "hasPersonnelRequirements",
  ]) as [
    PersonnelScreeningLevel,
    PersonnelLanguage,
    PersonnelWorkLocation,
    YesNo,
    PersonnelOtherRequirement,
    YesNo,
  ];

  const doesRequirementScreeningLevelsIncludeOther =
    Array.isArray(selectedRequirementScreeningLevels) &&
    selectedRequirementScreeningLevels.includes(PersonnelScreeningLevel.Other);

  const doesRequirementWorkLanguagesIncludeOther =
    Array.isArray(selectedRequirementWorkLanguages) &&
    selectedRequirementWorkLanguages.includes(PersonnelLanguage.Other);

  const doesRequirementWorkLocationsIncludeGc =
    Array.isArray(selectedRequirementWorkLocations) &&
    selectedRequirementWorkLocations.includes(PersonnelWorkLocation.GcPremises);

  const doesRequirementWorkLocationsIncludeOffsiteSpecific =
    Array.isArray(selectedRequirementWorkLocations) &&
    selectedRequirementWorkLocations.includes(
      PersonnelWorkLocation.OffsiteSpecific,
    );

  const hasOtherRequirementsIsYes = selectHasOtherRequirements === YesNo.Yes;

  const doesPersonnelOtherRequirementIncludeOther =
    Array.isArray(selectedRequirementOthers) &&
    selectedRequirementOthers.includes(PersonnelOtherRequirement.Other);

  const isHasPersonnelRequirementsYes =
    selectedHasPersonnelRequirements === YesNo.Yes;
  const isHasPersonnelRequirementsNo =
    selectedHasPersonnelRequirements === YesNo.No;

  /**
   * Reset un-rendered fields
   */
  useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // Reset all optional fields
    if (!doesRequirementScreeningLevelsIncludeOther) {
      resetDirtyField("requirementScreeningLevelOther");
    }
    if (!doesRequirementWorkLanguagesIncludeOther) {
      resetDirtyField("requirementWorkLanguageOther");
    }
    if (!doesRequirementWorkLocationsIncludeGc) {
      resetDirtyField("requirementWorkLocationGcSpecific");
    }
    if (!doesRequirementWorkLocationsIncludeOffsiteSpecific) {
      resetDirtyField("requirementWorkLocationOffsiteSpecific");
    }
    if (!hasOtherRequirementsIsYes) {
      resetDirtyField("requirementOthers");
      resetDirtyField("requirementOtherOther");
    }
    if (!doesPersonnelOtherRequirementIncludeOther) {
      resetDirtyField("requirementOtherOther");
    }
    if (!isHasPersonnelRequirementsYes) {
      resetDirtyField("personnelRequirements");
    }
    if (!isHasPersonnelRequirementsNo) {
      resetDirtyField("qualificationRequirement");
      resetDirtyField("requirementAccessToSecure");
      resetDirtyField("requirementScreeningLevels");
      resetDirtyField("requirementScreeningLevelOther");
      resetDirtyField("requirementWorkLanguages");
      resetDirtyField("requirementWorkLanguageOther");
      resetDirtyField("requirementWorkLocations");
      resetDirtyField("requirementWorkLocationGcSpecific");
      resetDirtyField("requirementWorkLocationOffsiteSpecific");
    }
  }, [
    resetField,
    doesRequirementScreeningLevelsIncludeOther,
    doesRequirementWorkLanguagesIncludeOther,
    doesRequirementWorkLocationsIncludeGc,
    doesRequirementWorkLocationsIncludeOffsiteSpecific,
    doesPersonnelOtherRequirementIncludeOther,
    isHasPersonnelRequirementsYes,
    isHasPersonnelRequirementsNo,
    hasOtherRequirementsIsYes,
  ]);

  return (
    <TableOfContents.Section id={PAGE_SECTION_ID.CONTRACT_REQUIREMENTS}>
      <Heading
        data-h2-margin="base(x3, 0, x1, 0)"
        level="h3"
        size="h4"
        data-h2-font-weight="base(700)"
      >
        {intl.formatMessage(
          getSectionTitle(PAGE_SECTION_ID.CONTRACT_REQUIREMENTS),
        )}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <CompoundQuestion
          title={intl.formatMessage({
            defaultMessage: "Description of the work required",
            id: "T0JO/F",
            description:
              "title for _work requirement description_ textbox in the _digital services contracting questionnaire_",
          })}
          introduction={
            <>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "What are the tasks that the contractor is expected to perform within the contract?",
                  id: "//mFwp",
                  description:
                    "Context for _work requirement description_ textbox in the _digital services contracting questionnaire_",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage: "For example, the contractor will:",
                  id: "I+GYIo",
                  description:
                    "Context for _work requirement description_ textbox in the _digital services contracting questionnaire_",
                })}
              </p>
              <ul>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "tag and augment provided datasets as may be required for reporting",
                    id: "eeyR6R",
                    description:
                      "Context example for _work requirement description_ textbox in the _digital services contracting questionnaire_",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "manipulate and perform calculations against the dataset",
                    id: "tDwAB0",
                    description:
                      "Context example for _work requirement description_ textbox in the _digital services contracting questionnaire_",
                  })}
                </li>
              </ul>
            </>
          }
          inputElement={
            <TextArea
              id="workRequirementDescription"
              name="workRequirementDescription"
              wordLimit={200}
              label={labels.workRequirementDescription}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          }
        />
        <RadioGroup
          legend={labels.hasPersonnelRequirements}
          id="hasPersonnelRequirements"
          name="hasPersonnelRequirements"
          idPrefix="hasPersonnelRequirements"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
        {isHasPersonnelRequirementsYes && (
          <PersonnelRequirementsSection skills={skills} />
        )}
        {isHasPersonnelRequirementsNo && (
          <>
            <TextArea
              id="qualificationRequirement"
              name="qualificationRequirement"
              label={labels.qualificationRequirement}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
              context={intl.formatMessage({
                defaultMessage:
                  "List the specific skill, education, or experience that are required to perform the work required.",
                id: "rtzp80",
                description:
                  "Context for _qualification requirement_ textbox in the _digital services contracting questionnaire_",
              })}
            />
            <RadioGroup
              legend={labels.requirementAccessToSecure}
              id="requirementAccessToSecure"
              name="requirementAccessToSecure"
              idPrefix="requirementAccessToSecure"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
                return {
                  value: option.value as string,
                  label: intl.formatMessage(getYesNo(option.value)),
                };
              })}
            />
            <Checklist
              idPrefix="requirementScreeningLevels"
              id="requirementScreeningLevels"
              name="requirementScreeningLevels"
              legend={labels.requirementScreeningLevels}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={enumToOptions(
                PersonnelScreeningLevel,
                personnelScreeningLevelSortOrder,
              ).map((option) => {
                return {
                  value: option.value as string,
                  label: intl.formatMessage(
                    getPersonnelScreeningLevel(option.value),
                  ),
                };
              })}
            />
            {doesRequirementScreeningLevelsIncludeOther ? (
              <Input
                id="requirementScreeningLevelOther"
                name="requirementScreeningLevelOther"
                type="text"
                label={labels.requirementScreeningLevelOther}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            ) : null}
            <Checklist
              idPrefix="requirementWorkLanguages"
              id="requirementWorkLanguages"
              name="requirementWorkLanguages"
              legend={labels.requirementWorkLanguages}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={enumToOptions(
                PersonnelLanguage,
                personnelLanguageSortOrder,
              ).map((option) => {
                return {
                  value: option.value as string,
                  label: intl.formatMessage(getPersonnelLanguage(option.value)),
                };
              })}
            />
            {doesRequirementWorkLanguagesIncludeOther ? (
              <Input
                id="requirementWorkLanguageOther"
                name="requirementWorkLanguageOther"
                type="text"
                label={labels.requirementWorkLanguageOther}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            ) : null}
            <Checklist
              idPrefix="requirementWorkLocations"
              id="requirementWorkLocations"
              name="requirementWorkLocations"
              legend={labels.requirementWorkLocations}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={enumToOptions(
                PersonnelWorkLocation,
                personnelWorkLocationSortOrder,
              ).map((option) => {
                return {
                  value: option.value as string,
                  label: intl.formatMessage(
                    getPersonnelWorkLocation(option.value),
                  ),
                };
              })}
            />
            {doesRequirementWorkLocationsIncludeGc ? (
              <Input
                id="requirementWorkLocationGcSpecific"
                name="requirementWorkLocationGcSpecific"
                type="text"
                label={labels.requirementWorkLocationGcSpecific}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            ) : null}
            {doesRequirementWorkLocationsIncludeOffsiteSpecific ? (
              <Input
                id="requirementWorkLocationOffsiteSpecific"
                name="requirementWorkLocationOffsiteSpecific"
                type="text"
                label={labels.requirementWorkLocationOffsiteSpecific}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            ) : null}
          </>
        )}
        <SignPost
          title={intl.formatMessage({
            defaultMessage: "Other requirements",
            id: "e+xir3",
            description:
              "Signpost title for _work requirement description_ textbox in the _digital services contracting questionnaire_",
          })}
        />
        <RadioGroup
          legend={labels.hasOtherRequirements}
          id="hasOtherRequirements"
          name="hasOtherRequirements"
          idPrefix="hasOtherRequirements"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(YesNo, yesNoSortOrder).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getYesNo(option.value)),
            };
          })}
        />
        {hasOtherRequirementsIsYes ? (
          <>
            <Checklist
              idPrefix="requirementOthers"
              id="requirementOthers"
              name="requirementOthers"
              legend={labels.requirementOthers}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={enumToOptions(
                PersonnelOtherRequirement,
                personnelOtherRequirementSortOrder,
              ).map((option) => {
                return {
                  value: option.value as string,
                  label: intl.formatMessage(
                    getPersonnelOtherRequirement(option.value),
                  ),
                };
              })}
            />
            {doesPersonnelOtherRequirementIncludeOther ? (
              <Input
                id="requirementOtherOther"
                name="requirementOtherOther"
                type="text"
                label={labels.requirementOtherOther}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </TableOfContents.Section>
  );
};

export default RequirementsSection;
