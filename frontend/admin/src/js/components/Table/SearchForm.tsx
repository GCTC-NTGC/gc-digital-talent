import React from "react";
import { useIntl } from "react-intl";
import { SearchIcon } from "@heroicons/react/outline";
import { debounce } from "lodash";

import DropdownMenu, {
  MenuButton,
  MenuItem,
  MenuList,
} from "@common/components/DropdownMenu";
import { Button } from "@common/components";

export interface SearchColumn {
  value: string;
  label: string;
}

export interface SearchFormProps {
  onChange: (term: string) => void;
  onSubmit: () => void;
  searchBy?: SearchColumn[];
}

const SearchForm: React.FC<SearchFormProps> = ({
  onChange,
  onSubmit,
  searchBy,
}) => {
  const intl = useIntl();
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [column, setColumn] = React.useState<SearchColumn | null>(null);
  const debouncedUpdate = debounce(onChange, 100);

  React.useEffect(() => {
    debouncedUpdate(searchTerm);
  }, [searchTerm, debouncedUpdate]);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm(e.currentTarget.value);
  };

  return (
    <div data-h2-display="b(flex)" data-h2-margin="b(left, s)">
      <Button
        type="button"
        onClick={onSubmit}
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
          <MenuButton color="black" data-h2-radius="b(none)">
            {column
              ? column.label
              : intl.formatMessage({
                  defaultMessage: "All table",
                  description:
                    "Text in table search form column dropdown when no column is selected.",
                })}
          </MenuButton>
          <MenuList>
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
        data-h2-width="b(100)"
      />
    </div>
  );
};

export default SearchForm;
