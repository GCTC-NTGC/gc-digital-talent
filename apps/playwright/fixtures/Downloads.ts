import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

import AppPage from "./AppPage";

export const DOWNLOAD_BUTTON = {
  DOWNLOAD: "Download",
  EXCEL: "Download Excel",
  DOCX: "Download DOCX",
  PROFILE: "Download profile",
  FULL_DATASET: "Download full dataset",
} as const;

export const DOWNLOAD_OPTION = {
  APPLICATION: "Download application",
  FULL_PROFILE: "Download full profile",
  PROFILE: "Download profile",
  PROFILE_WITHOUT_CONTACT: "Download profile without contact information",
  APPLICATIONS_EXCEL: "Download applications Excel",
  PROFILES_EXCEL: "Download profiles Excel",
  NOMINATION: "Download nomination",
  FULL_PROFILES: "Download full profiles (.docx)",
  PROFILES_WITHOUT_CONTACT:
    "Download profiles without contact information (.docx)",
  SPREADSHEET: "Download as spreadsheet (.xlsx)",
} as const;

const FILE_READY = "Your file is ready for download";

const FIELD = {
  SELECT_ALL: "selectAll",
  DESELECT_ALL: "deselectAll",
  SELECTED_ROWS: "selectedRows",
  UNSELECTED_ROWS: "unselectedRows",
  VIEW_NOTIFICATIONS: "viewNotifications",
  REFRESH_NOTIFICATIONS: "refreshNotifications",
  PREPARING_TOAST: "preparingToast",
  FILE_READY_TOAST: "fileReadyToast",
} as const;

type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;
type DownloadButton = ObjectValues<typeof DOWNLOAD_BUTTON>;
type DownloadOption = ObjectValues<typeof DOWNLOAD_OPTION>;

class Downloads extends AppPage {
  readonly locators: Record<Field, Locator>;

  constructor(page: Page) {
    super(page);
    this.locators = {
      [FIELD.SELECT_ALL]: page.getByRole("button", {
        name: "Select Select all",
        exact: true,
      }),
      [FIELD.DESELECT_ALL]: page.getByRole("button", {
        name: "Deselect Select all",
        exact: true,
      }),
      [FIELD.SELECTED_ROWS]: page
        .getByRole("button", { name: /^deselect /i })
        .filter({ hasNotText: /select all$/i }),
      [FIELD.UNSELECTED_ROWS]: page
        .getByRole("button", { name: /^select /i })
        .filter({ hasNotText: /select all$/i }),
      [FIELD.VIEW_NOTIFICATIONS]: page.getByRole("button", {
        name: /view notifications/i,
      }),
      [FIELD.REFRESH_NOTIFICATIONS]: page.getByRole("button", {
        name: /refresh/i,
      }),
      [FIELD.PREPARING_TOAST]: page.getByRole("alert").filter({
        hasText:
          "Preparing your file for download. You will receive a notification when it is ready.",
      }),
      [FIELD.FILE_READY_TOAST]: page.getByRole("alert").filter({
        hasText: `${FILE_READY}. Check your notifications.`,
      }),
    };
  }

  private async clickDownload(button: DownloadButton, option?: DownloadOption) {
    // The candidate application page shows the same download menu twice
    await this.page
      .getByRole("button", { name: button, exact: true })
      .first()
      .click();
    if (option) {
      await this.page
        .getByRole("menuitem", { name: option, exact: true })
        .click();
    }
  }

  async selectAllRows() {
    await expect(this.locators[FIELD.UNSELECTED_ROWS].first()).toBeVisible();
    await this.locators[FIELD.SELECT_ALL].click();
    await expect(this.locators[FIELD.DESELECT_ALL]).toBeVisible();
    return this.getRowNames();
  }

  async getRowNames() {
    const labels = await this.locators[FIELD.SELECTED_ROWS]
      .or(this.locators[FIELD.UNSELECTED_ROWS])
      .allTextContents();
    return labels.map((label) => label.replace(/^(de)?select /i, ""));
  }

  async selectFirstRow() {
    await this.locators[FIELD.DESELECT_ALL].click();
    await this.locators[FIELD.UNSELECTED_ROWS].first().click();
    await expect(this.locators[FIELD.SELECTED_ROWS]).toHaveCount(1);
  }

  async downloadFile(button: DownloadButton, option?: DownloadOption) {
    const downloadPromise = this.page.waitForEvent("download");
    await this.clickDownload(button, option);
    const download = await downloadPromise;
    return download.path();
  }

  private async refreshNotifications() {
    const notificationsResponse =
      this.waitForGraphqlResponse("NotificationDialog");
    await this.locators[FIELD.REFRESH_NOTIFICATIONS].click();
    await notificationsResponse;
    await expect(this.locators[FIELD.REFRESH_NOTIFICATIONS]).not.toHaveClass(
      /animate-spin/,
    );
  }

  async downloadFromNotifications(
    button: DownloadButton,
    fileName: string,
    option?: DownloadOption,
  ) {
    const fileLinks = this.page.getByRole("link", { name: fileName });
    await this.locators[FIELD.VIEW_NOTIFICATIONS].click();
    await this.refreshNotifications();
    const [previousFile] = await fileLinks.allTextContents();
    await this.page.keyboard.press("Escape");
    await this.clickDownload(button, option);
    await expect(this.locators[FIELD.PREPARING_TOAST]).toBeVisible();
    await expect(this.locators[FIELD.FILE_READY_TOAST]).toBeVisible({
      timeout: 180_000,
    });
    await this.locators[FIELD.VIEW_NOTIFICATIONS].click();
    // Each generated file name has a timestamp, so a new newest link is this download
    await expect(async () => {
      await this.refreshNotifications();
      const [newestFile] = await fileLinks.allTextContents();
      expect(newestFile).not.toBe(previousFile);
    }).toPass({ intervals: [1_000, 2_000, 5_000], timeout: 180_000 });
    await expect(fileLinks.first()).toContainText(`${FILE_READY}: `);
    const downloadPromise = this.page.waitForEvent("download");
    await fileLinks.first().click();
    const download = await downloadPromise;
    return download.path();
  }
}

export default Downloads;
