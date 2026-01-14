import { Outlet } from "react-router";

import RouteErrorBoundary from "~/components/Layout/RouteErrorBoundary/RouteErrorBoundary";

export default function ErrorBoundaryWrapper() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}
