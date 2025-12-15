import { ReactNode } from "react";

import { Card } from "@gc-digital-talent/ui";

/**
 * @interface MessageTwoSectionsProps
 * @member {ReactNode} leftElement the JSX element to be displayed in the left half
 * @member {ReactNode} rightElement the JSX element to be displayed in the right half
 */
export interface MessageTwoSectionsProps {
  leftElement: ReactNode;
  rightElement: ReactNode;
}

const MessageTwoSections = ({
  leftElement,
  rightElement,
}: MessageTwoSectionsProps) => {
  return (
    <Card className="flex flex-col items-center gap-2 sm:flex-row">
      <div className="flex-1">{leftElement}</div>
      <div className="flex-1">{rightElement}</div>
    </Card>
  );
};

export default MessageTwoSections;
