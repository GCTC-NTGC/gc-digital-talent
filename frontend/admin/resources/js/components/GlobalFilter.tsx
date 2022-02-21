import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useAsyncDebounce } from "react-table";
import "regenerator-runtime/runtime"; // This is required for useAsyncDebounce to work; it makes up for something wrong with our webpack configuration.
import { InputWrapper } from "@common/components/inputPartials";

interface GlobalFilterProps {
  globalFilter: unknown;
  setGlobalFilter: unknown;
}

const GlobalFilter: React.FC<GlobalFilterProps> = ({
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
      label={intl.formatMessage({
        defaultMessage: "Search",
        description: "Label displayed on the Global Filter form Search field.",
      })}
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
        placeholder={intl.formatMessage({
          defaultMessage: "Start writing here...",
          description:
            "Placeholder displayed on the Global Filter form Search field.",
        })}
      />
    </InputWrapper>
  );
};

export default GlobalFilter;
