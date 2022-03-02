import React from "react";

const styleMap: Record<"active" | "inactive", Record<string, string>> = {
  active: {
    "data-h2-font-color": "b(lightpurple)",
    "data-h2-font-weight": "b(bold)",
  },
  inactive: {
    "data-h2-font-color": "b(black)",
  },
};

export interface TabProps extends React.HTMLProps<HTMLElement> {
  icon?: JSX.Element;
  iconOpen?: JSX.Element;
  iconClosed?: JSX.Element;
  iconPosition?: "left" | "right";
  text?: string;
  textOpen?: string;
  textClosed?: string;
  /** The type of tab to add to the set:
   * *normal* - a tab that can be clicked to show content
   * *closer* - a tab that opens and closes the entire tab set but doesn't have its own content
   * *label* - a tab that acts as a description for the tab set but doesn't have its own content
   */
  tabType?: "normal" | "closer" | "label";
  placement?: "default" | "end";
  /* below props are injected by parent TabSet  */
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
  textOpen,
  textClosed,
  tabType = "normal",
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

  // calculate the text to show
  let effectiveText;
  if (isTabSetOpen && textOpen) {
    effectiveText = textOpen;
  } else if (!isTabSetOpen && textClosed) {
    effectiveText = textClosed;
  } else {
    effectiveText = text;
  }

  // arrange the contents of the label
  let label;
  if (!effectiveIcon) {
    label = effectiveText;
  } else if (iconPosition === "left") {
    label = (
      <div data-h2-display="b(flex)">
        {effectiveIcon}
        &nbsp;
        {effectiveText}
      </div>
    );
  } else if (iconPosition === "right") {
    label = (
      <div data-h2-display="b(flex)">
        {effectiveText}
        &nbsp;
        {effectiveIcon}
      </div>
    );
  }

  // active tabs will be bold and colored, otherwise they have plain text
  const tabAppearance =
    tabType === "normal" && isTabSelected && isTabSetOpen
      ? "active"
      : "inactive";

  // build the data attribute collection for this tab
  const tabAttributes: Record<string, unknown> = {
    // margin & padding same for each tab
    "data-h2-padding": "b(top-bottom, xs) b(right-left, s)",
    // the *end* layout needs this margin to push it to the right
    ...(placement === "end" && { "data-h2-margin": "b(left, auto)" }),
    // styles based on active/inactive
    ...styleMap[tabAppearance],
  };

  let assembledTab: React.ReactElement;
  switch (tabType) {
    case "normal":
      // open selected tab is not clickable
      if (isTabSetOpen && isTabSelected)
        assembledTab = <div {...tabAttributes}>{label}</div>;
      // otherwise, *normal* tabs are clickable
      else
        assembledTab = (
          <a
            role="tab"
            tabIndex={0}
            onClick={onSelect}
            onKeyPress={onSelect}
            style={{ cursor: "pointer" }}
            {...tabAttributes}
          >
            {label}
          </a>
        );
      break;

    case "closer": // closer tabs are always clickable
      assembledTab = (
        <a
          role="tab"
          tabIndex={0}
          onClick={onToggleOpen}
          onKeyPress={onToggleOpen}
          style={{ cursor: "pointer" }}
          {...tabAttributes}
        >
          {label}
        </a>
      );
      break;

    default:
      // just a text label
      assembledTab = <div {...tabAttributes}>{label}</div>;
  }

  return assembledTab;
};
export default Tab;
