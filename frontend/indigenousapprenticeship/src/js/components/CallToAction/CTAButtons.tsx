import React from "react";

import { Button } from "@common/components";
import { useIntl } from "react-intl";

interface CTAButtonsProps {
  onClickApply?: () => void;
  onClickLearn?: () => void;
}

const CTAButtons: React.FC<CTAButtonsProps> = ({
  onClickApply,
  onClickLearn,
}) => {
  const intl = useIntl();

  return (
    <div data-h2-display="p-tablet(flex)">
      <div data-h2-width="p-tablet(50%)" data-h2-margin="base(0, 0, x1, 0) p-tablet(0, x.5, x1, 0)">
        <Button color="ia-primary" mode="solid" onClick={onClickApply} block>
          {intl.formatMessage({
            defaultMessage: "Apply Now",
            description: "Button text to apply for program",
          })}
        </Button>
      </div>
      <div data-h2-width="p-tablet(50%)" data-h2-margin="base(0, 0, x1, 0) p-tablet(0, 0, x1, x.5)">
        <Button
          color="ia-secondary"
          mode="outline"
          onClick={onClickLearn}
          block
        >
          {intl.formatMessage({
            defaultMessage: "Learn More",
            description: "Button text to learn more about the program",
          })}
        </Button>
      </div>
    </div>
  );
};

export default CTAButtons;
