import React from "react";
import { useIntl } from "react-intl";
import debounce from "lodash/debounce";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";

import { Button, DropdownMenu, cn } from "@gc-digital-talent/ui";
import { useCommonInputStyles, Field } from "@gc-digital-talent/forms";

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
  const searchRef = React.useRef<HTMLInputElement | null>(null);
  const styles = useCommonInputStyles();
  const initialColumn =
    state?.type && searchBy
      ? searchBy.find((column) => column.value === state?.type)
      : undefined;

  const [column, setColumn] = React.useState<SearchColumn | undefined>(
    initialColumn,
  );
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>(
    state?.term,
  );
  const showDropdown = searchBy && searchBy.length;

  const updateTable = React.useCallback(
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

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const debouncedChangeHandler = React.useMemo(
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
    <div className="w-full md:w-auto">
      <Field.Label htmlFor={id} className="mb-1 inline-block">
        {label}
      </Field.Label>
      <div className="flex w-full md:w-auto">
        {showDropdown ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button
                color="secondary"
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
        <div className="relative flex flex-grow">
          <div
            aria-hidden
            className="absolute bottom-1.5 left-1.5 top-1.5 flex items-center"
          />
          <input
            name="search"
            id={id}
            type="text"
            ref={searchRef}
            onChange={debouncedChangeHandler}
            defaultValue={state?.term}
            {...styles}
            className={cn("ml-0 w-full p-3 pr-10 md:w-auto", {
              "!rounded-l-none": showDropdown,
              "!rounded": !showDropdown,
            })}
            data-h2-background-color="base(foreground)"
            data-h2-border-color="base(gray) base:focus-visible(focus)"
            {...(showDropdown && {
              "data-h2-border-left-color": "l-tablet(transparent)",
            })}
            {...inputProps}
          />
          {searchTerm && (
            <div className="absolute bottom-1.5 right-1.5 top-1.5 flex items-stretch">
              <ResetButton onClick={handleReset} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
