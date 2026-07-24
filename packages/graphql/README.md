# `@gc-digital-talent/graphql`

Generated GraphQL types and operations. Run `pnpm run codegen` to regenerate
everything in `src/gql/` (that folder is git-ignored).

## Two entry points

### `@gc-digital-talent/graphql` (main)

The normal import. It gives you:

- Typed operations and fragments (the `graphql` function, `FragmentType`,
  `getFragment`).
- Enums (for example `Permission`, `SkillLevel`).
- Small utility types (for example `LocalizedString`).

Use this everywhere in app code.

### `@gc-digital-talent/graphql/schema-types` (restricted)

`src/gql/schema-types.ts` holds a plain TypeScript type for every type in the
schema, including the full object types like `User` and `Pool`. It is generated
by the `typescript` plugin (see `codegen.ts`).

These full object types are a problem in app code: every non-null field becomes
required, which forces a query to select fields it does not use. So app code
must not use them. Instead:

- Get data from a query or mutation as a GraphQL fragment, or
- Write a small TypeScript interface with only the fields you need.

Only `fake-data` may import from this subpath, because building mock objects is
the one case that needs the full shapes. An ESLint rule
(`no-restricted-imports` in `@gc-digital-talent/eslint-config`) blocks this
import in every other package; `fake-data` turns that rule off in its own
`eslint.config.js`.

## Making a schema type available in app code

If app code needs a specific small type or enum that is not exported yet from
the main entry, re-export it by name from `src/index.ts`:

```ts
export type { LocalizedString } from "./gql/schema-types";
```

Do not re-export the full object types (`User`, `Pool`, etc.). Use a fragment
or an interface for those.
