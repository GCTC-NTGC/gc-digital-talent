/**
 * Filters and narrows a list of GraphQL teamable objects to only those matching the queried teamable type.
 *
 * @template T - The union type of all possible teamable option objects (from codegen).
 * @template EnumName - The teamable name you queried for, as a string (e.g., 'Community').
 * @param options - The array of teamable objects returned from your GraphQL query.
 * @param enumName - The teamblae type as passed to your query (e.g., 'Commuity').
 * @returns - The filtered and type-narrowed array containing only objects for the requested  teamable.
 */
export function narrowTeamableType<
  T extends { __typename?: string },
  EnumName extends string,
>(
  items: readonly T[],
  enumName: EnumName,
): Extract<T, { __typename?: `${EnumName}` }>[] {
  const typename = `${enumName}` as const;
  return items.filter(
    (item): item is Extract<T, { __typename?: `${EnumName}` }> =>
      typeof item.__typename === "string" && item.__typename === typename,
  );
}
