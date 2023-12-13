import * as React from "react";

/**
 * @interface AlertTwoSectionsProps
 * @member {JSX.Element} leftElement the JSX element to be displayed in the left half
 * @member {JSX.Element} rightElement the JSX element to be displayed in the right half
 */
export interface AlertTwoSectionsProps {
  leftElement: JSX.Element;
  rightElement: JSX.Element;
}

const AlertTwoSections = ({
  leftElement,
  rightElement,
}: AlertTwoSectionsProps) => {
  return (
    <div
      className="Alert"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) p-tablet(row)"
      data-h2-background-color="base(foreground)"
      data-h2-color="base(black)"
      data-h2-position="base(relative)"
      data-h2-border="base(2px solid black)"
      data-h2-radius="base(rounded)"
      data-h2-shadow="base(larger)"
      data-h2-overflow="base(hidden)"
      data-h2-margin="base(0, 0, x1, 0)"
      data-h2-max-width="base(72rem)"
    >
      <div data-h2-flex-grow="base(1)" data-h2-flex="base(1)">
        {leftElement}
      </div>
      <div data-h2-flex-grow="base(1)" data-h2-flex="base(1)">
        {rightElement}
      </div>
    </div>
  );
};

export default AlertTwoSections;
