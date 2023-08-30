import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import {
  Checklist,
  Input,
  RadioGroup,
  TextArea,
} from "@gc-digital-talent/forms";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";
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

type RequirementsSectionProps = {
  skills: Array<Skill>;
};

const RequirementsSection = ({ skills }: RequirementsSectionProps) => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();

  // hooks to watch, needed for conditional rendering
  const [
    selectedRequirementScreeningLevels,
    selectedRequirementWorkLanguages,
    selectedRequirementWorkLocations,
    selectedRequirementOthers,
    selectedHasPersonnelRequirements,
  ] = watch([
    "requirementScreeningLevels",
    "requirementWorkLanguages",
    "requirementWorkLocations",
    "requirementOthers",
    "hasPersonnelRequirements",
  ]);

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

  const doesPersonnelOtherRequirementIncludeOther =
    Array.isArray(selectedRequirementOthers) &&
    selectedRequirementOthers.includes(PersonnelOtherRequirement.Other);

  const isHasPersonnelRequirementsYes =
    selectedHasPersonnelRequirements === YesNo.Yes;

  /**
   * Reset un-rendered fields
   */
  React.useEffect(() => {
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
    if (!doesPersonnelOtherRequirementIncludeOther) {
      resetDirtyField("requirementOtherOther");
    }

    if (!isHasPersonnelRequirementsYes) {
      resetDirtyField("personnelRequirements");
    }
  }, [
    resetField,
    doesRequirementScreeningLevelsIncludeOther,
    doesRequirementWorkLanguagesIncludeOther,
    doesRequirementWorkLocationsIncludeGc,
    doesRequirementWorkLocationsIncludeOffsiteSpecific,
    doesPersonnelOtherRequirementIncludeOther,
    isHasPersonnelRequirementsYes,
  ]);

  return (
    <TableOfContents.Section
      id={PAGE_SECTION_ID.CONTRACT_REQUIREMENTS}
      data-h2-padding-top="base(x2)"
    >
      <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
        {intl.formatMessage(
          getSectionTitle(PAGE_SECTION_ID.CONTRACT_REQUIREMENTS),
        )}
      </Heading>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.5)"
      >
        <TextArea
          id="workRequirementDescription"
          name="workRequirementDescription"
          wordLimit={200}
          label={intl.formatMessage({
            defaultMessage: "Description of work required",
            id: "I5kjUN",
            description:
              "Label for _work requirement description_ textbox in the _digital services contracting questionnaire_",
          })}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
        <TextArea
          id="qualificationRequirement"
          name="qualificationRequirement"
          label={intl.formatMessage({
            defaultMessage: "Qualification requirement",
            id: "8v/v3u",
            description:
              "Label for _qualification requirement_ textbox in the _digital services contracting questionnaire_",
          })}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "Will the supplier and its employees require access to protected and/or classified information or assets?",
            id: "glDA2j",
            description:
              "Label for _contract amendable_ fieldset in the _digital services contracting questionnaire_",
          })}
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
          legend={intl.formatMessage({
            defaultMessage:
              "Personnel security screening level required for the contractor",
            id: "1Trz2/",
            description:
              "Label for _contractor screening levels_ fieldset in the _digital services contracting questionnaire_",
          })}
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
            label={intl.formatMessage(formMessages.specifyOther)}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <Checklist
          idPrefix="requirementWorkLanguages"
          id="requirementWorkLanguages"
          name="requirementWorkLanguages"
          legend={intl.formatMessage({
            defaultMessage: "Language of work",
            id: "6Zf2AE",
            description:
              "Label for _required work languages_ fieldset in the _digital services contracting questionnaire_",
          })}
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
            label={intl.formatMessage(formMessages.specifyOther)}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <Checklist
          idPrefix="requirementWorkLocations"
          id="requirementWorkLocations"
          name="requirementWorkLocations"
          legend={intl.formatMessage({
            defaultMessage: "Location of work",
            id: "sK7D+S",
            description:
              "Label for _required work locations_ fieldset in the _digital services contracting questionnaire_",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={enumToOptions(
            PersonnelWorkLocation,
            personnelWorkLocationSortOrder,
          ).map((option) => {
            return {
              value: option.value as string,
              label: intl.formatMessage(getPersonnelWorkLocation(option.value)),
            };
          })}
        />
        {doesRequirementWorkLocationsIncludeGc ? (
          <Input
            id="requirementWorkLocationGcSpecific"
            name="requirementWorkLocationGcSpecific"
            type="text"
            label={intl.formatMessage(formMessages.specifyOther)}
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
            label={intl.formatMessage(formMessages.specifyOther)}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <Checklist
          idPrefix="requirementOthers"
          id="requirementOthers"
          name="requirementOthers"
          legend={intl.formatMessage({
            defaultMessage: "Other requirements",
            id: "RSmwUx",
            description:
              "Label for _other requirements_ fieldset in the _digital services contracting questionnaire_",
          })}
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
            label={intl.formatMessage(formMessages.specifyOther)}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        ) : null}
        <RadioGroup
          legend={intl.formatMessage({
            defaultMessage:
              "Does the contract have specific personnel requirements?",
            id: "uK+4La",
            description:
              "Label for _contract amendable_ fieldset in the _digital services contracting questionnaire_",
          })}
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
        {isHasPersonnelRequirementsYes ? (
          <PersonnelRequirementsSection skills={skills} />
        ) : null}
      </div>
    </TableOfContents.Section>
  );
};

export default RequirementsSection;
