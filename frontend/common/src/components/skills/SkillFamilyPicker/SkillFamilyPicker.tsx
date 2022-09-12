import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { SkillFamily } from "../../../api/generated";
import { getLocalizedName } from "../../../helpers/localize";
import { RadioGroup } from "../../form";

type FormValues = {
  skillFamily?: SkillFamily["id"];
};

export interface SkillFamilyPickerProps {
  skillFamilies: SkillFamily[];
  title: string;
  nullSelectionLabel: string;
  onSelectSkillFamily: (id?: SkillFamily["id"]) => void;
  idPrefix?: string;
}

const NULL_SELECTION = "NULL_SELECTION";

const SkillFamilyPicker: React.FunctionComponent<SkillFamilyPickerProps> = ({
  skillFamilies,
  title,
  nullSelectionLabel,
  onSelectSkillFamily,
  idPrefix,
}) => {
  const intl = useIntl();

  const methods = useForm<FormValues>({
    defaultValues: { skillFamily: NULL_SELECTION },
  });
  const { watch } = methods;

  React.useEffect(() => {
    const subscription = watch((value) =>
      onSelectSkillFamily(
        value?.skillFamily === NULL_SELECTION ? undefined : value?.skillFamily,
      ),
    );
    return () => subscription.unsubscribe();
  }, [onSelectSkillFamily, watch]);

  const allSkillsWithDuplicates = skillFamilies.flatMap(
    (family) => family.skills,
  );
  const uniqueSkillCount = new Set(
    allSkillsWithDuplicates.map((skill) => skill?.id),
  ).size;

  return (
    <FormProvider {...methods}>
      <p data-h2-font-weight="base(700)">{title}</p>
      <RadioGroup
        idPrefix={idPrefix ?? "skillFamily"}
        name="skillFamily"
        legend={intl.formatMessage({
          defaultMessage: "Skill Families",
          id: "GuMTqQ",
          description: "Radio group legend for a list of skill families",
        })}
        hideOptional
        hideLegend
        columns={2}
        items={[
          {
            value: "NULL_SELECTION",
            label: `${nullSelectionLabel} (${uniqueSkillCount})`,
          },
          ...skillFamilies.map((family) => {
            return {
              value: family.id,
              label: `${getLocalizedName(family.name, intl)} (${
                family.skills ? family.skills.length : "0"
              })`,
            };
          }),
        ]}
      />
    </FormProvider>
  );
};

export default SkillFamilyPicker;
