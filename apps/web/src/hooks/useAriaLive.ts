import React, { AriaAttributes } from "react";

type AriaLive = AriaAttributes["aria-live"];

type UseAriaLive = (ariaLive?: AriaLive, add?: boolean) => AriaLive;

/**
 * Retroactively add aria-live attribute to
 * prevent announcements on load
 *
 * @param ariaLive
 * @param add Prevent it from being added at all until this is true
 * @returns
 */
const useAriaLive: UseAriaLive = (
  ariaLive: AriaLive = "polite",
  add = true,
) => {
  const [ariaLiveAttr, setAriaLiveAttr] = React.useState<AriaLive>("off");
  const isSet = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (!isSet.current) {
      setAriaLiveAttr(ariaLive);
      isSet.current = add;
    }
  }, [ariaLive, add]);

  return ariaLiveAttr;
};

export default useAriaLive;
