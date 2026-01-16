import { Outlet, useNavigation } from "react-router";

import { Loading } from "@gc-digital-talent/ui";

import intlMiddleware from "./intlMiddleware";
import userMiddleware from "./authMiddleware";
import graphqlClientMiddleware from "./graphqlClientMiddleware";
import type { Route } from "./+types/RootRoute";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  intlMiddleware,
  graphqlClientMiddleware,
  userMiddleware,
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
