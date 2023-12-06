# 🕸️ GraphQL

When consuming our GraphQL API on the client, we use [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) to create and type our operation documents. Then, we execute and cache the queries/mutations using [URQL](https://formidable.com/open-source/urql/).

## 🌟 Benefits of Codegen

This is a brief summary of an article written explaining the benefits and implementation of codegen's preset. We recommend reading the article "[Unleash the power of Fragments with GraphQL Codegen](https://the-guild.dev/blog/unleash-the-power-of-fragments-with-graphql-codegen)" to get a deeper understanding.

### 🧩 Fragments

The preset allows us to better utilize fragments. This means we can compose our queries and build them "bottom up" similar to the react data flow, but in reverse. Instead of writing one large query and pulling out the pieces we need for each component, we can use the component to tell us what it needs and build the query from that.

### 🗺️ Collocation

Currently, we achieve this by placing our `*.operations.graphql` files as close as possible to the page/component that uses them. Now, we can (and should) place them in the file that uses them. No more hunting for the proper file!

### 👺 Masking

With the fragments, we can use what is referred to as "fragment masking". What this provides is a way to strongly type the specific fragment used in a query for our consumption. Previously, we had some problems where we added additional information to a component, but since our type system was very relaxed (it showed us what *could* be queried, not what *was* queried) we sometimes forgot to update the query and ended up with empty values.

Now, we get a type error if we use data we never queried and will get a build error.

## 🛠️ Implementation

All examples are related and show how we would build a page and its operations bottom up.

### ⚛️ Component

When defining a component that needs to consume data from the API, you need to do a few things for the code generator to work.

 1. Import the `graphql` helper which accepts a graphql document string (for components this will be a fragment)
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
  // This extracts and strongly types the fields we defined in the fragment
  const pool = getFragment(PoolCard_PoolFragment, poolFragment);

  return (
    <>
      <p>{getLocalizedName(pool.name, intl)}</p>
      {/** ⚠️ This will display an error and fail to build since we never queried it in the fragment! */}
      <p>{pool.stream}<p>
    </>
  );
}
```


### 📖 Storybook

Since our props require a specific type that comes from the code generator, we need to massage the mock data we pass into stories. Thankfully, we have a nice little helper to do this.

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

Similar to storybook, we just need to create the fragment using the helper.

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

Now, we use this component on a page, we can use the defined fragment when building the query.

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

