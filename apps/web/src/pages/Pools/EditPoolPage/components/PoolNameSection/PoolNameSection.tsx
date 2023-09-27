import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import TagIcon from "@heroicons/react/24/outline/TagIcon";

import { ToggleSection, Well } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  getLocalizedName,
  getPoolStream,
  getPublishingGroup,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  Input,
  Select,
  Submit,
  Option,
  enumToOptions,
} from "@gc-digital-talent/forms";
import { PublishingGroup } from "@gc-digital-talent/graphql";

import {
  PoolStatus,
  Classification,
  LocalizedString,
  Maybe,
  Pool,
  PoolStream,
  Scalars,
  UpdatePoolInput,
} from "~/api/generated";
import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/process/classification";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import { EditPoolSectionMetadata } from "~/types/pool";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";

import { useEditPoolContext } from "../EditPoolContext";
import Display from "./Display";

type FormValues = {
  classification?: Classification["id"];
  stream?: PoolStream;
  specificTitleEn?: LocalizedString["en"];
  specificTitleFr?: LocalizedString["fr"];
  processNumber?: string;
  publishingGroup: Maybe<PublishingGroup>;
};

export type PoolNameSubmitData = Pick<
  UpdatePoolInput,
  "classifications" | "name"
>;

interface PoolNameSectionProps {
  pool: Pool;
  classifications: Array<Maybe<Classification>>;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: PoolNameSubmitData) => Promise<void>;
}

const firstId = (
  collection: Maybe<Maybe<Classification>[]>,
): Scalars["ID"] | undefined => {
  if (!collection) return undefined;

  if (collection.length < 1) return undefined;

  return collection[0]?.id;
};

const PoolNameSection = ({
  pool,
  classifications,
  sectionMetadata,
  onSave,
}: PoolNameSectionProps): JSX.Element => {
  const intl = useIntl();
  const isNull = hasAllEmptyFields(pool);
  const emptyRequired = hasEmptyRequiredFields(pool);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired,
    fallbackIcon: TagIcon,
  });

  const dataToFormValues = (initialData: Pool): FormValues => ({
    classification: firstId(initialData.classifications), // behavior is undefined when there is more than one
    stream: initialData.stream ?? undefined,
    specificTitleEn: initialData.name?.en ?? "",
    specificTitleFr: initialData.name?.fr ?? "",
    processNumber: initialData.processNumber ?? "",
    publishingGroup: initialData.publishingGroup,
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit } = methods;

  const handleSave = async (formValues: FormValues) => {
    const data = {
      classifications: {
        sync: formValues.classification ? [formValues.classification] : [],
      },
      stream: formValues.stream ? formValues.stream : undefined,
      name: {
        en: formValues.specificTitleEn,
        fr: formValues.specificTitleFr,
      },
      processNumber: formValues.processNumber ? formValues.processNumber : null,
      publishingGroup: formValues.publishingGroup
        ? formValues.publishingGroup
        : undefined, // can't be set to null, assume not updating if empty
    };

    await onSave(data).then(() => {
      methods.reset(formValues, {
        keepDirty: false,
      });
      setIsEditing(false);
    });
  };

  const classificationOptions: Option[] = classifications
    .filter(notEmpty)
    .map(({ id, group, level, name }) => ({
      value: id,
      label: `${group}-0${level} (${getLocalizedName(name, intl)})`,
    }))
    .sort((a, b) => (a.label >= b.label ? 1 : -1));

  const streamOptions: Option[] = enumToOptions(PoolStream).map(
    ({ value }) => ({
      value,
      label: intl.formatMessage(getPoolStream(value)),
    }),
  );

  // disabled unless status is draft
  const formDisabled = pool.status !== PoolStatus.Draft;

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Select the classification intended for this recruitment process.",
    id: "fvZfiB",
    description:
      "Describes what the selecting a target classification for a process.",
  });

  return (
    <ToggleSection.Root
      id={sectionMetadata.id}
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h5"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={formDisabled}
            sectionTitle={sectionMetadata.title}
          />
        }
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      {pool && emptyRequired && (
        <Well color="error">
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You are missing required pool name and target classification information.",
              id: "+pZkyc",
              description:
                "Error message displayed when a users pool name and target classification is incomplete",
            })}
          </p>
        </Well>
      )}
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay
              title={sectionMetadata.id}
              content={subtitle}
            />
          ) : (
            <Display pool={pool} subtitle={subtitle} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <p>{subtitle}</p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(grid)"
                data-h2-gap="base(x1)"
                data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
                data-h2-margin="base(x1 0)"
              >
                <Select
                  id="classification"
                  label={intl.formatMessage({
                    defaultMessage: "Classification",
                    id: "w/qZsH",
                    description:
                      "Label displayed on the pool form classification field.",
                  })}
                  name="classification"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  options={classificationOptions}
                  disabled={formDisabled}
                />
                <Select
                  id="stream"
                  label={intl.formatMessage({
                    defaultMessage: "Streams/Job Titles",
                    id: "PzijvH",
                    description:
                      "Label displayed on the pool form stream/job title field.",
                  })}
                  name="stream"
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a stream/job title",
                    id: "fR6xVv",
                    description:
                      "Placeholder displayed on the pool form classification field.",
                  })}
                  options={streamOptions}
                  disabled={formDisabled}
                />
                <Input
                  id="specificTitleEn"
                  name="specificTitleEn"
                  type="text"
                  label={intl.formatMessage({
                    defaultMessage: "Specific Title (English)",
                    id: "fTwl6k",
                    description:
                      "Label for a pool advertisements specific English title",
                  })}
                  disabled={formDisabled}
                />
                <Input
                  id="specificTitleFr"
                  name="specificTitleFr"
                  type="text"
                  label={intl.formatMessage({
                    defaultMessage: "Specific Title (French)",
                    id: "MDjwSO",
                    description:
                      "Label for a pool advertisements specific French title",
                  })}
                  disabled={formDisabled}
                />
                <Input
                  id="processNumber"
                  name="processNumber"
                  type="text"
                  label={intl.formatMessage({
                    defaultMessage: "Process Number",
                    id: "1E0RiD",
                    description: "Label for a pools process number",
                  })}
                  context={intl.formatMessage({
                    defaultMessage:
                      "This process number is obtained from your HR shop",
                    id: "Ao/+Ba",
                    description:
                      "Additional context describing the pools process number.",
                  })}
                  disabled={formDisabled}
                />
                <Select
                  id="publishingGroup"
                  label={intl.formatMessage({
                    defaultMessage: "Publishing group",
                    id: "tQ674x",
                    description:
                      "Label displayed on the edit pool form publishing group field.",
                  })}
                  name="publishingGroup"
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a publishing group",
                    id: "Y0WLp5",
                    description: "Placeholder for publishing group field",
                  })}
                  options={enumToOptions(PublishingGroup).map(({ value }) => ({
                    value,
                    label: intl.formatMessage(getPublishingGroup(value)),
                    ariaLabel: intl
                      .formatMessage(getPublishingGroup(value))
                      .replace(
                        intl.locale === "en" ? "IT" : "TI",
                        intl.locale === "en" ? "I T" : "T I",
                      ),
                  }))}
                  disabled={formDisabled}
                />
              </div>

              {!formDisabled && (
                <Submit
                  text={intl.formatMessage({
                    defaultMessage: "Save pool name",
                    id: "bbIDc9",
                    description: "Text on a button to save the pool name",
                  })}
                  color="tertiary"
                  mode="solid"
                  isSubmitting={isSubmitting}
                />
              )}
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default PoolNameSection;
