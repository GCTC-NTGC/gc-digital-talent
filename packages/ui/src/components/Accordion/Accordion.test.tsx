/**
 * @jest-environment jsdom
 */

import { faker } from "@faker-js/faker/locale/en";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ComponentPropsWithoutRef } from "react";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import Accordion from "./Accordion";

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
    await axeTest(container);
  });

  it("should not have accessibility errors when multiple", async () => {
    const { container } = renderAccordion({
      type: "single",
      children: <DefaultChildren />,
    });
    await axeTest(container);
  });

  it("should should only open one when single", async () => {
    renderAccordion({
      type: "single",
      children: <DefaultChildren />,
    });

    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: /one/i }));
    await user.click(screen.getByRole("button", { name: /two/i }));

    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(1);
    expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(1);
  });

  it("should should open two when multiple", async () => {
    renderAccordion({
      type: "multiple",
      children: <DefaultChildren />,
    });

    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: /one/i }));
    await user.click(screen.getByRole("button", { name: /two/i }));

    expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(2);
  });
});
