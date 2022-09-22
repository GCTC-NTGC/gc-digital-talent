// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local component dependencies

// Define the interface
export interface CallToActionProps {
  type: string;
  context: string;
  content: {
    path: string;
    title: string;
    label: string;
  };
}

// Create the page component
const CallToAction: React.FC<CallToActionProps> = ({
  type,
  context,
  content,
}): React.ReactElement => {
  let buttonStyles = {};
  let icon;
  if (context === "job") {
    buttonStyles = {
      "data-h2-background-color":
        "base(white) base:children[div:first-child](tm-yellow) base:children[div:first-child]:hover(tm-yellow.lighter) base:focus-visible(focus) base:focus-visible:children[div:not(:first-child)](focus)",
      "data-h2-border":
        "base:children[div:first-child](all, 3px, solid, tm-yellow) base:children[div:not(:first-child)](all, 3px, solid, white) base:focus-visible:children[div:not(:first-child)](all, 3px, solid, focus)",
      "data-h2-color": "base:children[*](black)",
    };
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    );
  } else if (context === "hire") {
    buttonStyles = {
      "data-h2-background-color":
        "base(white) base:children[div:first-child](tm-blue) base:children[div:first-child]:hover(tm-blue.lighter) base:focus-visible(focus) base:focus-visible:children[div:not(:first-child)](focus)",
      "data-h2-border":
        "base:children[div:first-child](all, 3px, solid, tm-blue) base:children[div:not(:first-child)](all, 3px, solid, white) base:focus-visible:children[div:not(:first-child)](all, 3px, solid, focus)",
      "data-h2-color": "base:children[*](black)",
    };
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    );
  } else if (context === "profile") {
    buttonStyles = {
      "data-h2-background-color":
        "base(white) base:children[div:first-child](tm-green) base:children[div:first-child]:hover(tm-green.lighter) base:focus-visible(focus) base:focus-visible:children[div:not(:first-child)](focus)",
      "data-h2-border":
        "base:children[div:first-child](all, 3px, solid, tm-green) base:children[div:not(:first-child)](all, 3px, solid, white) base:focus-visible:children[div:not(:first-child)](all, 3px, solid, focus)",
      "data-h2-color": "base:children[*](black)",
    };
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
        />
      </svg>
    );
  }
  return (
    <>
      {type === "link" && (
        <a
          {...buttonStyles}
          href={content.path}
          title={content.title}
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
            data-h2-display="base(flex)"
            data-h2-height="base(100%)"
            data-h2-padding="base(x.5) p-tablet(x.25, x.4)"
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
        </a>
      )}
      {type === "button" && (
        <button
          {...buttonStyles}
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
            data-h2-display="base(flex)"
            data-h2-height="base(100%)"
            data-h2-padding="base(x.5) p-tablet(x.25, x.4)"
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
