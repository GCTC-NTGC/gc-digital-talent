import React from "react";

import { Button } from "@common/components";
import { useIntl } from "react-intl";

const CTAButtons: React.FC = () => {
  const intl = useIntl();

  return (
    <div data-h2-display="s(flex)">
      <div data-h2-width="s(50)" data-h2-margin="b(bottom, m) s(right, s)">
        <Button color="ia-primary" mode="solid" block>
          {intl.formatMessage({
            defaultMessage: "Apply Now",
            description: "Button text to apply for program",
          })}
        </Button>
      </div>
      <div data-h2-width="s(50)" data-h2-margin="b(bottom, m) s(left, s)">
        <Button color="ia-secondary" mode="outline" block>
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
