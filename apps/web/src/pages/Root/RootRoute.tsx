import { Outlet, useNavigation } from "react-router";

import { Loading } from "@gc-digital-talent/ui";

import type { Route } from "./+types/RootRoute";
import intlMiddleware from "./intlMiddleware";
import tokenSyncMiddleware from "./tokenSyncMiddleware";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  tokenSyncMiddleware,
  intlMiddleware,
];

export default function RootRoute() {
  const navigation = useNavigation();

  const isNavigating = navigation.state === "loading";

  return (
    <div className={isNavigating ? "opacity-60 transition-opacity" : ""}>
      {isNavigating && <Loading />}
      <Outlet />
    </div>
  );
}
