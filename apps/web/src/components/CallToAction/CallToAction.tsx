import React from "react";

import { HireIcon, JobIcon, ProfileIcon, HomeIcon, SupportIcon } from "./Icons";

export type CallToActionContext =
  | "hire"
  | "job"
  | "profile"
  | "home"
  | "support";
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
      "base:children[>div:not(:first-child)](foreground) base:focus-visible:children[>div:not(:first-child)](focus) base:children[div:first-child](secondary) base:hover:children[div:first-child](secondary.lightest)",
    "data-h2-border":
      "base:children[div:first-child](3px solid secondary) base:children[div:not(:first-child)](3px solid foreground) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color":
      "base(black) base:children[>div:first-child]:admin(white) base:children[>div:first-child]:admin:hover(black) base:children[>div:first-child]:iap(white) base:children[>div:first-child]:iap:hover(black)",
  },
  job: {
    "data-h2-background-color":
      "base:children[>div:not(:first-child)](foreground) base:focus-visible:children[>div:not(:first-child)](focus) base:children[div:first-child](quaternary) base:hover:children[div:first-child](quaternary.lightest)",
    "data-h2-border":
      "base:children[div:first-child](3px solid quaternary) base:children[div:not(:first-child)](3px solid foreground) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color":
      "base(black) base:children[>div:first-child]:iap(white) base:children[>div:first-child]:iap:hover(black)",
  },
  profile: {
    "data-h2-background-color":
      "base:children[>div:not(:first-child)](foreground) base:focus-visible:children[>div:not(:first-child)](focus) base:children[div:first-child](quinary) base:hover:children[div:first-child](quinary.lightest)",
    "data-h2-border":
      "base:children[div:first-child](3px solid quinary) base:children[div:not(:first-child)](3px solid foreground) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color":
      "base(black) base:children[>div:first-child]:iap(white) base:children[>div:first-child]:iap:hover(black)",
  },
  home: {
    "data-h2-background-color":
      "base:children[>div:not(:first-child)](foreground) base:focus-visible:children[>div:not(:first-child)](focus) base:children[div:first-child](quinary) base:hover:children[div:first-child](quinary.lightest)",
    "data-h2-border":
      "base:children[div:first-child](3px solid quinary) base:children[div:not(:first-child)](3px solid foreground) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color":
      "base(black) base:children[>div:first-child]:iap(white) base:children[>div:first-child]:iap:hover(black)",
  },
  support: {
    "data-h2-background-color":
      "base:children[>div:not(:first-child)](foreground) base:focus-visible:children[>div:not(:first-child)](focus) base:children[div:first-child](primary) base:hover:children[div:first-child](primary.lightest)",
    "data-h2-border":
      "base:children[div:first-child](3px solid primary) base:children[div:not(:first-child)](3px solid foreground) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color":
      "base(black) base:children[>div:first-child]:admin(white) base:children[>div:first-child]:admin:hover(black)",
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
          data-h2-shadow="base(medium) base:hover(larger)"
          data-h2-transition="base(all ease .2s) base:children[*](all ease .2s)"
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
            data-h2-width="base(100%)"
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
          data-h2-shadow="base(medium) base:hover(larger)"
          data-h2-transition="base(all ease .2s) base:children[*](all ease .2s)"
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
              data-h2-width="base(100%)"
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
