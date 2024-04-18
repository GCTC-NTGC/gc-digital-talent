import React from "react";
import { useIntl } from "react-intl";

export type Color = "primary" | "secondary";

type StyleRecord = Record<string, string>;
const backgroundMap = new Map<Color, StyleRecord>([
  [
    "primary",
    {
      "data-h2-background":
        "base(primary.light) base:dark(primary.dark) base:iap(primary)",
    },
  ],
  [
    "secondary",
    {
      "data-h2-background":
        "base(secondary.light) base:dark(secondary.dark) base:iap:dark(secondary.light)",
    },
  ],
]);

type ExampleProps = {
  subtitle?: string;
  color: Color;
  showBorder: boolean;
};

const Example = ({ subtitle, color, showBorder }: ExampleProps) => {
  const intl = useIntl();

  const borderStyles = showBorder
    ? {
        "data-h2-border": "base(solid)",
      }
    : null;
  const containerStyles = { ...backgroundMap.get(color), ...borderStyles };

  const flags: Record<string, string> = {
    en: "🇬🇧",
    fr: "🇫🇷",
  } as const;

  return (
    <div {...containerStyles}>
      <p>
        {flags[intl.locale]}
        {intl.formatMessage({
          defaultMessage: "Example",
          id: "+jIT2i",
          description: "Title for the example component",
        })}
      </p>
      {subtitle ? <span>{subtitle}</span> : null}
    </div>
  );
};

export default Example;
