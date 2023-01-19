import React from "react";
import { useIntl } from "react-intl";
import { useAsyncDebounce } from "react-table";

export interface SearchFormProps {
  onChange: (val: string | undefined) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onChange }) => {
  const intl = useIntl();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onChange(e.target.value);
  };

  const debouncedHandleChange = useAsyncDebounce(handleChange, 200);

  return (
    <div data-h2-display="base(flex)">
      <input
        name="search"
        id="tableSearch"
        type="text"
        onChange={debouncedHandleChange}
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
        data-h2-border="base(1px solid dt-secondary)"
        data-h2-background-color="base(dt-white)"
        data-h2-padding="base(x.5, x1)"
        data-h2-radius="base(s)"
      />
    </div>
  );
};

export default SearchForm;
