import { Provider as GraphqlProvider } from "urql";
import { fromValue } from 'wonka';

// Any GraphQL queries returns null data response.
// See: https://formidable.com/open-source/urql/docs/advanced/testing/#response-success
export default function NullDataGraphqlDecorator(Story, context) {
  // TODO: Allow response to be set in story via useParameter hook.
  // See: https://johnclarke73.medium.com/mocking-react-context-in-storybook-bb57304f2f6c
  const mockClient = {
    executeQuery: ({ query }) => {
      const operationName = query?.definitions[0]?.name?.value
      if (operationName === 'getMyStatus')
        return fromValue({
          data: {
            me: {
              isProfileComplete: true,
              jobLookingStatus: "OPEN_TO_OPPORTUNITIES",
            }
          }
        })
    }
  }

  return (
    <GraphqlProvider value={mockClient}>
      <Story />
    </GraphqlProvider>
  )
}

