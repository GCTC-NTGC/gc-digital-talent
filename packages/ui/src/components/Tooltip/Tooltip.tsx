/**
 * Documentation: https://base-ui.com/react/components/tooltip
 */
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { tv } from "tailwind-variants";

const popupColor = "bg-white text-black dark:bg-gray-600 dark:text-white";
const popupShape = "rounded-md px-2 py-1 font-sans text-sm shadow-md";
const popupMotion =
  "origin-(--transform-origin) transition duration-100 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none";

const popup = tv({
  base: [popupShape, popupColor, popupMotion],
});

function ArrowSvg(props: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-white dark:fill-gray-600"
      />
    </svg>
  );
}

const arrowPosition =
  "data-[side=bottom]:-top-2 data-[side=left]:-right-3.25 data-[side=left]:rotate-90 data-[side=right]:-left-3.25 data-[side=right]:-rotate-90 data-[side=top]:-bottom-1.75 data-[side=top]:rotate-180";

interface PopupProps extends Omit<TooltipPrimitive.Popup.Props, "className"> {
  portalProps?: TooltipPrimitive.Portal.Props;
  positionerProps?: TooltipPrimitive.Positioner.Props;
  className?: string;
}

const Popup = ({
  portalProps,
  positionerProps,
  children,
  className,
  ref,
  ...popupProps
}: PopupProps) => (
  <TooltipPrimitive.Portal {...portalProps}>
    <TooltipPrimitive.Positioner sideOffset={8} {...positionerProps}>
      <TooltipPrimitive.Popup
        ref={ref}
        className={popup({ class: className })}
        {...popupProps}
      >
        <TooltipPrimitive.Arrow className={arrowPosition}>
          <ArrowSvg />
        </TooltipPrimitive.Arrow>
        {children}
      </TooltipPrimitive.Popup>
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Portal>
);

export default {
  Provider: TooltipPrimitive.Provider,
  Root: TooltipPrimitive.Root,
  Trigger: TooltipPrimitive.Trigger,
  Popup,
};
