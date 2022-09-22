// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local component dependencies

// Define the interface
export interface ButtonProps {
  color: string;
  type: "link" | "button";
  content: {
    path: string;
    title: string;
    label: string;
  };
}

// Create the page component
const Button: React.FC<ButtonProps> = ({
  color,
  type,
  content,
}): React.ReactElement => {
  let buttonStyles = {};
  if (color === "yellow") {
    buttonStyles = {
      "data-h2-background-color":
        "base(tm-yellow) base:hover(tm-yellow.lighter) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(all, 3px, solid, tm-yellow) base:focus-visible(all, 3px, solid, focus)",
      "data-h2-color": "base(black)",
    };
  } else if (color === "red") {
    buttonStyles = {
      "data-h2-background-color":
        "base(tm-red) base:hover(tm-red.lighter) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(all, 3px, solid, tm-red) base:focus-visible(all, 3px, solid, focus)",
      "data-h2-color": "base(black)",
    };
  } else if (color === "blue") {
    buttonStyles = {
      "data-h2-background-color":
        "base(tm-blue) base:hover(tm-blue.lighter) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(all, 3px, solid, tm-blue) base:focus-visible(all, 3px, solid, focus)",
      "data-h2-color": "base(black)",
    };
  } else if (color === "black") {
    buttonStyles = {
      "data-h2-background-color":
        "base(black) base:hover(black.lighter) base:focus-visible(focus) base:active(transparent)",
      "data-h2-border":
        "base(all, 3px, solid, black) base:focus-visible(all, 3px, solid, focus)",
      "data-h2-color":
        "base(white) base:active(black) base:focus-visible(black)",
    };
  }
  return (
    <>
      {type === "link" && (
        <a
          {...buttonStyles}
          href={content.path}
          title={content.title}
          data-h2-display="base(inline-block)"
          data-h2-outline="base(none)"
          data-h2-padding="base(x.5, x1)"
          data-h2-radius="base(rounded)"
          data-h2-font-weight="base(700)"
        >
          {content.label}
        </a>
      )}
      {type === "button" && (
        <button
          {...buttonStyles}
          type="button"
          data-h2-display="base(inline-block)"
          data-h2-padding="base(x.5, x1)"
          data-h2-radius="base(rounded)"
          data-h2-font-weight="base(700)"
        >
          {content.label}
        </button>
      )}
    </>
  );
};

// Export the component
export default Button;
