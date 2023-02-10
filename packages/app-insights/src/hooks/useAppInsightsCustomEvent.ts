import { useState, useEffect } from "react";
import { ICustomProperties } from "@microsoft/applicationinsights-web";

import useAppInsightsContext from "./useAppInsightsContext";

export default function useAppInsightsCustomEvent(
  eventName: string,
  eventData: ICustomProperties,
) {
  const reactPlugin = useAppInsightsContext();
  const [data, setData] = useState(eventData);

  useEffect(() => {
    reactPlugin.trackEvent({ name: eventName }, data);
  }, [reactPlugin, data, eventName]);

  return setData;
}
