import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Button from "../Button/Button";
import Heading from "../Heading";

const meta: Meta = {};

export default meta;

interface GridProps {
  className: string;
  children: ReactNode;
}

const Grid = ({ children, className }: GridProps) => (
  <div className={`grid min-w-full gap-4 ${className}`}>{children}</div>
);

interface SwatchProps {
  className: string;
  level?: string;
}

const Swatch = ({ className, level }: SwatchProps) => (
  <div className={`relative h-0 gap-4 pb-[100%] ${className}`}>
    {level ? (
      <span className="absolute bottom-2 left-2 leading-none">{level}</span>
    ) : null}
  </div>
);

export const Default: StoryObj = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="text-foreground mx-auto max-w-7xl p-4">
      <Heading rank="h2" size="h4">
        Colours
      </Heading>

      <Heading rank="h3" size="h6">
        Primary
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-primary-100" />
        <Swatch className="bg-primary-200" />
        <Swatch className="bg-primary-300" />
        <Swatch className="bg-primary-400" />
        <Swatch className="bg-primary-500" />
        <Swatch className="bg-primary-600" />
        <Swatch className="bg-primary-700" />
      </Grid>

      <Heading rank="h3" size="h6">
        Secondary
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-secondary-100" />
        <Swatch className="bg-secondary-200" />
        <Swatch className="bg-secondary-300" />
        <Swatch className="bg-secondary-400" />
        <Swatch className="bg-secondary-500" />
        <Swatch className="bg-secondary-600" />
        <Swatch className="bg-secondary-700" />
      </Grid>

      <Heading rank="h3" size="h6">
        Success
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-success-100" />
        <Swatch className="bg-success-200" />
        <Swatch className="bg-success-300" />
        <Swatch className="bg-success-400" />
        <Swatch className="bg-success-500" />
        <Swatch className="bg-success-600" />
        <Swatch className="bg-success-700" />
      </Grid>

      <Heading rank="h3" size="h6">
        Warning
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-warning-100" />
        <Swatch className="bg-warning-200" />
        <Swatch className="bg-warning-300" />
        <Swatch className="bg-warning-400" />
        <Swatch className="bg-warning-500" />
        <Swatch className="bg-warning-600" />
        <Swatch className="bg-warning-700" />
      </Grid>

      <Heading rank="h3" size="h6">
        Error
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-error-100" />
        <Swatch className="bg-error-200" />
        <Swatch className="bg-error-300" />
        <Swatch className="bg-error-400" />
        <Swatch className="bg-error-500" />
        <Swatch className="bg-error-600" />
        <Swatch className="bg-error-700" />
      </Grid>

      <Heading rank="h3" size="h6">
        Focus
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-focus-100" />
        <Swatch className="bg-focus-200" />
        <Swatch className="bg-focus-300" />
        <Swatch className="bg-focus-400" />
        <Swatch className="bg-focus-500" />
        <Swatch className="bg-focus-600" />
        <Swatch className="bg-focus-700" />
      </Grid>

      <Heading rank="h3" size="h6">
        Gray
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-gray-100" />
        <Swatch className="bg-gray-200" />
        <Swatch className="bg-gray-300" />
        <Swatch className="bg-gray-400" />
        <Swatch className="bg-gray-500" />
        <Swatch className="bg-gray-600" />
        <Swatch className="bg-gray-700" />
      </Grid>

      <Heading rank="h3" size="h6">
        Black/White
      </Heading>
      <Grid className="md:max-width-md grid-cols-7">
        <Swatch className="bg-black" />
        <Swatch className="bg-white" />
      </Grid>

      <Heading rank="h2" size="h4">
        Shadows
      </Heading>
      <Grid className="md:max-width-md grid-cols-6">
        <Swatch className="inset-shadow" />
        <Swatch className="shadow-sm" />
        <Swatch className="shadow-md" />
        <Swatch className="shadow-lg" />
        <Swatch className="shadow-xl" />
        <Swatch className="shadow-2xl" />
      </Grid>

      <Heading rank="h2" size="h4">
        Breakpoints
      </Heading>

      <Grid className="xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
        <Swatch className="bg-gray" />
      </Grid>

      <Heading rank="h2" size="h4">
        Hover, focus, etc.
      </Heading>

      <Button>Focus me</Button>

      <Heading rank="h2" size="h4">
        Child selectors
      </Heading>

      <Grid className="grid-cols-2">
        <div className="bg-gray-700 p-3 text-gray-100 has-[button]:bg-gray-100 has-[button]:text-gray-700">
          <p>No button</p>
        </div>
        <div className="bg-gray-700 p-3 text-gray-100 has-[button]:bg-gray-100 has-[button]:text-gray-700">
          <button>Button</button>
        </div>
      </Grid>
    </div>
  ),
};

interface TypeStyle {
  figmaName: string;
  code: string;
  usage: string;
  sample: ReactNode;
}

const FONT_WEIGHT_NAMES: Record<string, string> = {
  "300": "Light",
  "400": "Regular",
  "700": "Bold",
};

const toPx = (value: string) =>
  `${Math.round(parseFloat(value) * 100) / 100}px`;

/**
 * Reads the size the browser actually rendered for the sample
 * so it can be compared with Figma's Dev Mode panel.
 * Re-reads on resize because the root font size changes at 1600px.
 */
const useDevModeValues = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState("");

  useEffect(() => {
    const measure = () => {
      const el = ref.current?.firstElementChild;
      if (!el) return;
      const style = window.getComputedStyle(el);
      const weight = FONT_WEIGHT_NAMES[style.fontWeight] ?? style.fontWeight;
      setValues(
        `${toPx(style.fontSize)} size / ${toPx(style.lineHeight)} line height / ${weight}`,
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return { ref, values };
};

const TypeStyleRow = ({ figmaName, code, usage, sample }: TypeStyle) => {
  const { ref, values } = useDevModeValues();

  return (
    <div className="grid gap-3 border-b border-gray-200 pb-6 md:grid-cols-2">
      <div ref={ref}>{sample}</div>
      <div className="text-sm">
        <p>
          <span className="font-bold">Figma name:</span> {figmaName}
        </p>
        <p>
          <span className="font-bold">Dev mode:</span> {values}
        </p>
        <p>
          <span className="font-bold">In code:</span> <code>{code}</code>
        </p>
        <p className="text-gray-600 dark:text-gray-200">{usage}</p>
      </div>
    </div>
  );
};

const typeStyles: TypeStyle[] = [
  {
    figmaName: "Home Hero",
    code: '<HomeHero title="…" />',
    usage:
      "Only for the title in a home page header (main, manager, executive). Use the HomeHero component, don't apply text-6xl yourself. Always an h1, always bold.",
    sample: (
      <Heading rank="h1" className="m-0 text-6xl">
        Home Hero
      </Heading>
    ),
  },
  {
    figmaName: "Page Title",
    code: '<Hero title="…" /> (renders <Heading rank="h1">)',
    usage: "Only for the page title in the header. Always an h1, always bold.",
    sample: (
      <Heading rank="h1" className="m-0">
        Page Title
      </Heading>
    ),
  },
  {
    figmaName: "Page Subtitle",
    code: '<Hero subtitle="…" /> (renders <p className="text-xl">)',
    usage:
      "Only for the page subtitle in the header. Always a p, always regular weight.",
    sample: <p className="text-xl">Page Subtitle</p>,
  },
  {
    figmaName: "Section Title",
    code: '<Heading rank="h2" icon={…}>',
    usage:
      "First layer of sections on a page. Always an h2 with an icon, always regular weight.",
    sample: (
      <Heading
        rank="h2"
        icon={AcademicCapIcon}
        color="secondary"
        className="m-0"
      >
        Section Title
      </Heading>
    ),
  },
  {
    figmaName: "Subsection LG",
    code: '<Heading rank="h3" size="h3">',
    usage:
      "Nested sections under a Section Title (h3 to h6, in semantic order). Regular or bold depending on context.",
    sample: (
      <Heading rank="h3" className="m-0">
        Subsection LG
      </Heading>
    ),
  },
  {
    figmaName: "Subsection MD",
    code: '<Heading rank="h4" size="h4">',
    usage: "Same rules as Subsection LG.",
    sample: (
      <Heading rank="h4" className="m-0">
        Subsection MD
      </Heading>
    ),
  },
  {
    figmaName: "Subsection SM",
    code: '<Heading rank="h5" size="h5">',
    usage: "Same rules as Subsection LG.",
    sample: (
      <Heading rank="h5" className="m-0">
        Subsection SM
      </Heading>
    ),
  },
  {
    figmaName: "Subsection XS",
    code: '<Heading rank="h6" size="h6">',
    usage: "Same rules as Subsection LG. Bold by default.",
    sample: (
      <Heading rank="h6" className="m-0">
        Subsection XS
      </Heading>
    ),
  },
  {
    figmaName: "Body Text",
    code: "<p> (text-base is the default)",
    usage: "All standard content, usually in p tags.",
    sample: <p className="text-base">Body text</p>,
  },
  {
    figmaName: "Small Text",
    code: '<p className="text-sm">',
    usage:
      "Form field labels, image captions, field notices and other on-demand cases.",
    sample: <p className="text-sm">Small text</p>,
  },
];

export const Typography: StoryObj = {
  parameters: {
    layout: "fullscreen",
    chromatic: {
      modes: {
        "light mobile": allModes["light mobile"],
        "light desktop": allModes["light desktop"],
      },
    },
  },
  render: () => (
    <div className="text-foreground mx-auto max-w-7xl p-4">
      <Heading rank="h2" size="h4" className="mt-0">
        Typography
      </Heading>
      <p className="mb-3">
        Design and code use <strong>different names</strong> for the same text
        styles, on purpose:
      </p>
      <ul className="mb-3 list-disc pl-6">
        <li>
          <strong>Figma</strong> uses functional names like &ldquo;Page
          Title&rdquo; or &ldquo;Subsection MD&rdquo;. Designers may add or
          rename these over time.
        </li>
        <li>
          <strong>Code</strong> uses Tailwind t-shirt sizes (
          <code>text-sm</code> to <code>text-6xl</code>) and the Heading{" "}
          <code>size</code> prop (<code>h1</code> to <code>h6</code>). We
          don&apos;t add Figma names to the code.
        </li>
      </ul>
      <p className="mb-3">
        This page is the translation between the two. When a design names a
        style, find it below and use the code next to it. If Figma adds a new
        style, add a row here that points to the closest existing size instead
        of creating a new one.
      </p>
      <p className="mb-3">
        On <code>Heading</code>, <code>rank</code> sets the HTML tag and should
        follow the page&apos;s nesting (an h3 goes inside an h2).{" "}
        <code>size</code> sets the look and defaults to <code>rank</code>, so
        only pass it when the look should differ from the tag.
      </p>
      <p className="mb-6">
        Sizes follow the Figma scale (each step is 1.125&times; the last). On
        screens 1600px and wider the root font size goes from 16px to 18px,
        which produces Figma&apos;s wide sizes automatically, so no responsive
        text classes are needed.
      </p>
      <div className="flex flex-col gap-y-6">
        {typeStyles.map((typeStyle) => (
          <TypeStyleRow key={typeStyle.figmaName} {...typeStyle} />
        ))}
      </div>
    </div>
  ),
};
