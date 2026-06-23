import { useIntl } from "react-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { useQuery } from "urql";
import { useCallback, useEffect, useRef } from "react";

import { Input, RadioGroup, TextArea } from "@gc-digital-talent/forms";
import type { Locales } from "@gc-digital-talent/i18n";
import { errorMessages, getLocale } from "@gc-digital-talent/i18n";
import type { EducationStatus } from "@gc-digital-talent/graphql";
import {
  DegreeType,
  EducationType,
  FellowshipType,
} from "@gc-digital-talent/graphql";
import { Notice } from "@gc-digital-talent/ui";

import type {
  SubExperienceFormProps,
  EducationFormValues,
} from "~/types/experience";
import { getExperienceFormLabels } from "~/utils/experienceUtils";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import {
  EducationOptions_Query,
  getDegreeTypeOptions,
  getEducationStatusOptions,
  getEducationTypeOptions,
  getFellowshipTypeOptions,
} from "./utils";
import DateFields from "./DateFields";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS_EN = 200;

const EducationFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const experienceLabels = getExperienceFormLabels(intl);
  const [{ data }] = useQuery({ query: EducationOptions_Query });

  const { resetField, formState } = useFormContext<EducationFormValues>();

  const watchEducationType = useWatch<{ educationType: EducationType }>({
    name: "educationType",
  });
  const watchDegreeType = useWatch<{ degreeType: DegreeType }>({
    name: "degreeType",
  });
  const watchFellowshipType = useWatch<{ fellowshipType: FellowshipType }>({
    name: "fellowshipType",
  });
  const watchEducationStatus = useWatch<{ educationStatus: EducationStatus }>({
    name: "educationStatus",
  });

  const showInstitutionField =
    !!watchEducationType &&
    (watchEducationType !== EducationType.DegreeDiplomaCertificate ||
      !!watchDegreeType);
  const showAreaOfStudyField =
    (watchEducationType === EducationType.DegreeDiplomaCertificate &&
      !!watchDegreeType &&
      watchDegreeType !== DegreeType.HighSchool) ||
    watchEducationType === EducationType.IndividualCourse ||
    watchEducationType === EducationType.Fellowship ||
    watchEducationType === EducationType.Other;
  const showThesisTitleField =
    watchEducationType === EducationType.DegreeDiplomaCertificate &&
    (watchDegreeType === DegreeType.MastersDegree ||
      watchDegreeType === DegreeType.Phd);
  const showOtherFellowshipTypeField =
    watchEducationType === EducationType.Fellowship &&
    watchFellowshipType === FellowshipType.Other;
  const showStatusField =
    !!watchEducationType &&
    (watchEducationType !== EducationType.DegreeDiplomaCertificate ||
      !!watchDegreeType);

  const licenseOrCertification =
    watchEducationType === EducationType.LicenseAccreditation ||
    watchEducationType === EducationType.ProfessionalCertification;

  const prevEducationType = useRef<EducationType | null | undefined>(
    formState.defaultValues?.educationType,
  );

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  const resetDirtyField = useCallback(
    (name: keyof EducationFormValues) =>
      resetField(name, { defaultValue: null, keepDirty: false }),
    [resetField],
  );

  /**
   * Reset all fields when education type is changed
   */
  useEffect(() => {
    if (prevEducationType.current !== watchEducationType) {
      resetDirtyField("degreeType");
      resetDirtyField("otherEducationType");
      resetDirtyField("fellowshipType");
      resetDirtyField("licenseOrAccreditation");
      resetDirtyField("certification");
      resetDirtyField("courseName");
      resetDirtyField("educationStatus");
    }
    prevEducationType.current = watchEducationType;
  }, [watchEducationType, resetDirtyField]);

  /**
   * Reset other fellowship type field when hidden
   */
  useEffect(() => {
    if (!showOtherFellowshipTypeField) {
      resetDirtyField("otherFellowshipType");
    }
  }, [showOtherFellowshipTypeField, resetDirtyField]);

  /**
   * Reset area of study field when hidden
   */
  useEffect(() => {
    if (!showAreaOfStudyField) {
      resetDirtyField("areaOfStudy");
    }
  }, [showAreaOfStudyField, resetDirtyField]);

  /**
   * Reset thesis title field when hidden
   */
  useEffect(() => {
    if (!showThesisTitleField) {
      resetDirtyField("thesisTitle");
    }
  }, [showThesisTitleField, resetDirtyField]);

  return (
    <div className="grid gap-6">
      <RadioGroup
        idPrefix="educationType"
        name="educationType"
        legend={labels.educationType}
        items={getEducationTypeOptions(data?.educationTypes, intl)}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      {!watchEducationType && (
        <Notice.Root>
          <Notice.Content>
            <p className="text-center">
              {intl.formatMessage({
                defaultMessage:
                  "Please select a type of education or certificate to continue.",
                id: "gBPQ/R",
                description:
                  "Text displayed on the education experience form when a user has not selected an education type.",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
      {watchEducationType === EducationType.DegreeDiplomaCertificate && (
        <RadioGroup
          idPrefix="degreeType"
          name="degreeType"
          legend={labels.degreeType}
          items={getDegreeTypeOptions(data?.degreeTypes, intl)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      )}
      {watchEducationType === EducationType.DegreeDiplomaCertificate &&
        !watchDegreeType && (
          <Notice.Root>
            <Notice.Content>
              <p className="text-center">
                {intl.formatMessage({
                  defaultMessage:
                    "Please select a type of degree or diploma to continue.",
                  id: "qpcvEM",
                  description:
                    "Text displayed on the education experience form when a user has not selected the type of their degree/diploma/certificate.",
                })}
              </p>
            </Notice.Content>
          </Notice.Root>
        )}
      {watchEducationType === EducationType.Other && (
        <Input
          id="otherEducationType"
          label={labels.otherEducationType}
          name="otherEducationType"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      )}
      {showInstitutionField && (
        <div>
          <Input
            id="institution"
            label={labels.institution}
            name="institution"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
            list={
              organizationSuggestions.length
                ? "organizationSuggestions"
                : undefined
            }
          />
          {organizationSuggestions.length > 0 && (
            <datalist id="organizationSuggestions">
              {organizationSuggestions.map((suggestion) => {
                return <option key={suggestion} value={suggestion}></option>;
              })}
            </datalist>
          )}
        </div>
      )}
      {watchEducationType === EducationType.Fellowship && (
        <RadioGroup
          idPrefix="fellowshipType"
          name="fellowshipType"
          legend={labels.fellowshipType}
          items={getFellowshipTypeOptions(data?.fellowshipTypes, intl)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      )}
      {showOtherFellowshipTypeField && (
        <Input
          id="otherFellowshipType"
          label={labels.otherFellowshipType}
          name="otherFellowshipType"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      )}
      {showAreaOfStudyField && (
        <Input
          id="areaOfStudy"
          label={labels.areaOfStudy}
          name="areaOfStudy"
          type="text"
          rules={
            watchEducationType !== EducationType.Fellowship &&
            watchEducationType !== EducationType.Other
              ? {
                  required: intl.formatMessage(errorMessages.required),
                }
              : {}
          }
        />
      )}
      {showThesisTitleField && (
        <Input
          id="thesisTitle"
          label={labels.thesisTitle}
          name="thesisTitle"
          type="text"
        />
      )}
      {watchEducationType === EducationType.LicenseAccreditation && (
        <Input
          id="licenseOrAccreditation"
          label={labels.licenseOrAccreditation}
          name="licenseOrAccreditation"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      )}
      {watchEducationType === EducationType.ProfessionalCertification && (
        <Input
          id="certification"
          label={labels.certification}
          name="certification"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      )}
      {watchEducationType === EducationType.IndividualCourse && (
        <Input
          id="courseName"
          label={labels.courseName}
          name="courseName"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      )}
      {showStatusField && (
        <RadioGroup
          idPrefix="educationStatus"
          name="educationStatus"
          legend={labels.educationStatus}
          items={getEducationStatusOptions(
            data?.educationStatuses,
            intl,
            licenseOrCertification,
          )}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      )}
      {showStatusField && !watchEducationStatus && (
        <Notice.Root>
          <Notice.Content>
            <p className="text-center">
              {intl.formatMessage({
                defaultMessage: "Select a completion status to continue.",
                id: "/nD36n",
                description:
                  "Text displayed on the education experience form when a user has not selected an education status.",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
      {showStatusField && !!watchEducationStatus && (
        <>
          <DateFields labels={labels} />
          <p>
            {intl.formatMessage({
              defaultMessage:
                "If there are any other relevant details about this experience you'd like to share, you can do so here.",
              id: "ioYWI6",
              description:
                "Help text for the experience additional details field",
            })}
          </p>
          <TextArea
            id={"details"}
            name={"details"}
            rows={TEXT_AREA_ROWS}
            wordLimit={wordCountLimits[locale]}
            label={experienceLabels.details}
          />
        </>
      )}
    </div>
  );
};

export default EducationFields;
