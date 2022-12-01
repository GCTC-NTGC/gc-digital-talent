import React from "react";
import debounce from "lodash/debounce";
import { useIntl } from "react-intl";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

import DropdownMenu from "@common/components/DropdownMenu";

import { Button } from "@common/components";
import type { SearchColumn } from "./basicTableHelpers";

export interface SearchFormProps {
  onChange: (val: string | undefined, col: string | undefined) => void;
  searchBy?: Array<SearchColumn>;
}

const SearchForm: React.FC<SearchFormProps> = ({ onChange, searchBy }) => {
  const intl = useIntl();
  const [column, setColumn] = React.useState<SearchColumn | undefined>(
    undefined,
  );
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>(
    undefined,
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

  const debouncedChangeHandler = React.useMemo(
    () => debounce(handleChange, 300),
    [handleChange],
  );

  const handleColumnChange = (col: string) => {
    setColumn(searchBy?.find((item) => item.value === col));
    onChange(searchTerm, col);
  };

  React.useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [debouncedChangeHandler]);

  const allTableMsg = intl.formatMessage({
    defaultMessage: "All table",
    id: "IMdFJM",
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
              mode="outline"
              data-h2-align-items="base(center)"
              data-h2-display="base(flex)"
              data-h2-flex-shrink="base(0)"
              data-h2-gap="base(x.25, 0)"
              data-h2-radius="base(s, none, none, s)"
              data-h2-margin-right="base(0)"
              style={{ borderRightWidth: 0 }}
            >
              <span>{column ? column.label : allTableMsg}</span>
              <ChevronDownIcon
                data-h2-height="base(1em)"
                data-h2-width="base(1em)"
              />
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
      <input
        name="search"
        id="tableSearch"
        type="text"
        onChange={debouncedChangeHandler}
        aria-label={intl.formatMessage({
          defaultMessage: "Search Table",
          id: "chFoB8",
          description: "Label for search field on admin tables.",
        })}
        placeholder={intl.formatMessage({
          defaultMessage: "Start writing here...",
          id: "3F6QqF",
          description:
            "Placeholder displayed on the Global Filter form Search field.",
        })}
        data-h2-border="base(all, 1px, solid, dt-secondary)"
        data-h2-background-color="base(dt-white)"
        data-h2-padding="base(x.25, x.5)"
        data-h2-margin-left="base(0)"
        {...(showDropdown
          ? {
              "data-h2-radius": "base(none, s, s, none)",
            }
          : {
              "data-h2-radius": "base(s)",
            })}
      />
    </div>
  );
};

export default SearchForm;
