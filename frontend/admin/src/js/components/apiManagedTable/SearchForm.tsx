import React from "react";
import { useIntl } from "react-intl";

import DropdownMenu, {
  MenuButton,
  MenuItem,
  MenuList,
} from "@common/components/DropdownMenu";

import { useDebounce, type SearchColumn } from "./basicTableHelpers";

export interface SearchFormProps {
  onChange: (val: string | undefined, col: string | undefined) => void;
  searchBy?: Array<SearchColumn>;
}

const SearchForm: React.FC<SearchFormProps> = ({ onChange, searchBy }) => {
  const intl = useIntl();
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>(
    undefined,
  );
  const [column, setColumn] = React.useState<SearchColumn | undefined>(
    undefined,
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const showDropdown = searchBy && searchBy.length;

  React.useEffect(() => {
    onChange(debouncedSearchTerm, column?.value);
    // NOTE: onChange causes infinite rerenders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, column]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  const allTableMsg = intl.formatMessage({
    defaultMessage: "All table",
    description:
      "Text in table search form column dropdown when no column is selected.",
  });

  return (
    <div data-h2-display="b(flex)" data-h2-margin="b(left, s)">
      {showDropdown ? (
        <DropdownMenu>
          <MenuButton
            color="black"
            data-h2-radius="b(s, none, none, s)"
            style={{ flexShrink: 0, borderRightWidth: 0 }}
          >
            {column ? column.label : allTableMsg}
          </MenuButton>
          <MenuList>
            <MenuItem onSelect={() => setColumn(undefined)}>
              {allTableMsg}
            </MenuItem>
            {searchBy.map((col) => (
              <MenuItem key={col.value} onSelect={() => setColumn(col)}>
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
        onChange={(e) => handleChange(e)}
        aria-label={intl.formatMessage({
          defaultMessage: "Search Table",
          description: "Label for search field on admin tables.",
        })}
        placeholder={intl.formatMessage({
          defaultMessage: "Start writing here...",
          description:
            "Placeholder displayed on the Global Filter form Search field.",
        })}
        data-h2-border="b(black, all, solid, s)"
        data-h2-bg-color="b(white)"
        data-h2-padding="b(top-bottom, xs) b(right-left, s)"
        data-h2-font-size="b(caption) m(normal)"
        data-h2-font-family="b(sans)"
        {...(showDropdown
          ? {
              "data-h2-radius": "b(none, s, s, none)",
            }
          : {
              "data-h2-radius": "b(s)",
            })}
      />
    </div>
  );
};

export default SearchForm;
