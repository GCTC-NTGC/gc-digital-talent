import React from "react";

export type CompoundQuestionProps = {
  title: string;
  introduction: React.ReactElement | string;
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
    "aria-describedby": descriptionId,
    "aria-details": detailsId,
  });
  return (
    <div>
      <div data-h2-margin-top="base(x.5)">
        <p data-h2-font-weight="base(700)" id={descriptionId}>
          {title}
        </p>
        <p data-h2-margin-top="base(x.5)" id={detailsId}>
          {introduction}
        </p>
      </div>
      <div data-h2-margin-top="base(x.5)">{clonedInput}</div>
    </div>
  );
};

export default CompoundQuestion;
