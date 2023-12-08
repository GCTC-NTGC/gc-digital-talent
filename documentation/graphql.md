# 🕸️ GraphQL

When consuming the GraphQL API on the client, [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) is used to create and type the operation documents. The GraphQL client [urql](https://formidable.com/open-source/urql/) is used to execute and cache the queries and mutations.

## 🌟 Benefits of Codegen

This is a brief summary of an article that explains the benefits and implementation of codegen's preset. It is recommended to read the original article "[Unleash the power of Fragments with GraphQL Codegen](https://the-guild.dev/blog/unleash-the-power-of-fragments-with-graphql-codegen)" to gain a deeper understanding of the topic.

### 🧩 Fragments

The preset allows for better use of fragments. This means that queries can be composed and built from the "bottom up" similar to react's data flow, but in reverse. Instead of writing one large query and pulling out the pieces needed for each component, the component can be referenced for what it needs and build the query from that information.

### 🗺️ Collocation

The current implementation of collocation occurs by placing any `*.operations.graphql` files as close as possible to the page or component that uses them. Now, the possibility exists (and the practice of it is stronger encouraged) to place them in the file that uses them. No more hunting for the proper file!

### 👺 Masking

Fragment masking provides a way to strongly type the specific fragment used in a query for our consumption. Previously, some problems existed in the codebase where additional information was added to a component, but since the type system was very relaxed (it showed what *could* be queried, not what *was* being queried), sometimes the query was not updated and ended up with empty values.

With fragment masking, a type error is returned if data is used that was never queried along with triggering a build error.

## 🛠️ Implementation

All examples are related and show how to build a page and its operations from the bottom up.

### ⚛️ Component

When defining a component that needs to consume data from the API, there are a few things to do for the code generator to work.

 1. Import the `graphql` helper which accepts a graphql document string (for components, this will be a fragment)
 2. Add the fragment to the prop types so it can be passed in
 3. Mask the fragment for strong typing of the fields queried


```tsx
// PoolCard.tsx
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

export const PoolCard_PoolFragment = graphql(/* GraphQL */ `
  fragment PoolCard_PoolFragment on Pool {
    id
    name {
      en
      fr
    }
  }
`)

type PoolCardProps = {
  pool: FragmentType<typeof PoolCard_PoolFragment>;
}

const PoolCard = ({ pool: poolFragment }: PoolCardProps) => {
  // This extracts and strongly types the fields that were defined in the fragment
  const pool = getFragment(PoolCard_PoolFragment, poolFragment);

  return (
    <>
      <p>{getLocalizedName(pool.name, intl)}</p>
      {/** ⚠️ This will display an error and fail to build since it was never queried it in the fragment! */}
      <p>{pool.stream}<p>
    </>
  );
}
```


### 📖 Storybook

Since the props require a specific type that comes from the code generator, the mocked data passed into stories needs to be massaged. Thankfully, there is a nice little helper (`makeFragmentData`) to do this.

```tsx
// PoolCard.stories.tsx
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { fakePools } from "@gc-digital-talent/fake-data";

import PoolCard, { PoolCard__PoolFragment } from "./PoolCard";

const mockPools = fakePools();
const mockPoolFragment = makeFragmentData(mockPools[0], PoolCard__PoolFragment);

const Template = () => <PoolCard pool={mockPoolFragment} />;
```

### 🧪 Testing

Similar to storybook, create the fragment using the helper (`makeFragmentData`).

```tsx
// PoolCard.tests.tsx
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { fakePools } from "@gc-digital-talent/fake-data";
import { renderWithProviders } from "@gc-digital-talent/jest-helpers";

import PoolCard, { PoolCard__PoolFragment } from "./PoolCard";

const mockPools = fakePools();
const mockPoolFragment = makeFragmentData(mockPools[0], PoolCard__PoolFragment);

const render = (props) => renderWithProviders(<PoolCard {...props} />);

test("PoolCard", () => {
  it("should do something", () => {
    const { container } = render({ pool: mockPoolFragment });
    // Test some conditions
  });
});
```

## 📃 Page

For implementing this component on a page, the defined fragment can be used when building the query.

```tsx
// PoolList.tsx
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

export const PoolList_QueryFragment = graphql(/* GraphQL */ `
  fragment PoolList_QueryFragment on Query {
    pools {
      ...PoolCard__PoolFragment /* No need to import, codegen is aware of the fragment! */
    }
  }
`)

type PoolListProps = {
  query: FragmentType<typeof PoolList_QueryFragment>;
}

const PoolList = ({ query }: PoolListProps) => {
  const pools = getFragment(PoolList_QueryFragment, query);
  
  return pools.map((pool) => (
    <PoolCard key={pool.id} pool={pool} />
  ))
}

// PoolPage.tsx
import { useQuery } from "urql";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

export const PoolPage_Query = graphql(/* GraphQL */ `
  query PoolPage_Query {
    ...PoolList_QueryFragment
  }
`)

const PoolPage = ({ pools: poolsFragment }: PoolPageProps) => {
  const [{data}] = useQuery({ query: PoolPage_Query })
  
  return <PoolList query={data} />;
}
```

