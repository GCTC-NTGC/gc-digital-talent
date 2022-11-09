import React from "react";
import { useIntl } from "react-intl";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

import Button from "../Button";
import DropdownMenu from "../DropdownMenu";

import { getLocalizedName } from "../../helpers/localize";
import { SkillCategory, SkillFamily } from "../../api/generated";

interface FamilyPickerProps {
  families: Array<SkillFamily>;
  selectedFamilies: Array<SkillFamily["id"]>;
  onCheckedFamilyChange: (
    id: SkillFamily["id"],
    checked: boolean | "indeterminate",
  ) => void;
}

const FamilyPicker = ({
  families,
  selectedFamilies,
  onCheckedFamilyChange,
}: FamilyPickerProps) => {
  const intl = useIntl();

  const skillFamilyOptions = React.useMemo(() => {
    return [
      {
        id: "technical",
        label: intl.formatMessage({
          defaultMessage: "Technical skills",
          id: "kxseH4",
          description: "Tab name for a list of technical skills",
        }),
        options: families
          .filter((sf) => sf.category === SkillCategory.Technical)
          .map((family) => ({
            value: family.id,
            label: getLocalizedName(family.name, intl),
          })),
      },
      {
        id: "behavioural",
        label: intl.formatMessage({
          defaultMessage: "Behavioural skills",
          id: "LjkK5G",
          description: "Tab name for a list of behavioural skills",
        }),
        options: families
          .filter((sf) => sf.category === SkillCategory.Behavioural)
          .map((family) => ({
            value: family.id,
            label: getLocalizedName(family.name, intl),
          })),
      },
    ];
  }, [families, intl]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          color="primary"
          mode="outline"
          data-h2-align-items="base(center)"
          data-h2-display="base(flex)"
          data-h2-flex-shrink="base(0)"
          data-h2-gap="base(x.25, 0)"
          data-h2-radius="base(s, none, none, s)"
          data-h2-margin-right="base(0)"
          style={{ borderRightWidth: 0 }}
        >
          <span>
            {intl.formatMessage({
              defaultMessage: "Families",
              id: "JyUPiu",
              description: "Label for the skill picker family filter",
            })}
          </span>
          {selectedFamilies.length > 0 ? (
            <span
              data-h2-radius="base(9999px)"
              data-h2-background-color="base(dt-primary)"
              data-h2-font-weight="base(400)"
              data-h2-color="base(dt-white)"
              data-h2-padding="base(x.15, x.25)"
              data-h2-font-size="base(caption, 1)"
            >
              {selectedFamilies.length}
            </span>
          ) : null}
          <ChevronDownIcon
            data-h2-height="base(1em)"
            data-h2-width="base(1em)"
          />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {skillFamilyOptions.map((category, index) => (
          <React.Fragment key={category.id}>
            <DropdownMenu.Label>{category.label}</DropdownMenu.Label>
            <DropdownMenu.Group>
              {category.options.map((option) => (
                <DropdownMenu.CheckboxItem
                  key={option.value}
                  checked={selectedFamilies.includes(option.value)}
                  onCheckedChange={(checked) =>
                    onCheckedFamilyChange(option.value, checked)
                  }
                  onSelect={(e) => {
                    // Prevent dropdown closing on select
                    e.preventDefault();
                  }}
                >
                  <DropdownMenu.ItemIndicator>
                    <CheckIcon />
                  </DropdownMenu.ItemIndicator>
                  {option.label}
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.Group>
            {index + 1 < skillFamilyOptions.length && (
              <DropdownMenu.Separator />
            )}
          </React.Fragment>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default FamilyPicker;
