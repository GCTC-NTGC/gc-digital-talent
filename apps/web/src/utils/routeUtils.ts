import { ActionFunction, LoaderFunction } from "react-router";

interface RouteModule {
  clientLoader?: LoaderFunction;
  clientAction?: ActionFunction;
  // NOTE: We do not know the props, but usually none
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default?: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component?: React.ComponentType<any>;
  [key: string]: unknown; // Allows for additional fields
}

// The output, as expected by the router
type ConvertedRoute = Omit<
  RouteModule,
  "clientLoader" | "clientAction" | "default"
> & {
  loader?: LoaderFunction;
  action?: ActionFunction;
  Component?: React.ComponentType<unknown>;
};

export function convert({
  clientLoader,
  clientAction,
  default: DefaultComponent,
  Component,
  ...rest
}: RouteModule): ConvertedRoute {
  return {
    ...rest,
    loader: clientLoader,
    action: clientAction,
    // Note: Some pages are already modules, so lets use it if available
    Component: Component ?? DefaultComponent,
  };
}
