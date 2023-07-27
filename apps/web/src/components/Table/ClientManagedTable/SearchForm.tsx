import React, { useRef } from "react";
import { useAsyncDebounce } from "react-table";

import ResetButton from "../ResetButton";

interface SearchFormProps {
  onChange: (val: string | undefined) => void;
  value: string;
  inputId: string;
  inputLabel: string;
}

const SearchForm = ({
  onChange,
  value,
  inputId,
  inputLabel,
}: SearchFormProps) => {
  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onChange(e.target.value);
  };

  const handleReset = () => {
    onChange("");
    if (searchRef.current) {
      searchRef.current.value = "";
      searchRef.current.focus();
    }
  };

  const debouncedHandleChange = useAsyncDebounce(handleChange, 200);

  return (
    <div data-h2-position="base(relative)" data-h2-display="base(flex)">
      <input
        name="search"
        id={inputId}
        type="text"
        ref={searchRef}
        onChange={debouncedHandleChange}
        aria-label={inputLabel}
        data-h2-border="base(1px solid secondary)"
        data-h2-background-color="base(white)"
        data-h2-padding="base(x.5, x1)"
        data-h2-radius="base(s)"
      />
      {value && (
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
  );
};

export default SearchForm;
