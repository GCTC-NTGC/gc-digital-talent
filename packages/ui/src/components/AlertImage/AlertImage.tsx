import * as React from "react";

/**
 * @interface AlertImageProps
 * @member {JSX.Element} message the message to be displayed in the alert component as a JSX element
 * @member {string} lightImage the resource location of the image to be displayed - light
 * @member {string} darkImage the resource location of the image to be displayed - dark
 * @member {string} imageAltText alt text for the image
 */
export interface AlertImageProps {
  message: JSX.Element;
  lightImage: string;
  darkImage: string;
  imageAltText?: string;
}

const AlertImage = ({
  message,
  lightImage,
  darkImage,
  imageAltText,
}: AlertImageProps) => {
  return (
    <div
      className="Alert"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) p-tablet(row)"
      data-h2-background-color="base(foreground)"
      data-h2-color="base(black)"
      data-h2-position="base(relative)"
      data-h2-border="base(2px solid black)"
      data-h2-radius="base(rounded)"
      data-h2-shadow="base(larger)"
      data-h2-overflow="base(hidden)"
      data-h2-margin="base(0, 0, x1, 0)"
      data-h2-max-width="base(72rem)"
    >
      <div
        data-h2-flex-grow="base(1)"
        data-h2-flex="base(1)"
        data-h2-padding="base(x1)"
      >
        {message}
      </div>
      <div
        data-h2-flex-grow="base(1)"
        data-h2-flex="base(1)"
        data-h2-padding="base(x0.5)"
      >
        <img
          src={lightImage}
          alt={imageAltText ?? ""}
          data-h2-display="base(block) base:dark(none)"
        />
        <img
          src={darkImage}
          alt={imageAltText ?? ""}
          data-h2-display="base(none) base:dark(block)"
        />
      </div>
    </div>
  );
};

export default AlertImage;
