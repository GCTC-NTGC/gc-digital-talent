import React from "react";

export interface TabProps extends React.HTMLProps<HTMLElement> {
  icon?: JSX.Element;
  iconOpen?: JSX.Element;
  iconClosed?: JSX.Element;
  iconPosition?: "left" | "right";
  text?: string;
  variant?: "default" | "close" | "label";
  placement?: "default" | "end";
  /* below props are injected by consuming TabSet  */
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
  variant = "default",
  placement = "default",
  isTabSetOpen,
  isTabSelected,
  onSelect,
  onToggleOpen,
}): React.ReactElement => {
  // start by calculating the icon to show
  let effectiveIcon;
  if (isTabSetOpen && iconOpen) {
    effectiveIcon = iconOpen;
  } else if (!isTabSetOpen && iconClosed) {
    effectiveIcon = iconClosed;
  } else {
    effectiveIcon = icon;
  }

  // arrange the contents of the label
  let label;
  if (!effectiveIcon) {
    label = text;
  } else if (iconPosition === "left") {
    label = (
      <div data-h2-display="b(flex)">
        {effectiveIcon}
        &nbsp;
        {text}
      </div>
    );
  } else if (iconPosition === "right") {
    label = (
      <div data-h2-display="b(flex)">
        {text}
        &nbsp;
        {effectiveIcon}
      </div>
    );
  }

  // properties every tab will have
  let tabStyles: Record<string, unknown> = {
    "data-h2-padding": "b(top-bottom, xs) b(right-left, s)",
  };

  // open and selected tabs will be bold and colored, otherwise they have black text
  if (variant === "default" && isTabSelected && isTabSetOpen) {
    tabStyles = {
      ...tabStyles,
      "data-h2-font-color": "b(lightpurple)",
      "data-h2-font-weight": "b(bold)",
    };
  } else {
    tabStyles = {
      ...tabStyles,
      "data-h2-font-color": "b(black)",
    };
  }

  // the end layout needs this margin hack to push it to the right
  if (placement === "end") {
    tabStyles = {
      ...tabStyles,
      "data-h2-margin": "b(left, auto)",
    };
  }

  let assembledTab: React.ReactElement;
  switch (variant) {
    case "default":
      // open selected tab is not clickable
      if (isTabSetOpen && isTabSelected)
        assembledTab = <div {...tabStyles}>{label}</div>;
      // otherwise, default tabs are clickable
      else
        assembledTab = (
          <a
            role="tab"
            tabIndex={0}
            onClick={onSelect}
            onKeyPress={onSelect}
            style={{ cursor: "pointer" }}
            {...tabStyles}
          >
            {label}
          </a>
        );
      break;

    case "close": // close tabs are always clickable
      assembledTab = (
        <a
          role="tab"
          tabIndex={0}
          onClick={onToggleOpen}
          onKeyPress={onToggleOpen}
          style={{ cursor: "pointer" }}
          {...tabStyles}
        >
          {label}
        </a>
      );
      break;

    default:
      // just a text label
      assembledTab = <div {...tabStyles}>{label}</div>;
  }

  return assembledTab;
};
export default Tab;
