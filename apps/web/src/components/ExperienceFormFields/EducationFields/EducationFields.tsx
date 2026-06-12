import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";
import { useQuery } from "urql";

import {
  DATE_SEGMENT,
  DateInput,
  Input,
  RadioGroup,
  TextArea,
} from "@gc-digital-talent/forms";
import type { Locales } from "@gc-digital-talent/i18n";
import { errorMessages, getLocale } from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import {
  DegreeType,
  EducationStatus,
  EducationType,
  FellowshipType,
} from "@gc-digital-talent/graphql";
import { nodeToString } from "@gc-digital-talent/helpers";
import { Heading, Notice } from "@gc-digital-talent/ui";

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

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS_EN = 200;

const EducationFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const experienceLabels = getExperienceFormLabels(intl);
  const todayDate = new Date();
  const [{ data }] = useQuery({ query: EducationOptions_Query });
  // ensuring end date isn't before the start date, using this as a minimum value
  const watchStartDate = useWatch<EducationFormValues>({ name: "startDate" });
  const watchEducationType = useWatch<EducationFormValues>({
    name: "educationType",
  });
  const watchDegreeType = useWatch<EducationFormValues>({
    name: "degreeType",
  });
  const watchFellowshipType = useWatch<EducationFormValues>({
    name: "fellowshipType",
  });
  const watchEducationStatus = useWatch<EducationFormValues>({
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
  const showStatusField =
    !!watchEducationType &&
    (watchEducationType !== EducationType.DegreeDiplomaCertificate ||
      !!watchDegreeType);
  const showDateFields =
    showStatusField &&
    !!watchEducationStatus &&
    watchEducationStatus !== EducationStatus.DidNotComplete;

  const licenseOrCertification =
    watchEducationType === EducationType.LicenseAccreditation ||
    watchEducationType === EducationType.ProfessionalCertification;
  const startDateLabel = licenseOrCertification
    ? watchEducationStatus === EducationStatus.InProgress
      ? intl.formatMessage({
          defaultMessage: "Prospective issue date",
          id: "HYLxWg",
          description:
            "Label displayed on an Experience form for issue date input",
        })
      : intl.formatMessage({
          defaultMessage: "Issue date",
          id: "TTE5K9",
          description:
            "Label displayed on an Experience form for issue date input",
        })
    : labels.startDate;

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

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
      {watchEducationType === EducationType.Fellowship &&
        watchFellowshipType === FellowshipType.Other && (
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
      {showDateFields && (
        <div className="grid grid-cols-2 gap-6">
          <DateInput
            id="startDate"
            legend={startDateLabel}
            name="startDate"
            round="floor"
            show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
            rules={{
              required: intl.formatMessage(errorMessages.required),
              max: {
                value: strToFormDate(todayDate.toISOString()),
                message: intl.formatMessage(
                  errorMessages.mustNotBeFutureStartDate,
                ),
              },
            }}
          />
          {watchEducationStatus === EducationStatus.InProgress ? (
            <DateInput
              id="prospectiveEndDate"
              legend={labels.expectedEndDate}
              name="prospectiveEndDate"
              round="ceil"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: watchStartDate ? String(watchStartDate) : "",
                  message: intl.formatMessage(errorMessages.minDateSelfLabel, {
                    labelSelf: nodeToString(labels.endDate).toLowerCase(),
                    labelAssociated: nodeToString(
                      labels.startDate,
                    ).toLowerCase(),
                  }),
                },
                max: {
                  value: strToFormDate(todayDate.toISOString()),
                  message: intl.formatMessage(
                    errorMessages.mustNotBeFutureEndDate,
                  ),
                },
              }}
            />
          ) : (
            <DateInput
              id="endDate"
              legend={labels.endDate}
              name="endDate"
              round="ceil"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: watchStartDate ? String(watchStartDate) : "",
                  message: intl.formatMessage(errorMessages.minDateSelfLabel, {
                    labelSelf: nodeToString(labels.endDate).toLowerCase(),
                    labelAssociated: nodeToString(
                      labels.startDate,
                    ).toLowerCase(),
                  }),
                },
                max: {
                  value: strToFormDate(todayDate.toISOString()),
                  message: intl.formatMessage(
                    errorMessages.mustNotBeFutureEndDate,
                  ),
                },
              }}
            />
          )}
        </div>
      )}
      <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Highlight additional details",
          id: "6v+j79",
          description: "Title for additional details section",
        })}
      </Heading>
      <div>
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "Describe <strong>key tasks</strong>, <strong>responsibilities</strong>, or <strong>other information</strong> you feel were crucial in making this experience important. Try to keep this field concise as you'll be able to provide more detailed information when linking skills to this experience.",
            id: "yZ0kfQ",
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
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      </div>
    </div>
  );
};

export default EducationFields;
