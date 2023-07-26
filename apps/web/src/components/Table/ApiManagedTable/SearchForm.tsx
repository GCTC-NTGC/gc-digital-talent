import React, { useRef } from "react";
import debounce from "lodash/debounce";
import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/24/solid/CheckIcon";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";

import type { SearchColumn, SearchState } from "./helpers";
import ResetButton from "../ResetButton";

interface SearchFormProps {
  onChange: (val: string | undefined, col: string | undefined) => void;
  searchBy?: Array<SearchColumn>;
  initialData?: SearchState;
  inputId: string;
  inputLabel: string;
}

const SearchForm = ({
  onChange,
  searchBy,
  initialData,
  inputId,
  inputLabel,
}: SearchFormProps) => {
  const intl = useIntl();
  const searchRef = useRef<HTMLInputElement | null>(null);

  const initialColumn =
    initialData?.type && searchBy
      ? searchBy.find((column) => column.value === initialData?.type)
      : undefined;

  const [column, setColumn] = React.useState<SearchColumn | undefined>(
    initialColumn,
  );
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>(
    initialData?.term,
  );
  const showDropdown = searchBy && searchBy.length;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setSearchTerm(e.target.value);
      onChange(e.target.value, column?.value);
    },
    [column, onChange],
  );

  const handleReset = () => {
    setSearchTerm("");
    onChange("", column?.value);
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
    onChange(searchTerm, col);
  };

  const allTableMsg = intl.formatMessage({
    defaultMessage: "All columns",
    id: "BBH/2J",
    description:
      "Text in table search form column dropdown when no column is selected.",
  });

  return (
    <div data-h2-display="base(flex)">
      {showDropdown ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button
              color="secondary"
              utilityIcon={ChevronDownIcon}
              data-h2-radius="base(s 0 0 s)"
            >
              {column ? column.label : allTableMsg}
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
      <div data-h2-position="base(relative)" data-h2-display="base(flex)">
        <input
          name="search"
          id={inputId}
          type="text"
          ref={searchRef}
          onChange={debouncedChangeHandler}
          defaultValue={initialData?.term}
          aria-label={inputLabel}
          data-h2-border="base(1px solid secondary)"
          data-h2-background-color="base(white)"
          data-h2-padding="base(x.25, x.5)"
          data-h2-margin-left="base(0)"
          {...(showDropdown
            ? {
                "data-h2-radius": "base(0, s, s, 0)",
              }
            : {
                "data-h2-radius": "base(s)",
              })}
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
  );
};

export default SearchForm;
