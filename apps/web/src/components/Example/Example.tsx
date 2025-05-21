import { useIntl } from "react-intl";

type Color = "primary" | "secondary";

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

interface ExampleProps {
  subtitle?: string;
  color: Color;
  showBorder: boolean;
}

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
      <h1 data-h2-font-size="base(h1)">
        {intl.formatMessage({
          defaultMessage: "Example",
          id: "+jIT2i",
          description: "Title for the example component",
        })}
      </h1>
      {subtitle && <h2 data-h2-font-size="base(h2)">{subtitle}</h2>}
      <p>{flags[intl.locale]}</p>
    </div>
  );
};

export default Example;
