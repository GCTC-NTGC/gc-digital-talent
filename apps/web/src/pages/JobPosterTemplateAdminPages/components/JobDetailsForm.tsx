import { useIntl } from "react-intl";
import uniqBy from "lodash/uniqBy";
import { useEffect, useId } from "react";
import { useFormContext } from "react-hook-form";

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
import { splitAndJoin } from "~/utils/nameUtils";

import { labels } from "./labels";

const TEXT_AREA_MAX_WORDS_EN = 65;

const descriptionWordCountLimits: Record<Locales, number> = {
  en: TEXT_AREA_MAX_WORDS_EN,
  fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;

const Options_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateJobDetailsFormOptions on Query {
    classifications {
      id
      group
      level
      name {
        localized
      }
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
  classificationGroup: Classification["group"] | null;
  classificationLevel: Classification["id"] | null;
  referenceId: string | null;
}

interface JobDetailsFormProps {
  optionsQuery: FragmentType<typeof Options_Fragment>;
}

const JobDetailsForm = ({ optionsQuery }: JobDetailsFormProps) => {
  const intl = useIntl();
  const keywordDescriptionParagraphId = useId();

  const optionsData = getFragment(Options_Fragment, optionsQuery);

  const classifications = unpackMaybes(optionsData?.classifications);

  const methods = useFormContext<FormValues>();
  const { watch, resetField } = methods;

  const watchGroupSelection = watch("classificationGroup");

  /**
   * Reset classification level when group changes
   * because level options change
   */
  useEffect(() => {
    resetField("classificationLevel", {
      keepDirty: false,
    });
  }, [resetField, watchGroupSelection]);

  const classGroupsWithDupes: {
    label: string;
    ariaLabel: string;
  }[] = classifications.map((classification) => {
    return {
      label:
        classification.group ||
        intl.formatMessage({
          defaultMessage: "Error: classification group not found.",
          id: "YA/7nb",
          description: "Error message if classification group is not defined.",
        }),
      ariaLabel: `${classification.name?.localized} ${splitAndJoin(
        classification.group,
      )}`,
    };
  });

  const noDupes = uniqBy(classGroupsWithDupes, "label");
  const groupOptions = noDupes.map(({ label, ariaLabel }) => {
    return {
      value: label,
      label,
      ariaLabel,
    };
  });

  const workStreams = unpackMaybes(optionsData.workStreams);
  const workStreamOptions = workStreams.map<Option>((workStream) => ({
    value: workStream.id,
    label: workStream.name?.localized,
  }));

  // generate classification levels from the selected group
  const levelOptions = classifications
    .filter((x) => x.group === watchGroupSelection)
    .map((iterator) => {
      return {
        value: iterator.id.toString(), // change the value to id for the query
        label: iterator.level.toString().padStart(2, "0"),
        numericValue: iterator.level, // just used for sorting
      };
    })
    .sort((a, b) => a.numericValue - b.numericValue);

  return (
    <div className="grid gap-6 xs:grid-cols-1 sm:grid-cols-2">
      <div>
        <Select
          id="classificationGroup"
          label={intl.formatMessage(labels.classificationGroup)}
          name="classificationGroup"
          nullSelection={intl.formatMessage(
            uiMessages.nullSelectionOptionGroup,
          )}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          options={groupOptions}
        />
      </div>
      <div>
        <Select
          id="classificationLevel"
          label={intl.formatMessage(labels.classificationLevel)}
          name="classificationLevel"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          nullSelection={intl.formatMessage(
            uiMessages.nullSelectionOptionLevel,
          )}
          options={levelOptions}
          doNotSort
        />
      </div>
      <div>
        <Input
          id="jobTitleEn"
          label={intl.formatMessage(labels.jobTitleEn)}
          name="jobTitleEn"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          type="text"
        />
      </div>
      <div>
        <Input
          id="jobTitleFr"
          label={intl.formatMessage(labels.jobTitleFr)}
          name="jobTitleFr"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          type="text"
        />
      </div>
      <div className="sm:col-span-2">
        <RadioGroup
          idPrefix="supervisoryStatus"
          name="supervisoryStatus"
          legend={intl.formatMessage(labels.supervisoryStatus)}
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
          label={intl.formatMessage(labels.descriptionEn)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
      <div>
        <TextArea
          id="descriptionFr"
          name="descriptionFr"
          wordLimit={descriptionWordCountLimits.fr}
          label={intl.formatMessage(labels.descriptionFr)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
      <div className="sm:col-span-2">
        <Input
          id="workDescriptionEn"
          label={intl.formatMessage(labels.workDescriptionEn)}
          name="workDescriptionEn"
          type="url"
        />
      </div>
      <div className="sm:col-span-2">
        <Input
          id="workDescriptionFr"
          label={intl.formatMessage(labels.workDescriptionFr)}
          name="workDescriptionFr"
          type="url"
        />
      </div>
      <div className="sm:col-span-2">
        <Select
          id="workStreamId"
          label={intl.formatMessage(labels.workStream)}
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
          label={intl.formatMessage(labels.keywordsEn)}
          name="keywordsEn"
          type="text"
          context={intl.formatMessage({
            defaultMessage:
              "This field accepts a comma separated list of keywords related to the job.",
            id: "evoQw5",
            description: "Context for the keywords inputs",
          })}
          aria-describedby={keywordDescriptionParagraphId}
        />
      </div>
      <div>
        <Input
          id="keywordsFr"
          label={intl.formatMessage(labels.keywordsFr)}
          name="keywordsFr"
          type="text"
          context={intl.formatMessage({
            defaultMessage:
              "This field accepts a comma separated list of keywords related to the job.",
            id: "evoQw5",
            description: "Context for the keywords inputs",
          })}
          aria-describedby={keywordDescriptionParagraphId}
        />
      </div>
      <div>
        <Input
          id="referenceId"
          label={intl.formatMessage(labels.referenceId)}
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
