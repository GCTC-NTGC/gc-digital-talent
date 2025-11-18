import { Page } from "@playwright/test";
import mammoth from "mammoth";

/**
 * Word document
 *
 * Page containing utilities for interacting with a word document
 */
class WordDocument {
  public readonly page: Page;

  constructor(public readonly newPage: Page) {
    this.page = newPage;
  }

  async setContent(path: string) {
    const html = await mammoth
      .convertToHtml({ path })
      .then((result) => result.value);

    await this.page.setContent(html);
  }
}

export default WordDocument;
