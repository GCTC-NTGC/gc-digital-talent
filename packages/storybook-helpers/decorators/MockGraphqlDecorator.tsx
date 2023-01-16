import { Client, getOperationName, Provider as GraphqlProvider } from "urql";
import { fromValue, pipe, delay } from 'wonka';
import { useParameter } from "@storybook/addons";
import { StoryContext, StoryFn } from "@storybook/react";
import random from "lodash/random";
import merge from "lodash/merge";

/**
 * MockGraphqlDecorator
 *
 * Allows custom GraphQL API responses to be set via storybook's parameter
 * feature, either in storybook files or globally.
 *
 * Storybook allows parameters to be set at 3 levels: story, component (file), global.
 * https://storybook.js.org/docs/react/writing-stories/parameters
 *
 * Components at different levels will be merged:
 * https://storybook.js.org/docs/react/writing-stories/parameters#rules-of-parameter-inheritance
 *
 * For examples of our usage, see:
 * /frontend/talentsearch/src/js/components/profile/ProfilePage/ProfilePage.stories.tsx
 */
export default function MockGraphqlDecorator(Story: StoryFn, context: StoryContext) {
  // Allow response to be set in story via parameters.
  // Source: https://johnclarke73.medium.com/mocking-react-context-in-storybook-bb57304f2f6c
  // See: https://storybook.js.org/docs/react/addons/addons-api#useparameter
  const responseData: any = useParameter('apiResponses', {})
  // Random latency delay added to each GraphQL API operation (in milliseconds).
  // Default: 0. (no latency)
  const defaultConfig = {
    latency: {
      min: 0,
      max: 0,
    },
  };
  const config = useParameter('apiResponsesConfig', defaultConfig)

  const defaultNullResponse = { data: null }

  // Mocks Graphql client passed to Provider to fake API responses.
  // See: https://formidable.com/open-source/urql/docs/advanced/testing/#response-success
  const mockClient = {
    // Allow custom responses to GraphQL queries.
    executeQuery: ({ query }) => {
      const operationName = getOperationName(query)
      const response = operationName && responseData[operationName]
      const mergedConfig = merge(defaultConfig, config)

      const operationResult = !!response
        ? pipe(
            fromValue(response),
            // Simulate latency in returning response.
            delay(random(mergedConfig.latency.min, mergedConfig.latency.max)),
          )
        : fromValue(defaultNullResponse)

      return operationResult;
    }
    // TODO: Implement for mutations when required.
  } as Client;


  return (
    <GraphqlProvider value={mockClient}>
      <Story />
    </GraphqlProvider>
  )
}

