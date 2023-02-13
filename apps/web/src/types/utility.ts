/**
 * Given a type of Array<T>, return T.
 */
export type FromArray<T> = T extends Array<infer F> ? F : never;
