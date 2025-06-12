import { useIntl } from "react-intl";
import debounce from "lodash/debounce";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";
import { inputStyles, Field } from "@gc-digital-talent/forms";

import ResetButton from "../ResetButton";
import { SearchFormProps, SearchColumn, SearchState } from "./types";

/**
 * Search form
 *
 * Search the table data either by a general search
 * or by specific columns (searchBy)
 *
 * @param SearchFormProps
 * @returns JSX.Element
 */
const SearchForm = <T,>({
  table,
  onChange,
  searchBy,
  state,
  label,
  id,
  inputProps,
  overrideAllTableMsg,
}: SearchFormProps<T>) => {
  const intl = useIntl();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const initialColumn =
    state?.type && searchBy
      ? searchBy.find((column) => column.value === state?.type)
      : undefined;

  const [column, setColumn] = useState<SearchColumn | undefined>(initialColumn);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(state?.term);
  const showDropdown = searchBy?.length;

  const updateTable = useCallback(
    (newState: SearchState) => {
      table.resetPageIndex(true); // Go to first page when searching
      if (newState.type && newState.type !== "") {
        table.setGlobalFilter("");
        table.setColumnFilters([
          {
            id: newState.type,
            value: newState.term,
          },
        ]);
      } else {
        table.setColumnFilters([]);
        table.setGlobalFilter(newState.term);
      }

      if (onChange) {
        onChange(newState);
      }
    },
    [onChange, table],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setSearchTerm(e.target.value);
      updateTable({
        term: e.target.value,
        type: column?.value,
      });
    },
    [column, updateTable],
  );

  const handleReset = () => {
    setSearchTerm("");
    updateTable({
      term: "",
      type: column?.value,
    });
    if (searchRef.current) {
      searchRef.current.value = "";
      searchRef.current.focus();
    }
  };

  const debouncedChangeHandler = useMemo(
    () => debounce(handleChange, 300),
    [handleChange],
  );

  const handleColumnChange = (col: string) => {
    setColumn(searchBy?.find((item) => item.value === col));
    updateTable({
      term: searchTerm,
      type: col,
    });
  };

  const defaultAllTableMsg = intl.formatMessage({
    defaultMessage: "Entire table",
    id: "z59tbA",
    description:
      "Default text in table search form column dropdown when no column is selected",
  });

  const allTableMsg = overrideAllTableMsg ?? defaultAllTableMsg;

  return (
    <div data-h2-width="base(100%) laptop(auto)">
      <Field.Label
        htmlFor={id}
        data-h2-display="base(inline-block)"
        data-h2-margin-bottom="base(x.15)"
      >
        {label}
      </Field.Label>
      <div data-h2-display="base(flex)" data-h2-width="base(100%) laptop(auto)">
        {showDropdown ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button
                color="primary"
                utilityIcon={ChevronDownIcon}
                data-h2-radius="base(s 0 0 s)"
                data-h2-flex-shrink="base(0)"
              >
                {intl.formatMessage(
                  {
                    defaultMessage: "Filter by {column}",
                    id: "tuMmWm",
                    description:
                      "Button text to filter by specific columns in table",
                  },
                  {
                    column: column ? column.label : "",
                  },
                )}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.RadioGroup
                value={column?.value}
                onValueChange={handleColumnChange}
              >
                <DropdownMenu.RadioItem value="">
                  {allTableMsg}
                </DropdownMenu.RadioItem>
                {searchBy.map((col) => (
                  <DropdownMenu.RadioItem key={col.value} value={col.value}>
                    <DropdownMenu.ItemIndicator>
                      <CheckIcon />
                    </DropdownMenu.ItemIndicator>
                    {col.label}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ) : null}
        <div
          data-h2-position="base(relative)"
          data-h2-display="base(flex)"
          data-h2-flex-grow="base(1)"
        >
          <div
            aria-hidden
            data-h2-position="base(absolute)"
            data-h2-location="base(x.25, auto, x.25, x.25)"
            data-h2-display="base(flex)"
            data-h2-align-items="base(center)"
          />
          <input
            name="search"
            id={id}
            type="text"
            ref={searchRef}
            onChange={debouncedChangeHandler}
            defaultValue={state?.term}
            className={inputStyles()}
            data-h2-background-color="base(foreground)"
            data-h2-border-color="base(gray) base:focus-visible(focus)"
            data-h2-margin-left="base(0)"
            data-h2-padding="base(x.5 x1.5 x.5 x.5)"
            data-h2-width="base(100%) laptop(auto)"
            {...(showDropdown
              ? {
                  "data-h2-radius": "base(0, s, s, 0)",
                  "data-h2-border-left-color": "laptop(transparent)",
                }
              : {
                  "data-h2-radius": "base(s)",
                })}
            {...inputProps}
          />
          {searchTerm && (
            <div
              data-h2-position="base(absolute)"
              data-h2-location="base(x.25, x.25, x.25, auto)"
              data-h2-display="base(flex)"
              data-h2-align-items="base(stretch)"
            >
              <ResetButton onClick={handleReset} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
