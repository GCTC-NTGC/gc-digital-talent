import { IntlShape, useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import {
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql";

// absolute -left-2 flex
const ribbon = tv({
  slots: {
    base: "top-0 mb-1.5 flex items-center",
    label: "flex h-8 items-center px-6 pl-14 font-bold",
    topTriangle: "h-4 w-4 [clip-path:polygon(0_0,0%_100%,100%_0)]",
    bottomTriangle: "h-4 w-4 [clip-path:polygon(0_0,0%_100%,100%_100%)]",
  },
  variants: {
    level: {
      first: {
        base: "z-2",
      },
      second: {
        base: "z-1 sm:-ml-6",
      },
      third: {
        base: "z-0 sm:-ml-6",
      },
    },
    publicColor: {
      first: {
        label: "bg-primary-100 text-primary-700",
        topTriangle: "bg-primary-100",
        bottomTriangle: "bg-primary-100",
      },
      second: {
        label: "bg-primary-200 text-primary-700",
        topTriangle: "bg-primary-200",
        bottomTriangle: "bg-primary-200",
      },
      third: {
        label: "bg-primary-300 text-primary-700",
        topTriangle: "bg-primary-300",
        bottomTriangle: "bg-primary-300",
      },
    },
    employeeColor: {
      first: {
        label: "bg-secondary-100 text-secondary-700",
        topTriangle: "bg-secondary-100",
        bottomTriangle: "bg-secondary-100",
      },
      second: {
        label: "bg-secondary-200 text-secondary-700",
        topTriangle: "bg-secondary-200",
        bottomTriangle: "bg-secondary-200",
      },
      third: {
        label: "bg-secondary-300 text-secondary-700",
        topTriangle: "bg-secondary-300",
        bottomTriangle: "bg-secondary-300",
      },
    },
  },
});

type RibbonLevel = "first" | "second" | "third";

const level = new Map<number, RibbonLevel>([
  [1, "first"],
  [2, "second"],
  [3, "third"],
]);

const whoCanApplyMessages = (
  areaOfSelection: PoolAreaOfSelection,
  selectionLimitations: PoolSelectionLimitation[],
  intl: IntlShape,
): string[] | null => {
  const whoCanApply = [];

  if (areaOfSelection == PoolAreaOfSelection.Public) {
    whoCanApply.push(
      intl.formatMessage({
        defaultMessage: "Open to the public",
        id: "L0eho2",
        description: "Combined eligibility string for 'open to the public'",
      }),
    );

    if (
      selectionLimitations?.includes(PoolSelectionLimitation.CanadianCitizens)
    ) {
      whoCanApply.push(
        intl.formatMessage({
          defaultMessage: "Canadian citizens",
          id: "VotRI3",
          description: "Canadian citizen only application criteria",
        }),
      );
    }

    return whoCanApply;
  }
  if (areaOfSelection == PoolAreaOfSelection.Employees) {
    whoCanApply.push(
      intl.formatMessage({
        defaultMessage: "Open to employees",
        id: "A+7N3f",
        description:
          "Combined eligibility string for 'employees only' with no other limitations",
      }),
    );

    if (selectionLimitations?.includes(PoolSelectionLimitation.AtLevelOnly)) {
      whoCanApply.push(
        intl.formatMessage({
          defaultMessage: "At-level",
          id: "iKN6ln",
          description:
            "Combined eligibility string for 'employees only' and 'at-level only'",
        }),
      );
    }
    if (
      selectionLimitations?.includes(
        PoolSelectionLimitation.DepartmentalPreference,
      )
    ) {
      whoCanApply.push(
        intl.formatMessage({
          defaultMessage: "Departmental preference",
          id: "fQiUXz",
          description:
            "Combined eligibility string for 'employees only' and 'departmental preference'",
        }),
      );
    }

    return whoCanApply;
  }
  return null;
};

const AreaOfSelectionRibbon = ({
  areaOfSelection,
  selectionLimitations,
}: {
  areaOfSelection: PoolAreaOfSelection;
  selectionLimitations: PoolSelectionLimitation[];
}) => {
  const intl = useIntl();
  const whoCanApply = whoCanApplyMessages(
    areaOfSelection,
    selectionLimitations,
    intl,
  );

  const { base, bottomTriangle, label, topTriangle } = ribbon();

  return (
    <>
      {whoCanApply?.map((text, index) => {
        const ribbonLevel = level.get(index + 1);
        const props =
          areaOfSelection === PoolAreaOfSelection.Public
            ? { level: ribbonLevel, publicColor: ribbonLevel }
            : { level: ribbonLevel, employeeColor: ribbonLevel };
        return (
          <div key={text} className={base(props)}>
            <p className={label(props)}>{text}</p>
            <div>
              <div className={topTriangle(props)}></div>
              <div className={bottomTriangle(props)}></div>
            </div>
          </div>
          // <div key={text} className="order-1 drop-shadow-(--ribbon-shadow)">
          //   <div
          //     className="relative -ml-10.5 inline-block rounded-l-md bg-secondary-100 py-1 pr-9 pl-10.5 text-sm/normal font-bold text-black dark:text-secondary-700"
          //     style={{
          //       clipPath:
          //         "polygon(0% 0%, 100% 0%, calc(100% - 1rem) 50%, 100% 100%, 0% 100%)",
          //     }}
          //   >
          //     {text}
          //   </div>
          // </div>
        );
      })}
    </>
  );
};

export default AreaOfSelectionRibbon;
