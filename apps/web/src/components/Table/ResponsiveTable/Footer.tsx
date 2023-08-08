import React from "react";
import { useIntl } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";

import { Button, Loading } from "@gc-digital-talent/ui";

interface FooterProps {
  isLoading?: boolean;
  start?: React.ReactNode;
  end?: React.ReactNode;
  selection?: {
    rowCount: number;
    onClear: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  };
}

const Footer = ({ isLoading, selection, start, end }: FooterProps) => {
  const intl = useIntl();
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) l-tablet(row)"
      data-h2-gap="base(x.5 0) l-tablet(0 x.5)"
      data-h2-padding="base(x.5)"
      data-h2-background-color="base(black)"
      data-h2-color="base(white)"
      data-h2-position="base(relative)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-gap="base(x.5 0) l-tablet(0 x.5)"
      >
        {isLoading ? (
          <Loading
            inline
            data-h2-margin="base(0)"
            data-h2-location="base(auto, auto, auto, auto)"
          />
        ) : (
          <>
            {selection && (
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-gap="base(0 x.25)"
              >
                <div
                  data-h2-display="base(flex)"
                  data-h2-align-items="base(center)"
                  data-h2-gap="base(0 x.25)"
                >
                  <CheckCircleIcon
                    data-h2-width="base(1em)"
                    data-h2-height="base(1em)"
                  />
                  <span>
                    {intl.formatMessage(
                      {
                        defaultMessage: "{rowCount} items selected",
                        id: "7oFDpO",
                        description:
                          "Message displayed for the number of rows selected in a table",
                      },
                      {
                        rowCount: selection.rowCount,
                      },
                    )}
                  </span>
                </div>
                <span aria-hidden>&bull;</span>
                <Button onClick={selection.onClear} mode="inline" color="white">
                  {intl.formatMessage({
                    defaultMessage: "Clear<hidden> row selection</hidden>",
                    id: "VHG9Gm",
                    description: "Button text to deselect all table rows",
                  })}
                </Button>
              </div>
            )}
            {start}
          </>
        )}
      </div>
      {end && (
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column) l-tablet(row)"
          data-h2-gap="base(x.5 0) l-tablet(0 x.5)"
        >
          {end}
        </div>
      )}
    </div>
  );
};

export default Footer;
