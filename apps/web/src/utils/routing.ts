/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunction, LoaderFunction } from "react-router";

interface RouteModule {
  clientLoader?: LoaderFunction;
  clientAction?: ActionFunction;
  default?: React.ComponentType<any>;
  [key: string]: unknown; // Allows for additional fields
}

// The output, as expected by the router
type ConvertedRoute = Omit<
  RouteModule,
  "clientLoader" | "clientAction" | "default"
> & {
  loader?: LoaderFunction;
  action?: ActionFunction;
  Component?: React.ComponentType<any>;
};

export function convert({
  clientLoader,
  clientAction,
  default: Component,
  ...rest
}: RouteModule): ConvertedRoute {
  return {
    ...rest,
    loader: clientLoader,
    action: clientAction,
    Component,
  };
}
