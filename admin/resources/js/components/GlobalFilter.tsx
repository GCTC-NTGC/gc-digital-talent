import React, { useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { useAsyncDebounce } from "react-table";
import "regenerator-runtime/runtime.js"; // This is required for useAsyncDebounce to work; it makes up for something wrong with our webpack configuration.
import { InputWrapper } from "@common/components/inputPartials";

const messages = defineMessages({
  searchLabel: {
    id: "globalFilter.field.searchLabel",
    defaultMessage: "Search",
    description: "Label displayed on the Global Filter form Search field.",
  },
  searchPlaceholder: {
    id: "createUser.field.searchPlaceholder",
    defaultMessage: "Start writing here...",
    description:
      "Placeholder displayed on the Global Filter form Search field.",
  },
});
interface GlobalFilterProps {
  preGlobalFilteredRows: any;
  globalFilter: any;
  setGlobalFilter: any;
}

const GlobalFilter: React.FC<GlobalFilterProps> = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const intl = useIntl();
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((val) => {
    setGlobalFilter(val || undefined);
  }, 200);

  return (
    <InputWrapper
      inputId="searchTable"
      label={intl.formatMessage(messages.searchLabel)}
      required={false}
    >
      <input
        id="searchTable"
        type="text"
        style={{ minWidth: "100%" }}
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={intl.formatMessage(messages.searchPlaceholder)}
      />
    </InputWrapper>
  );
};

export default GlobalFilter;
