export type Primitive = string | number | boolean;

/**
 * Turns an object type into a union of tuples of keys corresponding to its primitive properties.
 */
type PathsToPrimitiveProps<T> = T extends Primitive
  ? []
  : {
      [K in Extract<keyof T, Primitive>]: [K, ...PathsToPrimitiveProps<T[K]>];
    }[Extract<keyof T, Primitive>];

/**
 * Joins tuples of strings into a dotted path.
 */
type Join<T extends Primitive[], D extends string = "."> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, Primitive[]>, D>}`
    : never
  : string;

/**
 * Turns an object type into the list of keys to primitive values,
 * with keys to nested objects represented by dot-notation.
 */
export type NestedPaths<T extends Record<string, any>> = Join<
  PathsToPrimitiveProps<T>,
  "."
>;

/**
 * Gets the type of an object at a path, with the path in dot notation.
 */
type NestedPropType<T, Path extends string> = string extends Path
  ? unknown
  : Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? NestedPropType<T[K], R>
    : unknown
  : unknown;

/**
 * Flatten nested objects, so that all primitive types are in a single layer of dot-notation keys.
 */
export type FlattenNested<T> = {
  [P in NestedPaths<T> as Extract<P, string>]: P extends string
    ? NestedPropType<T, P>
    : never;
};

/**
 * Given a type of Array<T>, return T.
 */
export type FromArray<T> = T extends Array<infer F> ? F : never;
