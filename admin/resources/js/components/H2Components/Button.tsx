import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  borderColor:
    | "lightpurple"
    | "lightnavy"
    | "darkgold"
    | "white"
    | "[light]white[0]";
  backgroundColor:
    | "lightpurple"
    | "[light]lightpurple[.1]"
    | "darkpurple"
    | "lightnavy"
    | "[light]lightnavy[.1]"
    | "darkgold"
    | "[light]darkgold[.1]"
    | "white"
    | "[light]white[0]";
  fontColor: "black" | "white" | "lightpurple" | "lightnavy" | "darkgold";
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  borderColor,
  backgroundColor,
  fontColor,
  onClick,
}): React.ReactElement => {
  return (
    <button
      type="button"
      data-h2-border={`b(${borderColor}, all, solid, s)`}
      data-h2-radius="b(s)"
      data-h2-padding="b(top-bottom, xs) b(right-left, s)"
      data-h2-bg-color={`b(${backgroundColor})`}
      data-h2-font-family="b(sans)"
      data-h2-font-color={`b(${fontColor})`}
      data-h2-font-size="b(caption) m(h5)"
      data-h2-font-weight="b(400)"
      data-h2-font-style="b(underline)"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
