import { Fragment, ReactNode } from "react";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

interface AriaHiddenProps {
  children: ReactNode;
}

const AriaHidden = ({ children }: AriaHiddenProps) => (
  <span aria-hidden="true">{children}</span>
);

interface StatusLabelProps {
  label?: string;
  ariaHidden?: boolean;
  children: ReactNode;
}

const StatusLabel = ({ children, label, ariaHidden }: StatusLabelProps) => {
  const intl = useIntl();
  const Wrapper = ariaHidden ? AriaHidden : Fragment;

  return (
    <div>
      <Wrapper>
        {label ?? intl.formatMessage(commonMessages.status)}
        {intl.formatMessage(commonMessages.dividingColon)}
      </Wrapper>
      {children}
    </div>
  );
};

export default StatusLabel;
