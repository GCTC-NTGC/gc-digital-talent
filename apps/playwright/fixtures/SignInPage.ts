import { type Page, type Locator} from "@playwright/test";

export class SignInPage {
  readonly page: Page;
  readonly url: string = "https://talent.canada.ca/en/";
  readonly usernameInputLocator: Locator;
  readonly passwordInputLocator: Locator;
  readonly signInButtonLocator: Locator;
  readonly continueButtonLocator: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.usernameInputLocator = page.getByPlaceholder("Username");
    this.passwordInputLocator = page.getByPlaceholder("Password");
    this.signInButtonLocator = page.getByRole("link", { name: "Sign in" });
    this.continueButtonLocator = page.locator('button:has-text("Continue")');
  }
  async visit() {
    await this.page.goto(this.url);
  }
  async login(email: string, password: string) {
    await this.usernameInputLocator.fill(email);
    await this.passwordInputLocator.fill(password);
    await this.signInButtonLocator.click();
  }

  async isSignedIn() {
    const welcomeLocator = this.page.locator('div:has-text("welcome")');
    return await welcomeLocator.isVisible();
  }

  async clickContinue() {
    await this.continueButtonLocator.click();
  }
}
