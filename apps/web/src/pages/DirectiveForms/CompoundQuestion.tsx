import React from "react";

export type CompoundQuestionProps = {
  title?: string;
  introduction?: React.ReactElement | React.ReactNode | string;
  inputElement: React.ReactElement;
};

const CompoundQuestion = ({
  title,
  introduction,
  inputElement,
}: CompoundQuestionProps) => {
  const descriptionId = React.useId();
  const detailsId = React.useId();
  const clonedInput = React.cloneElement(inputElement, {
    "aria-describedby": title ? descriptionId : undefined,
    "aria-details": introduction ? detailsId : undefined,
  });
  return (
    <div>
      <div data-h2-margin-top="base(x.5)">
        {title ? (
          <div data-h2-font-weight="base(700)" id={descriptionId}>
            {title}
          </div>
        ) : null}
        {introduction ? (
          <div data-h2-margin-top="base(x.5)" id={detailsId}>
            {introduction}
          </div>
        ) : null}
      </div>
      <div data-h2-margin-top="base(x.5)">{clonedInput}</div>
    </div>
  );
};

export default CompoundQuestion;
