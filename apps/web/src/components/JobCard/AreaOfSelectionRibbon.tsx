import { IntlShape, useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import {
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql";

const ribbon = tv({
  slots: {
    base: "drop-shadow-(--ribbon-shadow)",
    label:
      "relative inline-block rounded-l-md py-1 pr-9 pl-13.5 text-sm/normal font-bold [clip-path:polygon(0%_0%,100%_0%,calc(100%-1rem)_50%,100%_100%,0%_100%)]",
  },
  variants: {
    publicColor: {
      first: {
        base: "z-2",
        label: "bg-primary-100 text-primary-700",
      },
      second: {
        base: "z-1 sm:-ml-6",
        label: "bg-primary-200 text-primary-700",
      },
      third: {
        base: "z-0 sm:-ml-6",
        label: "bg-primary-300 text-primary-700",
      },
    },
    employeeColor: {
      first: {
        base: "z-2",
        label: "bg-secondary-100 text-secondary-700",
      },
      second: {
        base: "z-1 sm:-ml-6",
        label: "bg-secondary-200 text-secondary-700",
      },
      third: {
        base: "z-0 sm:-ml-6",
        label: "bg-secondary-300 text-secondary-700",
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

  const { base, label } = ribbon();

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
            <div className={label(props)}>{text}</div>
          </div>
        );
      })}
    </>
  );
};

export default AreaOfSelectionRibbon;
