import React from "react";
import debounce from "lodash/debounce";
import { useIntl } from "react-intl";

import DropdownMenu, {
  MenuButton,
  MenuItem,
  MenuList,
} from "@common/components/DropdownMenu";

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

  const handleColumnChange = (col: SearchColumn | undefined) => {
    setColumn(col);
    onChange(searchTerm, col?.value);
  };

  React.useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [debouncedChangeHandler]);

  const allTableMsg = intl.formatMessage({
    defaultMessage: "All table",
    description:
      "Text in table search form column dropdown when no column is selected.",
  });

  return (
    <div data-h2-display="base(flex)">
      {showDropdown ? (
        <DropdownMenu>
          <MenuButton
            color="secondary"
            data-h2-radius="base(s, none, none, s)"
            style={{ flexShrink: 0, borderRightWidth: 0 }}
          >
            {column ? column.label : allTableMsg}
          </MenuButton>
          <MenuList>
            <MenuItem onSelect={() => handleColumnChange(undefined)}>
              {allTableMsg}
            </MenuItem>
            {searchBy.map((col) => (
              <MenuItem
                key={col.value}
                onSelect={() => handleColumnChange(col)}
              >
                {col.label}
              </MenuItem>
            ))}
          </MenuList>
        </DropdownMenu>
      ) : null}
      <input
        name="search"
        id="tableSearch"
        type="text"
        onChange={debouncedChangeHandler}
        aria-label={intl.formatMessage({
          defaultMessage: "Search Table",
          description: "Label for search field on admin tables.",
        })}
        placeholder={intl.formatMessage({
          defaultMessage: "Start writing here...",
          description:
            "Placeholder displayed on the Global Filter form Search field.",
        })}
        data-h2-border="base(all, 1px, solid, dt-secondary)"
        data-h2-background-color="base(dt-white)"
        data-h2-padding="base(x.25, x.5)"
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
