import React from "react";
import useCommonInputStyles from "../../hooks/useCommonInputStyles";

type DescriptionProps = React.DetailedHTMLProps<
  React.HtmlHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Description = (props: DescriptionProps) => {
  const styles = useCommonInputStyles();

  return (
    <div
      data-h2-background-color="base(background.dark)"
      data-h2-border-color="base(background.darkest)"
      data-h2-color="base(background.darkest)"
      {...styles}
      {...props}
    />
  );
};

export default Description;
