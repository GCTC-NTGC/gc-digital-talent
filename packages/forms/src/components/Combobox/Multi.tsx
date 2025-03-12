import { useState, useRef, useMemo } from "react";
import { useIntl } from "react-intl";
import { useCombobox, useMultipleSelection } from "downshift";
import isEqual from "lodash/isEqual";

import { formMessages } from "@gc-digital-talent/i18n";
import { Button } from "@gc-digital-talent/ui";

import Field from "../Field";
import Menu from "./Menu";
import Input from "./Input";
import Selected from "./Selected";
import { BaseProps, Option } from "./types";
import { getMultiFilteredItems, itemToString, isItemSelected } from "./utils";

type MultiProps = BaseProps & {
  onSelectedChange: (item: Option[] | null) => void;
  onInputChange?: (value: string) => void;
  /** Initial value */
  value?: Option[];
};

const Multi = ({
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
}: MultiProps) => {
  const intl = useIntl();
  const [inputValue, setInputValue] = useState<string>("");
  const [previousOptions, setPreviousOptions] = useState<Option[]>(options);
  const [available, setAvailable] = useState<Option[]>(options);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // NOTE: Pattern comes from https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (!isEqual(options, previousOptions)) {
    setPreviousOptions(options);
    setAvailable(options);
  }
  const items = useMemo(
    () => (isExternalSearch ? options : available),
    [available, isExternalSearch, options],
  );

  const handleInputChanged = (newQuery?: string) => {
    const query = newQuery ?? "";
    if (!isExternalSearch) {
      setAvailable(
        getMultiFilteredItems({
          options,
          query,
        }),
      );
    }
    setInputValue(query);
    if (onInputChange) {
      onInputChange(query);
    }
  };

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
    reset,
  } = useMultipleSelection<Option>({
    initialSelectedItems: value,
    // Reverse the keyboard navigation (we place our chips after the input, not before)
    keyNavigationPrevious: "ArrowRight",
    keyNavigationNext: "ArrowLeft",
    stateReducer({ activeIndex }, { type, changes: newChanges }) {
      let changes = newChanges;
      let newActiveIndex: number;
      switch (type) {
        case useMultipleSelection.stateChangeTypes
          .SelectedItemKeyDownNavigationNext:
          changes = {
            ...changes,
            activeIndex: activeIndex - 1 < 0 ? 0 : activeIndex - 1,
          };
          break;
        case useMultipleSelection.stateChangeTypes
          .SelectedItemKeyDownNavigationPrevious:
          changes = {
            ...changes,
            activeIndex:
              activeIndex + 1 >= selectedItems.length ? -1 : activeIndex + 1,
          };
          break;
        case useMultipleSelection.stateChangeTypes
          .DropdownKeyDownNavigationPrevious:
          changes = {
            ...changes,
            activeIndex: 0,
          };
          break;
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          if (activeIndex < 0) {
            break;
          }

          newActiveIndex = activeIndex - 1;

          if (selectedItems.length === 1) {
            newActiveIndex = -1;
          } else if (activeIndex === selectedItems.length - 1) {
            newActiveIndex = selectedItems.length - 2;
          }

          changes = {
            selectedItems: [
              ...selectedItems.slice(0, activeIndex),
              ...selectedItems.slice(activeIndex + 1),
            ],
            ...{ activeIndex: newActiveIndex },
          };

          break;
        default:
          break;
      }

      return changes;
    },
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
        case useMultipleSelection.stateChangeTypes.FunctionAddSelectedItem:
        case useMultipleSelection.stateChangeTypes.FunctionReset:
          onSelectedChange(newSelectedItems ?? null);
          break;
        default:
          break;
      }
    },
  });

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getToggleButtonProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items,
    itemToString,
    selectedItem: null,
    inputValue,
    onStateChange({ type, selectedItem, inputValue: newInputValue }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          handleInputChanged(newInputValue);
          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (!selectedItem) {
            break;
          }
          if (isItemSelected(selectedItem, selectedItems)) {
            removeSelectedItem(selectedItem);
          } else {
            addSelectedItem(selectedItem);
          }
          break;
        default:
          break;
      }
    },
    stateReducer(state, { type, changes }) {
      switch (type) {
        case useCombobox.stateChangeTypes.FunctionSelectItem:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: state.isOpen, // keep old isOpen state
            highlightedIndex: state.highlightedIndex, // keep old highlightedIndex state
          };
        default:
          return changes;
      }
    },
  });

  const handleClear = () => {
    handleInputChanged("");
    inputRef?.current?.focus();
  };

  const handleReset = () => {
    reset();
    inputRef?.current?.focus();
  };

  const hasSelectedItems = selectedItems.length > 0;

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
            {...getInputProps(
              getDropdownProps({ preventKeyAction: isOpen, ref: inputRef }),
            )}
            {...(inputValue.length > 0
              ? {
                  "data-h2-padding": "base(x.5 x3.125 x.5 x1.5)",
                }
              : { "data-h2-padding": "base(x.5 x1.5)" })}
            data-h2-width="base(100%)"
            data-h2-radius="base(rounded rounded 0 0)"
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
                selected={
                  !!selectedItems.find(
                    (selected) => selected.value === item.value,
                  )
                }
                {...getItemProps({ item, index })}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.List>
        </Menu.Wrapper>
      </div>
      <Selected.Wrapper>
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-justify-content="base(space-between)"
          data-h2-gap="base(x.25)"
        >
          <p
            data-h2-font-size="base(caption)"
            data-h2-color="base(black.light) base:dark(gray.light)"
          >
            {intl.formatMessage(formMessages.itemsSelectedCombobox, {
              count: selectedItems.length,
            })}
          </p>
          {hasSelectedItems ? (
            <Button
              type="button"
              mode="inline"
              color="black"
              fontSize="caption"
              onClick={handleReset}
              data-h2-font-weight="base(400)"
            >
              {intl.formatMessage(formMessages.clearSelectedCombobox)}
            </Button>
          ) : null}
        </div>
        {hasSelectedItems && (
          <Selected.Items>
            {selectedItems.map((selectedItem, index) => (
              <Selected.Item
                key={`${selectedItem.value}-selected`}
                {...getSelectedItemProps({ selectedItem, index })}
                onClick={() => removeSelectedItem(selectedItem)}
              >
                {selectedItem.label}
              </Selected.Item>
            ))}
          </Selected.Items>
        )}
      </Selected.Wrapper>
    </>
  );
};

export default Multi;
