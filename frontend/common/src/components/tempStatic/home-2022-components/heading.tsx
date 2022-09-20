// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local component dependencies

// Define the interface
export interface HeadingProps {
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  label: string;
  id: string;
  icon?: SVGElement;
  color?: string;
}

// Create the page component
const Heading: React.FC<HeadingProps> = ({
  type,
  size,
  label,
  id,
  icon,
  color,
}): React.ReactElement => {
  let headingSize = {};
  if (size === "h1") {
    headingSize = {
      "data-h2-font-size": "base(h1)",
      "data-h2-font-weight": "base(700)",
    };
  } else if (size === "h2") {
    headingSize = {
      "data-h2-font-size": "base(h2)",
      "data-h2-font-weight": "base(700)",
    };
  } else if (size === "h3") {
    headingSize = {
      "data-h2-font-size": "base(h3)",
      "data-h2-font-weight": "base(400)",
    };
  } else if (size === "h4") {
    headingSize = {
      "data-h2-font-size": "base(h4)",
      "data-h2-font-weight": "base(400)",
    };
  } else if (size === "h5") {
    headingSize = {
      "data-h2-font-size": "base(h5)",
      "data-h2-font-weight": "base(400)",
    };
  } else if (size === "h6") {
    headingSize = {
      "data-h2-font-size": "base(h6)",
      "data-h2-font-weight": "base(700)",
    };
  }
  const iconDefaults = {
    "data-h2-display": "p-tablet(inline-block)",
    "data-h2-vertical-align": "base(middle)",
    "data-h2-margin": "base(0, 0, x.5, 0) p-tablet(0, x1, 0, 0)",
  };
  let iconColor = {};
  if (color === "yellow") {
    iconColor = {
      "data-h2-color": "base:children[svg](tm-yellow)",
    };
  } else if (color === "blue") {
    iconColor = {
      "data-h2-color": "base:children[svg](tm-blue)",
    };
  } else if (color === "red") {
    iconColor = {
      "data-h2-color": "base:children[svg](tm-red)",
    };
  }
  return (
    <>
      {type === "h1" && (
        <h1
          data-h2-text-align="base(center) p-tablet(left)"
          {...headingSize}
          id={id}
        >
          {icon ? (
            <div
              {...iconColor}
              {...iconDefaults}
              data-h2-width="base:children[svg](var(--h2-font-size-h1))"
            >
              {icon}
            </div>
          ) : null}
          {label}
        </h1>
      )}
      {type === "h2" && (
        <h2
          data-h2-text-align="base(center) p-tablet(left)"
          {...headingSize}
          id={id}
        >
          {icon ? (
            <div
              {...iconColor}
              {...iconDefaults}
              data-h2-width="base:children[svg](var(--h2-font-size-h2))"
            >
              {icon}
            </div>
          ) : null}
          {label}
        </h2>
      )}
      {type === "h3" && (
        <h3 {...headingSize} id={id}>
          {icon ? (
            <div
              {...iconColor}
              {...iconDefaults}
              data-h2-width="base:children[svg](var(--h2-font-size-h3))"
            >
              {icon}
            </div>
          ) : null}
          {label}
        </h3>
      )}
      {type === "h4" && (
        <h4 {...headingSize} id={id}>
          {icon ? (
            <div
              {...iconColor}
              {...iconDefaults}
              data-h2-width="base:children[svg](var(--h2-font-size-h4))"
            >
              {icon}
            </div>
          ) : null}
          {label}
        </h4>
      )}
      {type === "h5" && (
        <h5 {...headingSize} id={id}>
          {icon ? (
            <div
              {...iconColor}
              {...iconDefaults}
              data-h2-width="base:children[svg](var(--h2-font-size-h5))"
            >
              {icon}
            </div>
          ) : null}
          {label}
        </h5>
      )}
      {type === "h6" && (
        <h6 {...headingSize} id={id}>
          {icon ? (
            <div
              {...iconColor}
              {...iconDefaults}
              data-h2-width="base:children[svg](var(--h2-font-size-h6))"
            >
              {icon}
            </div>
          ) : null}
          {label}
        </h6>
      )}
    </>
  );
};

// Export the component
export default Heading;
