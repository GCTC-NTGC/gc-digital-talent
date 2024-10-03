import { ReactElement, ReactNode, useId, cloneElement } from "react";

import { useLogger } from "@gc-digital-talent/logger";

interface CompoundQuestionProps {
  title?: string;
  introduction?: ReactElement | ReactNode | string;
  inputElement: ReactElement;
}

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
  const descriptionId = useId();
  const clonedInput = cloneElement(inputElement, {
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
