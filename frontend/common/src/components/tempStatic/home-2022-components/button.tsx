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
        "base(tm-yellow) base:hover(tm-yellow.5) base:active(transparent)",
      "data-h2-border": "base(all, 3px, solid, tm-yellow)",
      "data-h2-color": "base(black)",
    };
  } else if (color === "red") {
    buttonStyles = {
      "data-h2-background-color":
        "base(tm-red) base:hover(tm-red.5) base:active(transparent)",
      "data-h2-border": "base(all, 3px, solid, tm-red)",
      "data-h2-color": "base(black)",
    };
  } else if (color === "blue") {
    buttonStyles = {
      "data-h2-background-color":
        "base(tm-blue) base:hover(tm-blue.5) base:active(transparent)",
      "data-h2-border": "base(all, 3px, solid, tm-blue)",
      "data-h2-color": "base(black)",
    };
  } else if (color === "black") {
    buttonStyles = {
      "data-h2-background-color":
        "base(black) base:hover(black.5) base:active(transparent)",
      "data-h2-border": "base(all, 3px, solid, black)",
      "data-h2-color": "base(tm-blue) base:active(black)",
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
