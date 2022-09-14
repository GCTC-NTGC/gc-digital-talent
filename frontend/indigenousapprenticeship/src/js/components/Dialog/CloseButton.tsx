import React from "react";
import { useIntl } from "react-intl";
import { Button } from "@common/components";

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  const intl = useIntl();
  return (
    <div data-h2-display="base(flex)" data-h2-justify-content="base(flex-end)">
      <Button onClick={onClick} mode="outline" color="ia-secondary">
        {intl.formatMessage({
          defaultMessage: "Close",
          id: "4p0QdF",
          description: "Button text used to close an open modal",
        })}
      </Button>
    </div>
  );
};

export default CloseButton;
