import type { ReactNode } from "react";
import { useEffect } from "react";
import type { RegisterOptions } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { Combobox, HiddenInput, Select } from "@gc-digital-talent/forms";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, uiMessages } from "@gc-digital-talent/i18n";

import { getGroupOptions, getLevelOptions } from "~/utils/classification";

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

  const groupOptions = getGroupOptions(classifications, intl);
  const levelOptions = getLevelOptions(classifications, group);

  useEffect(() => {
    resetField(levelName, { keepDirty: false });
  }, [resetField, group, levelName]);

  useEffect(() => {
    setValue(name, currentClassification?.id);
  }, [currentClassification, name, setValue]);

  return (
    <>
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
    </>
  );
};

export default ClassificationInput;
