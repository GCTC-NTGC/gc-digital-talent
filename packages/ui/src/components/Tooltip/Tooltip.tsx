/**
 * Documentation: https://base-ui.com/react/components/tooltip
 */
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { tv } from "tailwind-variants";

const popup = tv({
  base: `origin-(--transform-origin) rounded-md bg-gray-100 px-2 py-1 font-sans text-sm text-black shadow-md transition-[transform,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-[0.98] data-starting-style:opacity-0 dark:bg-gray-700 dark:text-white`,
});

const arrow = tv({
  base: "relative block h-1.5 w-3 overflow-clip before:absolute before:bottom-0 before:left-1/2 before:h-[calc(6px*sqrt(2))] before:w-[calc(6px*sqrt(2))] before:origin-center before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:bg-gray-100 before:content-[''] data-[side=bottom]:-top-1.5 data-[side=left]:-right-2.25 data-[side=left]:rotate-90 data-[side=right]:-left-2.25 data-[side=right]:-rotate-90 data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180 dark:before:bg-gray-700",
});

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
        <TooltipPrimitive.Arrow className={arrow()} />
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
