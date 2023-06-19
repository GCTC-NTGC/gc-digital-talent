import React, { AriaAttributes } from "react";

type AriaLive = AriaAttributes["aria-live"];

type UseAriaLive = (ariaLive?: AriaLive) => AriaLive;

const useAriaLive: UseAriaLive = (ariaLive: AriaLive = "polite") => {
  const [ariaLiveAttr, setAriaLiveAttr] = React.useState<AriaLive>("off");
  const isSet = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (!isSet.current) {
      setAriaLiveAttr(ariaLive);
      isSet.current = true;
    }
  }, [ariaLive]);

  return ariaLiveAttr;
};

export default useAriaLive;
