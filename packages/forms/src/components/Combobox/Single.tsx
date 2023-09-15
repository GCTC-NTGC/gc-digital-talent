import React from "react";
import { useCombobox } from "downshift";

import Field from "../Field";
import Menu from "./Menu";
import { BaseProps, Option } from "./types";
import { getSingleFilteredItems } from "./utils";

type SingleProps = BaseProps & {
  onSelectedChange: (item: Option | null) => void;
  onInputChange?: (value: string) => void;
};

const Single = ({
  options,
  label,
  value,
  onSelectedChange,
  onInputChange,
  inputProps,
  isRequired = false,
}: SingleProps) => {
  const [selectedItem, setSelectedItem] = React.useState<Option | null>(
    value ?? null,
  );
  const [items, setItems] = React.useState<Option[]>(options);

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items,
    selectedItem,
    itemToString(item) {
      return item?.label?.toString() ?? "";
    },
    onInputValueChange({ inputValue }) {
      setItems(
        getSingleFilteredItems({
          options,
          selected: selectedItem,
          query: inputValue ?? "",
        }),
      );
      if (onInputChange) {
        onInputChange(inputValue ?? "");
      }
    },
    onSelectedItemChange({ selectedItem: newSelectedItem }) {
      setSelectedItem(newSelectedItem ?? null);
      if (onSelectedChange) {
        onSelectedChange(newSelectedItem ?? null);
      }
    },
  });

  return (
    <>
      <Field.Label {...getLabelProps()} required={isRequired}>
        {label}
      </Field.Label>
      <div data-h2-position="base(relative)" data-h2-width="base(100%)">
        <input
          data-h2-width="base(100%)"
          {...inputProps}
          {...getInputProps()}
        />
        <Menu.Wrapper
          {...(!isOpen && {
            "data-h2-visually-hidden": "base(invisible)",
          })}
        >
          <Menu.List {...getMenuProps()}>
            {options.map((item, index) => (
              <Menu.Item
                // eslint-disable-next-line react/no-array-index-key
                key={`${item.value}${index}`}
                active={highlightedIndex === index}
                {...getItemProps({ item, index })}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.List>
        </Menu.Wrapper>
      </div>
    </>
  );
};

export default Single;
