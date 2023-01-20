import React from "react";
import { useIntl } from "react-intl";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

import Button from "../Button";
import DropdownMenu from "../DropdownMenu";
import ScrollArea from "../ScrollArea";

import { getLocalizedName } from "../../helpers/localize";
import { Scalars, SkillCategory, SkillFamily } from "../../api/generated";

interface FamilyPickerProps {
  families: Array<SkillFamily>;
  onSelectFamily: (id: SkillFamily["id"]) => void;
}

const FamilyPicker = ({ families, onSelectFamily }: FamilyPickerProps) => {
  const intl = useIntl();
  const [currentFamilyId, setCurrentFamilyId] =
    React.useState<Scalars["ID"]>("");
  const currentFamily = families.find(
    (family) => family.id === currentFamilyId,
  );

  const allSkillsLabel = intl.formatMessage({
    defaultMessage: "All skills",
    id: "6uce1H",
    description: "Label for the skill picker family filter",
  });

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
          data-h2-gap="base(0, x.25)"
          data-h2-radius="base(s, none, none, s)"
          data-h2-margin-right="base(0)"
          style={{ borderRightWidth: 0 }}
        >
          <span>
            {currentFamily
              ? getLocalizedName(currentFamily.name, intl)
              : allSkillsLabel}
          </span>
          <ChevronDownIcon
            data-h2-height="base(1em)"
            data-h2-width="base(1em)"
          />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content data-h2-padding="base(0)">
        <ScrollArea.Root
          data-h2-width="base(100%)"
          data-h2-height="base(320px)"
          data-h2-max-height="base(50vh)"
        >
          <ScrollArea.Viewport data-h2-background-color="base(white)">
            <div data-h2-padding="base(x.5, x1, x.5, x.5)">
              <DropdownMenu.RadioGroup
                value={currentFamilyId}
                onValueChange={setCurrentFamilyId}
              >
                <DropdownMenu.RadioItem
                  value=""
                  onSelect={() => {
                    onSelectFamily("");
                  }}
                >
                  <DropdownMenu.ItemIndicator>
                    <CheckIcon />
                  </DropdownMenu.ItemIndicator>
                  {allSkillsLabel}
                </DropdownMenu.RadioItem>
                {skillFamilyOptions.map((category, index) => (
                  <React.Fragment key={category.id}>
                    <DropdownMenu.Label>{category.label}</DropdownMenu.Label>
                    {category.options.map((option) => (
                      <DropdownMenu.RadioItem
                        value={option.value}
                        key={option.value}
                        onSelect={() => {
                          onSelectFamily(option.value);
                        }}
                      >
                        <DropdownMenu.ItemIndicator>
                          <CheckIcon />
                        </DropdownMenu.ItemIndicator>
                        {option.label}
                      </DropdownMenu.RadioItem>
                    ))}
                    {index + 1 < skillFamilyOptions.length && (
                      <DropdownMenu.Separator />
                    )}
                  </React.Fragment>
                ))}
              </DropdownMenu.RadioGroup>
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default FamilyPicker;
