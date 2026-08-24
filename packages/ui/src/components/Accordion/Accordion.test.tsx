import { faker } from "@faker-js/faker/locale/en";
import { screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ComponentPropsWithoutRef } from "react";

import {
  renderWithProviders,
  expectNoAccessibilityErrors,
} from "@gc-digital-talent/vitest-helpers";

import Accordion from "./Accordion";
import { testMetaData } from "./utils";

type AccordionRootPrimitivePropsWithoutRef = ComponentPropsWithoutRef<
  typeof Accordion.Root
>;

function renderAccordion({
  children,
  ...rest
}: AccordionRootPrimitivePropsWithoutRef) {
  return renderWithProviders(
    <Accordion.Root {...rest}>{children}</Accordion.Root>,
  );
}

const Text = () => <p>{faker.lorem.sentences(5)}</p>;

const DefaultChildren = () => (
  <>
    <Accordion.Item value="one">
      <Accordion.Trigger>Accordion One</Accordion.Trigger>
      <Accordion.MetaData metadata={testMetaData} />
      <Accordion.Content>
        <Text />
      </Accordion.Content>
    </Accordion.Item>{" "}
    <Accordion.Item value="two">
      <Accordion.Trigger>Accordion Two</Accordion.Trigger>
      <Accordion.Content>
        <Text />
      </Accordion.Content>
    </Accordion.Item>
  </>
);

describe("Accordion", () => {
  const user = userEvent.setup();

  it("should not have accessibility errors when single", async () => {
    const { container } = renderAccordion({
      type: "single",
      children: <DefaultChildren />,
    });
    await expectNoAccessibilityErrors(container);
  });

  it("should not have accessibility errors when multiple", async () => {
    const { container } = renderAccordion({
      type: "single",
      children: <DefaultChildren />,
    });
    await expectNoAccessibilityErrors(container);
  });

  // A heading is flow content, which is invalid inside <button>, so the heading
  // has to wrap the trigger rather than sit within it.
  it.each([
    ["h2" as const, 2],
    ["h3" as const, 3],
    ["h4" as const, 4],
  ])("should render an %s around the trigger, not inside it", (as, level) => {
    renderAccordion({
      type: "single",
      children: (
        <Accordion.Item value="one">
          <Accordion.Trigger as={as} subtitle="Accordion subtitle" context="12">
            Accordion One
          </Accordion.Trigger>
          <Accordion.Content>
            <Text />
          </Accordion.Content>
        </Accordion.Item>
      ),
    });

    const trigger = screen.getByRole("button", { name: /accordion one/i });
    expect(within(trigger).queryByRole("heading")).toBeNull();

    const heading = screen.getByRole("heading", { level });
    expect(heading).toContainElement(trigger);
    // The context is a sibling of the heading, so it stays out of its text.
    expect(heading).not.toHaveTextContent("12");
  });

  it("should only open one when single", async () => {
    renderAccordion({
      type: "single",
      children: <DefaultChildren />,
    });

    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: /accordion one/i }));
    await user.click(screen.getByRole("button", { name: /accordion two/i }));

    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(1);
    expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(1);
  });

  it("should should open two when multiple", async () => {
    renderAccordion({
      type: "multiple",
      children: <DefaultChildren />,
    });

    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: /accordion one/i }));
    await user.click(screen.getByRole("button", { name: /accordion two/i }));

    expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(2);
  });
});
