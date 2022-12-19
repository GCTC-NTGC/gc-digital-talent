import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ICustomProperties } from "@microsoft/applicationinsights-web";
import { useEffect } from "react";

const useCustomEvent = (
  reactPlugin: ReactPlugin,
  eventName: string,
  eventData: ICustomProperties,
) => {
  useEffect(() => {
    reactPlugin.trackEvent({ name: eventName }, eventData);
  }, [reactPlugin, eventName, eventData]);
};
export default useCustomEvent;
