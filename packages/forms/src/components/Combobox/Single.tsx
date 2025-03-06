import { useState, useRef, useMemo, useEffect } from "react";
import { useCombobox } from "downshift";
import isEqual from "lodash/isEqual";

import Field from "../Field";
import Menu from "./Menu";
import Input from "./Input";
import { BaseProps, Option } from "./types";
import { getSingleFilteredItems, itemToString } from "./utils";

type SingleProps = BaseProps & {
  onSelectedChange: (item: Option | null) => void;
  onInputChange?: (value: string) => void;
  /** Initial value */
  value?: Option;
};

const Single = ({
  options,
  label,
  clearLabel,
  toggleLabel,
  value,
  onSelectedChange,
  onInputChange,
  inputProps,
  total,
  isExternalSearch = false,
  fetching = false,
  isRequired = false,
}: SingleProps) => {
  const [previousOptions, setPreviousOptions] = useState<Option[]>(options);
  const [available, setAvailable] = useState<Option[]>(options);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Note: Pattern comes from https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (!isEqual(options, previousOptions)) {
    setAvailable(options);
    setPreviousOptions(options);
  }
  const items = useMemo(
    () => (isExternalSearch ? options : available),
    [available, isExternalSearch, options],
  );

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getToggleButtonProps,
    highlightedIndex,
    getItemProps,
    selectItem,
    inputValue,
    selectedItem,
  } = useCombobox({
    items,
    initialSelectedItem: value,
    itemToString,
    onInputValueChange({
      inputValue: newInputValue,
      selectedItem: newSelectedItem,
    }) {
      if (!isExternalSearch) {
        setAvailable(
          getSingleFilteredItems({
            options,
            selected: newSelectedItem,
            query: newInputValue ?? "",
          }),
        );
      }
      if (onInputChange) {
        onInputChange(newInputValue ?? "");
      }
    },
    onSelectedItemChange({ selectedItem: newSelectedItem }) {
      const newItem =
        newSelectedItem?.value === selectedItem?.value ? null : newSelectedItem;
      onSelectedChange(newItem ?? null);
    },
  });

  const handleClear = () => {
    selectItem(null);
    inputRef?.current?.focus();
  };

  useEffect(() => {
    if (!value?.value) {
      selectItem(null);
    }
  }, [selectItem, value?.value]);

  return (
    <>
      <Field.Label {...getLabelProps()} required={isRequired}>
        {label}
      </Field.Label>
      <div data-h2-position="base(relative)" data-h2-width="base(100%)">
        <Input.Wrapper>
          <Input.Search />
          <input
            {...inputProps}
            {...getInputProps({
              ref: inputRef,
            })}
            {...(inputValue.length > 0
              ? {
                  "data-h2-padding": "base(x.5 x3.125 x.5 x1.5)",
                }
              : { "data-h2-padding": "base(x.5 x1.5)" })}
            data-h2-width="base(100%)"
          />
          <Input.Actions>
            {inputValue.length ? (
              <>
                <Input.Clear
                  tabIndex={-1}
                  aria-label={clearLabel}
                  onClick={handleClear}
                />
                <Input.Separator />
              </>
            ) : null}
            <Input.Toggle
              isOpen={isOpen}
              aria-label={toggleLabel}
              {...getToggleButtonProps()}
            />
          </Input.Actions>
        </Input.Wrapper>
        <Menu.Wrapper
          {...(!isOpen && {
            "data-h2-visually-hidden": "base(invisible)",
          })}
        >
          <Menu.Available total={total} count={items.length} />
          {fetching || !items.length ? (
            <Menu.Empty fetching={fetching} />
          ) : null}
          <Menu.List
            {...getMenuProps()}
            {...(!isOpen && {
              "data-h2-display": "base(none)",
            })}
          >
            {items.map((item, index) => (
              <Menu.Item
                key={`${item.value}${index}`}
                active={highlightedIndex === index}
                selected={selectedItem?.value === item.value}
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
