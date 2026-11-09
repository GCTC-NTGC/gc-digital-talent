import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import mammoth from "mammoth";

import type { GraphQLContext } from "~/utils/graphql";
import { getUserById } from "~/utils/user";

/**
 * Word document
 *
 * Opens a downloaded word document in its own tab next to the app
 */
class WordDocument {
  private documentPage?: Page;

  constructor(public readonly appPage: Page) {}

  get page() {
    if (!this.documentPage) {
      throw new Error("Open a document with setContent first");
    }
    return this.documentPage;
  }

  async setContent(path: string) {
    const html = await mammoth
      .convertToHtml({ path })
      .then((result) => result.value);

    await this.documentPage?.close();
    this.documentPage = await this.appPage.context().newPage();
    await this.documentPage.setContent(html);
  }

  // Close the document tab and go back to the app
  async close() {
    await this.documentPage?.close();
    this.documentPage = undefined;
    await this.appPage.bringToFront();
  }

  heading(name: string) {
    return this.page.getByRole("heading", { name, exact: true });
  }

  text(text: string) {
    return this.page.getByText(text);
  }

  async validateUserProfile(userId: string, ctx: GraphQLContext) {
    const user = await getUserById(ctx, { id: userId });
    const lines = await this.page.getByRole("paragraph").allTextContents();
    // Details are "Label: value" lines, and the user's own come before their experiences
    const details: Record<string, string> = {};
    for (const line of lines) {
      const [label, value = ""] = line.split(": ");
      details[label] ??= value;
    }
    expect.soft(details, `Profile of user ${user.id}`).toMatchObject({
      "Contact email address": user.email ?? "",
      Telephone: user.telephone ?? "",
      "Communication language": user.preferredLang?.label.en ?? "",
      "Member of CAF": user.armedForcesStatus?.label.en ?? "",
      Citizenship: user.citizenship?.label.en ?? "",
      City: [user.currentCity, user.currentProvince?.label.en]
        .filter(Boolean)
        .join(", "),
    });
  }
}

export default WordDocument;
