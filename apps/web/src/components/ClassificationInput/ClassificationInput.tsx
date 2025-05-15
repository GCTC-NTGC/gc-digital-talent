import uniqBy from "lodash/uniqBy";
import { ReactNode, useEffect } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { Combobox, HiddenInput, Select } from "@gc-digital-talent/forms";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, uiMessages } from "@gc-digital-talent/i18n";

import { splitAndJoin } from "~/utils/nameUtils";

const ClassificationInput_Fragment = graphql(/* GraphQL */ `
  fragment ClassificationInput on Classification {
    id
    group
    level
    name {
      localized
    }
  }
`);

interface ClassificationInputProps {
  name: string;
  rules?: {
    group?: RegisterOptions;
    level?: RegisterOptions;
  };
  label?: {
    group?: ReactNode;
    level?: ReactNode;
  };
  classificationsQuery?: FragmentType<typeof ClassificationInput_Fragment>[];
}

const ClassificationInput = ({
  name,
  rules,
  label,
  classificationsQuery,
}: ClassificationInputProps) => {
  const intl = useIntl();
  const groupName = `${name}Group`;
  const levelName = `${name}Level`;
  const { watch, resetField, setValue } = useFormContext<{
    [name]?: string;
    [groupName]: string;
    [levelName]: string;
  }>();
  const [group, level] = watch([groupName, levelName]);
  const maybeClassifications = getFragment(
    ClassificationInput_Fragment,
    classificationsQuery,
  );
  const classifications = unpackMaybes(maybeClassifications);
  const currentClassification = classifications.find(
    (c) => c.group === group && c.level === parseInt(level ?? ""),
  );

  const groupOptions = uniqBy(
    classifications
      .filter((c) => !!c.group && !!c.name?.localized)
      .map((classification) => ({
        value: classification.group,
        label: classification.group,
        ariaLabel: `${classification?.name?.localized} ${splitAndJoin(classification.group)}`,
      })),
    "label",
  );

  const levelOptions = classifications
    .filter((c) => c.group === group)
    .map((classification) => ({
      value: classification.level,
      label: classification.level.toString(),
    }))
    .sort((a, b) => a.value - b.value);

  useEffect(() => {
    resetField(levelName, { keepDirty: false });
  }, [resetField, group, levelName]);

  useEffect(() => {
    setValue(name, currentClassification?.id);
  }, [currentClassification, name, setValue]);

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="l-tablet(4fr 1fr)"
    >
      <HiddenInput name={name} />
      <Combobox
        id={groupName}
        name={groupName}
        label={label?.group ?? intl.formatMessage(commonMessages.group)}
        rules={rules?.group}
        options={groupOptions}
      />
      <Select
        id={levelName}
        name={levelName}
        label={label?.level ?? intl.formatMessage(commonMessages.level)}
        rules={rules?.level}
        nullSelection={intl.formatMessage(uiMessages.nullSelectionOptionLevel)}
        options={levelOptions}
        doNotSort
      />
    </div>
  );
};

export default ClassificationInput;
