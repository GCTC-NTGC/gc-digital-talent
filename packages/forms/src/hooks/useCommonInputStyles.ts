import { StyleRecord } from "../types";

type UseCommonInputStyles = () => StyleRecord;

const useCommonInputStyles: UseCommonInputStyles = () => {
  return {
    "data-h2-border-style": "base(solid)",
    "data-h2-border-width": "base(1px)",
    "data-h2-padding": "base(x.5)",
    "data-h2-radius": "base(rounded)",
  };
};

export default useCommonInputStyles;
