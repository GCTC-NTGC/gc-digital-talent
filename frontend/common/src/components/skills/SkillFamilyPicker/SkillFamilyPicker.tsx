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
}

const NULL_SELECTION = "NULL_SELECTION";

const SkillFamilyPicker: React.FunctionComponent<SkillFamilyPickerProps> = ({
  skillFamilies,
  title,
  nullSelectionLabel,
  onSelectSkillFamily,
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
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, xs)"
      data-h2-radius="b(s)"
      role="radiogroup"
    >
      <p data-h2-font-weight="b(800)">{title}</p>
      <FormProvider {...methods}>
        <form onSubmit={undefined}>
          <RadioGroup
            idPrefix="skillFamily"
            name="skillFamily"
            hideOptional
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
        </form>
      </FormProvider>
    </div>
  );
};

export default SkillFamilyPicker;
