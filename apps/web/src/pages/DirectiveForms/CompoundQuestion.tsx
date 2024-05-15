import * as React from "react";

import { useLogger } from "@gc-digital-talent/logger";

export type CompoundQuestionProps = {
  title?: string;
  introduction?: React.ReactElement | React.ReactNode | string;
  inputElement: React.ReactElement;
};

// This component is for adding extra information before a form input and ensuring that the aria labels are properly attached.
const CompoundQuestion = ({
  title,
  introduction,
  inputElement,
}: CompoundQuestionProps) => {
  const logger = useLogger();
  if (!(title || introduction)) {
    logger.warning(
      "Expecting either a title or introduction to use the CompoundQuestion component",
    );
  }
  const descriptionId = React.useId();
  const clonedInput = React.cloneElement(inputElement, {
    "aria-describedby": title ? descriptionId : undefined,
  });
  return (
    <div>
      <div data-h2-margin-top="base(x.5)" id={descriptionId}>
        {title ? <div data-h2-font-weight="base(700)">{title}</div> : null}
        {introduction ? (
          <div data-h2-margin-top="base(x.5)">{introduction}</div>
        ) : null}
      </div>
      <div data-h2-margin-top="base(x.5)">{clonedInput}</div>
    </div>
  );
};

export default CompoundQuestion;
