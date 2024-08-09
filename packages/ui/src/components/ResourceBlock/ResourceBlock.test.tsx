/**
 * @jest-environment jsdom
 */

import { faker } from "@faker-js/faker/locale/en";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import ResourceBlock from "./ResourceBlock";
import Link from "../Link";

function renderComponent() {
  return renderWithProviders(
    <ResourceBlock.Root title={faker.lorem.words()} headingColor="primary">
      <ResourceBlock.Item
        link={
          <Link href={faker.internet.url()}>
            {faker.commerce.productName()}
          </Link>
        }
        description={faker.lorem.paragraph()}
      />
    </ResourceBlock.Root>,
  );
}

describe("ResourceBlock", () => {
  it("should not have accessibility errors", async () => {
    const { container } = renderComponent();
    await axeTest(container);
  });
});
