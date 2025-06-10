import { useIntl } from "react-intl";
import { tv, VariantProps } from "tailwind-variants";

const flags: Record<string, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
} as const;

const example = tv({
  base: "",
  variants: {
    color: {
      primary: "bg-primary-300 dark:bg-primary-500 iap:bg-primary",
      secondary: "bg-secondary-300 dark:bg-secondary-500",
    },
    showBorder: {
      true: "border",
    },
  },
});

type ExampleVariants = VariantProps<typeof example>;

interface ExampleProps extends ExampleVariants {
  subtitle?: string;
}

const Example = ({ subtitle, color, showBorder }: ExampleProps) => {
  const intl = useIntl();

  return (
    <div className={example({ color, showBorder })}>
      <h1 className="text-5xl/[1.1] lg:text-6xl/[1.1]">
        {intl.formatMessage({
          defaultMessage: "Example",
          id: "+jIT2i",
          description: "Title for the example component",
        })}
      </h1>
      {subtitle && (
        <h2 className="text-4xl/[1.1] lg:text-5xl/[1.1]">{subtitle}</h2>
      )}
      <p>{flags[intl.locale]}</p>
    </div>
  );
};

export default Example;
