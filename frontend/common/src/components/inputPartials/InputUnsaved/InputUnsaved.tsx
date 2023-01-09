import React from "react";
import { useIntl } from "react-intl";
import { commonMessages } from "../../../messages";

interface InputUnsavedProps
  extends Omit<React.HTMLProps<HTMLSpanElement>, "children"> {
  isVisible?: boolean;
}

const InputUnsaved = ({ isVisible, ...rest }: InputUnsavedProps) => {
  const intl = useIntl();

  return isVisible ? (
    <span
      data-h2-font-size="base(caption)"
      data-h2-display="base(inline-block)"
      data-h2-margin="base(0, 0, 0, x.125)"
      data-h2-color="base(tm-blue.darkest)"
      {...rest}
    >
      {intl.formatMessage(commonMessages.unSaved)}
    </span>
  ) : null;
};

export default InputUnsaved;
