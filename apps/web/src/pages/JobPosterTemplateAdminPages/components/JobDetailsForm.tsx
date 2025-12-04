import { useIntl } from "react-intl";
import { useId } from "react";

import {
  Input,
  localizedEnumToOptions,
  Option,
  RadioGroup,
  Select,
  TextArea,
} from "@gc-digital-talent/forms";
import { errorMessages, Locales, uiMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  Classification,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";
import jobPosterTemplateMessages from "~/messages/jobPosterTemplateMessages";
import ClassificationInput from "~/components/ClassificationInput/ClassificationInput";

const TEXT_AREA_MAX_WORDS_EN = 65;

const descriptionWordCountLimits: Record<Locales, number> = {
  en: TEXT_AREA_MAX_WORDS_EN,
  fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;

const Options_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateJobDetailsFormOptions on Query {
    classifications {
      ...ClassificationInput
    }
    supervisoryStatuses: localizedEnumStrings(enumName: "SupervisoryStatus") {
      value
      label {
        localized
      }
    }
    workStreams {
      id
      name {
        localized
      }
    }
  }
`);

export interface FormValues {
  jobTitleEn: string | null;
  jobTitleFr: string | null;
  descriptionEn: string | null;
  descriptionFr: string | null;
  supervisoryStatus: string | null;
  workStreamId: string | null;
  workDescriptionEn: string | null;
  workDescriptionFr: string | null;
  keywordsEn: string | null;
  keywordsFr: string | null;
  classification: string | null;
  classificationGroup: Classification["group"] | null;
  classificationLevel: Classification["level"] | null;
  referenceId: string | null;
}

interface JobDetailsFormProps {
  optionsQuery: FragmentType<typeof Options_Fragment>;
}

const JobDetailsForm = ({ optionsQuery }: JobDetailsFormProps) => {
  const intl = useIntl();
  const keywordDescriptionParagraphId = useId();

  const optionsData = getFragment(Options_Fragment, optionsQuery);

  const workStreams = unpackMaybes(optionsData.workStreams);
  const workStreamOptions = workStreams.map<Option>((workStream) => ({
    value: workStream.id,
    label: workStream.name?.localized,
  }));

  return (
    <div className="grid gap-6 xs:grid-cols-1 sm:grid-cols-2">
      <ClassificationInput
        name={"classification"}
        label={{
          group: intl.formatMessage(
            jobPosterTemplateMessages.classificationGroup,
          ),
          level: intl.formatMessage(
            jobPosterTemplateMessages.classificationLevel,
          ),
        }}
        classificationsQuery={unpackMaybes(optionsData.classifications)}
        rules={{
          group: {
            required: intl.formatMessage(errorMessages.required),
          },
          level: {
            required: intl.formatMessage(errorMessages.required),
          },
        }}
      />
      <div>
        <Input
          id="jobTitleEn"
          label={intl.formatMessage(jobPosterTemplateMessages.jobTitle)}
          name="jobTitleEn"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          type="text"
          appendLanguageToLabel="en"
        />
      </div>
      <div>
        <Input
          id="jobTitleFr"
          label={intl.formatMessage(jobPosterTemplateMessages.jobTitle)}
          name="jobTitleFr"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          type="text"
          appendLanguageToLabel="fr"
        />
      </div>
      <div className="sm:col-span-2">
        <RadioGroup
          idPrefix="supervisoryStatus"
          name="supervisoryStatus"
          legend={intl.formatMessage(
            jobPosterTemplateMessages.supervisoryStatus,
          )}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={localizedEnumToOptions(optionsData?.supervisoryStatuses, intl)}
        />
      </div>
      <div>
        <TextArea
          id="descriptionEn"
          name="descriptionEn"
          wordLimit={descriptionWordCountLimits.en}
          label={intl.formatMessage(jobPosterTemplateMessages.description)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          appendLanguageToLabel="en"
        />
      </div>
      <div>
        <TextArea
          id="descriptionFr"
          name="descriptionFr"
          wordLimit={descriptionWordCountLimits.fr}
          label={intl.formatMessage(jobPosterTemplateMessages.description)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          appendLanguageToLabel="fr"
        />
      </div>
      <div className="sm:col-span-2">
        <Input
          id="workDescriptionEn"
          label={intl.formatMessage(
            jobPosterTemplateMessages.genericWorkDescriptionLink,
          )}
          name="workDescriptionEn"
          type="url"
          appendLanguageToLabel="en"
        />
      </div>
      <div className="sm:col-span-2">
        <Input
          id="workDescriptionFr"
          label={intl.formatMessage(
            jobPosterTemplateMessages.genericWorkDescriptionLink,
          )}
          name="workDescriptionFr"
          type="url"
          appendLanguageToLabel="fr"
        />
      </div>
      <div className="sm:col-span-2">
        <Select
          id="workStreamId"
          label={intl.formatMessage(jobPosterTemplateMessages.workStream)}
          name="workStreamId"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
          options={workStreamOptions}
        />
      </div>
      <p className="sm:col-span-2" id={keywordDescriptionParagraphId}>
        {intl.formatMessage({
          defaultMessage:
            "While keywords are optional, they can significantly increase the visibility of a template. Consider using common industry terms of similar job titles.",
          id: "m02tm1",
          description: "Description for the keywords inputs",
        })}
      </p>
      <div>
        <Input
          id="keywordsEn"
          label={intl.formatMessage(jobPosterTemplateMessages.keywords)}
          name="keywordsEn"
          type="text"
          context={intl.formatMessage({
            defaultMessage:
              "This field accepts a comma separated list of keywords related to the job.",
            id: "evoQw5",
            description: "Context for the keywords inputs",
          })}
          aria-describedby={keywordDescriptionParagraphId}
          appendLanguageToLabel="en"
          maxLength={1000}
        />
      </div>
      <div>
        <Input
          id="keywordsFr"
          label={intl.formatMessage(jobPosterTemplateMessages.keywords)}
          name="keywordsFr"
          type="text"
          context={intl.formatMessage({
            defaultMessage:
              "This field accepts a comma separated list of keywords related to the job.",
            id: "evoQw5",
            description: "Context for the keywords inputs",
          })}
          aria-describedby={keywordDescriptionParagraphId}
          appendLanguageToLabel="fr"
          maxLength={1000}
        />
      </div>
      <div>
        <Input
          id="referenceId"
          label={intl.formatMessage(jobPosterTemplateMessages.referenceId)}
          name="referenceId"
          type="text"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
    </div>
  );
};

export default JobDetailsForm;
