import type { Meta, StoryFn } from "@storybook/react-vite";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import type { ListVariants } from "./styles";
import Ol from "./Ol";
import Ul from "./Ul";

const spaces: ListVariants["space"][] = ["sm", "md", "lg", "xl"];

// A visible sibling so the gap below the last item is legible in a snapshot.
const Boundary = () => (
  <div className="border-t border-error bg-error/10 p-1.5 text-sm">
    Following content
  </div>
);

export default {
  component: Ul,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} as Meta<typeof Ul>;

const Template: StoryFn<typeof Ul> = () => (
  <div className="flex flex-col gap-12">
    {spaces.map((space) => (
      <div key={space}>
        <p className="mb-3 font-bold">{`space="${space}"`}</p>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <Ul space={space}>
              <li>Unordered one</li>
              <li>Unordered two</li>
              <li>Unordered three</li>
            </Ul>
            <Boundary />
          </div>
          <div>
            <Ol space={space}>
              <li>Ordered one</li>
              <li>Ordered two</li>
              <li>Ordered three</li>
            </Ol>
            <Boundary />
          </div>
          <div>
            <Ul space={space} unStyled>
              <li>Unstyled one</li>
              <li>Unstyled two</li>
              <li>Unstyled three</li>
            </Ul>
            <Boundary />
          </div>
        </div>
      </div>
    ))}
    <div>
      <p className="mb-3 font-bold">Nested</p>
      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <Ul space="md">
            <li>
              Parent one
              <Ul space="md">
                <li>Child one</li>
                <li>Child two</li>
              </Ul>
            </li>
            <li>
              Parent two
              <Ul space="md">
                <li>Child one</li>
                <li>Child two</li>
              </Ul>
            </li>
          </Ul>
          <Boundary />
        </div>
        <div>
          <Ol space="md" inside>
            <li>Inside one</li>
            <li>Inside two</li>
          </Ol>
          <Boundary />
        </div>
        <div>
          <Ul space="md" noIndent>
            <li>No indent one</li>
            <li>No indent two</li>
          </Ul>
          <Boundary />
        </div>
      </div>
    </div>
    <div>
      <p className="mb-3 font-bold">Nested (mismatched space)</p>
      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <Ul space="lg">
            <li>
              Parent one
              <Ul space="sm">
                <li>Child one</li>
                <li>Child two</li>
              </Ul>
            </li>
            <li>
              Parent two
              <Ul space="sm">
                <li>Child one</li>
                <li>Child two</li>
              </Ul>
            </li>
          </Ul>
          <Boundary />
        </div>
      </div>
    </div>
  </div>
);

export const Default = Template.bind({});
