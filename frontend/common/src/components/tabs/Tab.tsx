import React from "react";
import { Button } from "..";

export interface TabProps extends React.HTMLProps<HTMLElement> {
  icon?: JSX.Element;
  iconOpen?: JSX.Element;
  iconClosed?: JSX.Element;
  iconPosition?: "left" | "right";
  text?: string;
  behavior?: "default" | "close" | "label";
  layout?: "default" | "end";
  /* private */
  isTabSetOpen?: boolean;
  isTabSelected?: boolean;
  onSelect?: VoidFunction;
  onToggleOpen?: VoidFunction;
}

export const Tab: React.FC<TabProps> = ({
  icon,
  iconOpen,
  iconClosed,
  iconPosition = "left",
  text,
  behavior = "default",
  layout = "default",
  isTabSetOpen,
  isTabSelected,
  onSelect,
  onToggleOpen,
}): React.ReactElement => {
  let effectiveIcon;
  if (isTabSetOpen && iconOpen) effectiveIcon = iconOpen;
  else if (!isTabSetOpen && iconClosed) effectiveIcon = iconClosed;
  else effectiveIcon = icon;

  let labelContents;
  if (iconPosition === "left")
    labelContents = (
      <>
        {" "}
        {effectiveIcon}
        &nbsp;
        {text}
      </>
    );
  else if (iconPosition === "right")
    labelContents = (
      <>
        {text}
        &nbsp;
        {effectiveIcon}
      </>
    );
  const label = <div data-h2-display="b(flex)">{labelContents}</div>;

  let contents: React.ReactElement;
  switch (behavior) {
    case "default":
      contents = (
        <Button
          color={isTabSetOpen && isTabSelected ? "primary" : "secondary"}
          mode={isTabSetOpen && isTabSelected ? "outline" : "inline"}
          onClick={onSelect}
          {...(layout === "end" ? { "data-h2-margin": "b(left, auto)" } : {})}
        >
          {label}
        </Button>
      );
      break;
    case "close":
      contents = (
        <Button
          color="secondary"
          mode="inline"
          onClick={onToggleOpen}
          {...(layout === "end" ? { "data-h2-margin": "b(left, auto)" } : {})}
        >
          {label}
        </Button>
      );
      break;
    default:
      contents = <div>{label}</div>;
  }

  return contents;
};
export default Tab;
