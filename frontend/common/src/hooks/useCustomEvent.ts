import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ICustomProperties } from "@microsoft/applicationinsights-web";
import { useState, useEffect, useRef } from "react";

export default function useCustomEvent(
  reactPlugin: ReactPlugin,
  eventName: string,
  eventData: ICustomProperties,
  skipFirstRun = true,
) {
  const [data, setData] = useState(eventData);
  const firstRun = useRef(skipFirstRun);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    reactPlugin.trackEvent({ name: eventName }, data);
  }, [reactPlugin, data, eventName]);

  return setData;
}
