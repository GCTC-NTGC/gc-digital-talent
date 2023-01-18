import React from "react";

import { HireIcon, JobIcon, ProfileIcon, HomeIcon, SupportIcon } from "./Icons";

type CallToActionContext = "hire" | "job" | "profile" | "home" | "support";
export interface CallToActionProps {
  type: string;
  context: CallToActionContext;
  content: {
    path: string;
    label: string;
  };
}

const stylesMap: Record<CallToActionContext, Record<string, string>> = {
  hire: {
    "data-h2-background-color":
      "base(white) base:children[div:first-child](tm-blue) base:children[div:first-child]:hover(tm-blue.lighter) base:focus-visible(focus) base:focus-visible:children[div:not(:first-child)](focus)",
    "data-h2-border":
      "base:children[div:first-child](3px solid tm-blue) base:children[div:not(:first-child)](3px solid white) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color": "base:children[*](black)",
  },
  job: {
    "data-h2-background-color":
      "base(white) base:children[div:first-child](tm-yellow) base:children[div:first-child]:hover(tm-yellow.lighter) base:focus-visible(focus) base:focus-visible:children[div:not(:first-child)](focus)",
    "data-h2-border":
      "base:children[div:first-child](3px solid tm-yellow) base:children[div:not(:first-child)](3px solid white) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color": "base:children[*](black)",
  },
  profile: {
    "data-h2-background-color":
      "base(white) base:children[div:first-child](tm-green) base:children[div:first-child]:hover(tm-green.lighter) base:focus-visible(focus) base:focus-visible:children[div:not(:first-child)](focus)",
    "data-h2-border":
      "base:children[div:first-child](3px solid tm-green) base:children[div:not(:first-child)](3px solid white) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color": "base:children[*](black)",
  },
  home: {
    "data-h2-background-color":
      "base(white) base:children[div:first-child](tm-green) base:children[div:first-child]:hover(tm-green.lighter) base:focus-visible(focus) base:focus-visible:children[div:not(:first-child)](focus)",
    "data-h2-border":
      "base:children[div:first-child](3px solid tm-green) base:children[div:not(:first-child)](3px solid white) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color": "base:children[*](black)",
  },
  support: {
    "data-h2-background-color":
      "base(white) base:children[div:first-child](tm-purple) base:children[div:first-child]:hover(tm-purple.lighter) base:focus-visible(focus) base:focus-visible:children[div:not(:first-child)](focus)",
    "data-h2-border":
      "base:children[div:first-child](3px solid tm-purple) base:children[div:not(:first-child)](3px solid white) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color": "base:children[*](black)",
  },
};

const iconMap: Record<CallToActionContext, React.ReactNode> = {
  hire: <HireIcon />,
  job: <JobIcon />,
  profile: <ProfileIcon />,
  home: <HomeIcon />,
  support: <SupportIcon />,
};

// Create the page component
const CallToAction: React.FC<CallToActionProps> = ({
  type,
  context,
  content,
}): React.ReactElement => {
  const styles = stylesMap[context];
  const icon = iconMap[context];

  return (
    <>
      {type === "link" && (
        <a
          {...styles}
          href={content.path}
          data-h2-cursor="base(pointer)"
          data-h2-outline="base(none)"
          data-h2-display="base(inline-flex)"
          data-h2-align-items="base(center)"
          data-h2-padding="base(0)"
          data-h2-overflow="base(hidden)"
          data-h2-radius="base(rounded)"
          data-h2-shadow="base(medium)"
        >
          <div
            data-h2-align-self="base(stretch)"
            data-h2-display="base(inline-flex)"
            data-h2-align-items="base(center)"
            data-h2-padding="base(x.5) p-tablet(x.25, x.4)"
            data-h2-radius="base(rounded, 0, 0, rounded)"
            data-h2-width="base:children[svg](var(--h2-font-size-h5))"
          >
            {icon}
          </div>
          <div
            data-h2-padding="base(x.5, x1)"
            data-h2-font-weight="base(700)"
            data-h2-text-decoration="base(underline)"
          >
            {content.label}
          </div>
        </a>
      )}
      {type === "button" && (
        <button
          {...styles}
          type="button"
          data-h2-cursor="base(pointer)"
          data-h2-outline="base(none)"
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-padding="base(0)"
          data-h2-overflow="base(hidden)"
          data-h2-radius="base(rounded)"
          data-h2-shadow="base(medium)"
        >
          <div
            data-h2-align-self="base(stretch)"
            data-h2-display="base(inline-flex)"
            data-h2-align-items="base(center)"
            data-h2-padding="base(x.5) p-tablet(x.25, x.4)"
            data-h2-radius="base(rounded, 0, 0, rounded)"
            data-h2-width="base:children[svg](var(--h2-font-size-h5))"
          >
            {icon}
          </div>
          <div data-h2-padding="base(x.5, x1)">
            <span
              data-h2-font-weight="base(700)"
              data-h2-text-decoration="base(underline)"
            >
              {content.label}
            </span>
          </div>
        </button>
      )}
    </>
  );
};

// Export the component
export default CallToAction;
