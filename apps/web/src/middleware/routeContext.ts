export interface RouteContext<T> {
  get: (k: unknown) => T;
}
