import React from "react";
import { useIntl } from "react-intl";
import { useAsyncDebounce } from "react-table";

export interface SearchFormProps {
  onChange: (val: string | undefined) => void;
  value: string | undefined;
}

const SearchForm: React.FC<SearchFormProps> = ({ onChange, value }) => {
  const intl = useIntl();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onChange(e.target.value);
  };

  const debouncedHandleChange = useAsyncDebounce(handleChange, 200);

  return (
    <div data-h2-display="b(flex)" data-h2-margin="b(left, s)">
      <input
        name="search"
        id="tableSearch"
        type="text"
        onChange={debouncedHandleChange}
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
        data-h2-radius="b(s)"
        data-h2-bg-color="b(white)"
        data-h2-padding="b(top-bottom, xs) b(right-left, s)"
        data-h2-font-size="b(caption) m(normal)"
        data-h2-font-family="b(sans)"
      />
    </div>
  );
};

export default SearchForm;
