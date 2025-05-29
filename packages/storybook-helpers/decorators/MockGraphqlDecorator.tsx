import { Provider as GraphqlProvider } from "urql";
import { Client } from "@urql/core";
import { fromValue, pipe, delay } from "wonka";
import { useParameter } from "storybook/preview-api";
import { StoryFn } from "@storybook/react";
import random from "lodash/random";
import merge from "lodash/merge";
import { DocumentNode, Kind } from "graphql";

interface DelayConfig {
  latency: {
    min: number;
    max: number;
  };
}

// Random latency delay added to each GraphQL API operation (in milliseconds).
// Default: 0. (no latency)
const defaultConfig = {
  latency: {
    min: 0,
    max: 0,
  },
};
const defaultNullResponse = { data: null };

/**
 * Mock API request that can be used with queries and mutations
 * to return a specific response with simulated latency
 *
 * @param DocumentNode The graphql document
 * @param Record<string, unknown> The mock response
 * @param DelayConfig Configuration for the simulated latency
 */
const mockRequest = (
  doc: DocumentNode,
  responseData: Record<string, unknown>,
  config: DelayConfig,
) => {
  let operationName: string | undefined;
  for (const node of doc.definitions) {
    if (node.kind === Kind.OPERATION_DEFINITION) {
      operationName = node.name ? node.name.value : undefined;
      break;
    }
  }
  const response = operationName && responseData[operationName];

  const operationResult = response
    ? pipe(
        fromValue(response),
        // Simulate latency in returning response.
        delay(random(config.latency.min, config.latency.max)),
      )
    : fromValue(defaultNullResponse);

  return operationResult;
};

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
 * /apps/web/src/pages/ProfilePage/ProfilePage/ProfilePage.stories.tsx
 */
export default function MockGraphqlDecorator(Story: StoryFn) {
  // Allow response to be set in story via parameters.
  // Source: https://johnclarke73.medium.com/mocking-react-context-in-storybook-bb57304f2f6c
  // See: https://storybook.js.org/docs/react/addons/addons-api#useparameter
  const responseData =
    useParameter<Record<string, unknown>>("apiResponses", {}) ?? {};
  const config = useParameter("apiResponsesConfig", defaultConfig);
  const mergedConfig = merge(defaultConfig, config);

  // Mocks Graphql client passed to Provider to fake API responses.
  // See: https://formidable.com/open-source/urql/docs/advanced/testing/#response-success
  const mockClient = {
    // Allow custom responses to GraphQL queries.
    executeQuery: ({ query }) => mockRequest(query, responseData, mergedConfig),
    executeMutation: ({ query }) =>
      mockRequest(query, responseData, mergedConfig),
  } as Client;

  return (
    <GraphqlProvider value={mockClient}>
      <Story />
    </GraphqlProvider>
  );
}
