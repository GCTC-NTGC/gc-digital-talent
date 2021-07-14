import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";
import "regenerator-runtime/runtime.js"; // This is required for useAsyncDebounce to work; it makes up for something wrong with our webpack configuration.
import InputWrapper from "./H2Components/InputWrapper";

interface GlobalFilterProps {
  preGlobalFilteredRows: any;
  globalFilter: any;
  setGlobalFilter: any;
}

const GlobalFilter: React.FC<GlobalFilterProps> = ({
  globalFilter,
  setGlobalFilter,
}) => {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((val) => {
    setGlobalFilter(val || undefined);
  }, 200);

  return (
    <InputWrapper inputId="searchTable" label="Search" required={false}>
      <input
        id="searchTable"
        type="text"
        style={{ minWidth: "100%" }}
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Start writing here..."
      />
    </InputWrapper>
  );
};

export default GlobalFilter;
