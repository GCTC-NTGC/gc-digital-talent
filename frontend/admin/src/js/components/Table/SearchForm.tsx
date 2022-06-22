import React from "react";
import { useIntl } from "react-intl";
import { SearchIcon } from "@heroicons/react/outline";

import DropdownMenu, {
  MenuButton,
  MenuItem,
  MenuList,
} from "@common/components/DropdownMenu";
import { Button } from "@common/components";
import { Maybe } from "../../api/generated";

export interface SearchBy {
  column?: string;
  term?: string;
}
export interface SearchColumn {
  value: string;
  label: string;
}

export interface SearchFormProps {
  onSearch: (by: Maybe<SearchBy>) => void;
  searchBy?: SearchColumn[];
  initial: Maybe<SearchBy>;
}

const getInitialColumn = (
  initialColumn?: string,
  columns?: SearchColumn[],
): SearchColumn | undefined => {
  if (!initialColumn || !columns?.length) {
    return undefined;
  }

  return columns.find((column) => column.value === initialColumn);
};

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  searchBy,
  initial,
}) => {
  const intl = useIntl();
  const [searchTerm, setSearchTerm] = React.useState<string>(
    initial?.term || "",
  );
  const [column, setColumn] = React.useState<SearchColumn | undefined>(
    getInitialColumn(initial?.column, searchBy),
  );

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm(e.currentTarget.value);
  };

  const handleSearch = () => {
    onSearch({
      column: column?.value,
      term: searchTerm,
    });
  };

  const allTableMsg = intl.formatMessage({
    defaultMessage: "All table",
    description:
      "Text in table search form column dropdown when no column is selected.",
  });

  return (
    <div data-h2-display="b(flex)" data-h2-margin="b(left, s)">
      <Button
        type="button"
        onClick={handleSearch}
        color="black"
        mode="outline"
        data-h2-radius="b(s, none, none, s)"
        style={{
          flexShrink: 0,
          borderRight: "none",
        }}
      >
        <SearchIcon
          style={{ width: "1em", height: "1em", verticalAlign: "top" }}
        />
        <span data-h2-visibility="b(invisible)">
          {intl.formatMessage({
            defaultMessage: "Search",
            description: "Text label for admin table search button",
          })}
        </span>
      </Button>
      {searchBy && searchBy.length ? (
        <DropdownMenu>
          <MenuButton
            color="black"
            data-h2-radius="b(none)"
            style={{ flexShrink: 0 }}
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
        value={searchTerm}
        aria-label={intl.formatMessage({
          defaultMessage: "Search Table",
          description: "Label for search field on admin tables.",
        })}
        placeholder={intl.formatMessage({
          defaultMessage: "Start writing here...",
          description:
            "Placeholder displayed on the Global Filter form Search field.",
        })}
        onChange={handleChange}
        data-h2-border="b(black, all, solid, s)"
        data-h2-radius="b(none, s, s, none)"
        data-h2-bg-color="b(white)"
        data-h2-padding="b(top-bottom, xs) b(right-left, s)"
        data-h2-font-size="b(caption) m(normal)"
        data-h2-font-family="b(sans)"
      />
    </div>
  );
};

export default SearchForm;
