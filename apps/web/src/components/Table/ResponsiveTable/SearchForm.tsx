import React from "react";
import { useIntl } from "react-intl";
import debounce from "lodash/debounce";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";
import { useCommonInputStyles } from "@gc-digital-talent/forms";

import { SearchState, SearchColumn } from "./types";
import ResetButton from "../ResetButton";

interface SearchFormProps {
  /** Callback for when state changes */
  onChange: (newState: SearchState) => void;
  /** Columns that can be searched on */
  searchBy?: SearchColumn[];
  /** The initial state for the search form */
  state?: SearchState;
  /** Accessible name for the search text input */
  label: React.AriaAttributes["aria-label"];
  /** ID value for the search form */
  id: React.HTMLAttributes<HTMLInputElement>["id"];
  /** Additional props forwarded to the search input */
  inputProps?: Omit<React.HTMLProps<HTMLInputElement>, "aria-label" | "id">;
}

/**
 * Search form
 *
 * Search the table data either by a general search
 * or by specific columns (searchBy)
 *
 * @param SearchFormProps
 * @returns JSX.Element
 */
const SearchForm = ({
  onChange,
  searchBy,
  state,
  label,
  id,
  inputProps,
}: SearchFormProps) => {
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

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setSearchTerm(e.target.value);
      onChange({
        term: e.target.value,
        type: column?.value,
      });
    },
    [column, onChange],
  );

  const handleReset = () => {
    setSearchTerm("");
    onChange({
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
    onChange({
      term: searchTerm,
      type: col,
    });
  };

  const allTableMsg = intl.formatMessage({
    defaultMessage: "All columns",
    id: "BBH/2J",
    description:
      "Text in table search form column dropdown when no column is selected.",
  });

  return (
    <div data-h2-display="base(flex)" data-h2-width="base(100%) l-tablet(auto)">
      {showDropdown ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button
              color="secondary"
              utilityIcon={ChevronDownIcon}
              data-h2-radius="base(s 0 0 s)"
              data-h2-flex-shrink="base(0)"
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
      <div
        data-h2-position="base(relative)"
        data-h2-display="base(flex)"
        data-h2-flex-grow="base(1)"
      >
        <input
          name="search"
          id={id}
          type="text"
          ref={searchRef}
          onChange={debouncedChangeHandler}
          defaultValue={state?.term}
          aria-label={label}
          {...styles}
          data-h2-background-color="base(foreground)"
          data-h2-border-color="base(gray) base:focus-visible(focus)"
          data-h2-margin-left="base(0)"
          data-h2-width="base(100%) l-tablet(auto)"
          {...(showDropdown
            ? {
                "data-h2-radius": "base(0, s, s, 0)",
                "data-h2-border-left-color": "base(transparent)",
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
  );
};

export default SearchForm;
