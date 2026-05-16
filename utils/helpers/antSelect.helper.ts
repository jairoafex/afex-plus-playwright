import { Page } from '@playwright/test';

export class AntSelectHelpers {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Selecciona una opción del dropdown de Ant Design buscando por texto exacto.
   */
  async selectByText(text: string): Promise<void> {
    await this.page
      .locator(`.ant-select-dropdown:visible .ant-select-item-option[title="${text}"]`)
      .click();
  }

  /**
   * Selecciona una opción del dropdown de Ant Design buscando por texto parcial.
   */
  async selectByPartialText(text: string): Promise<void> {
    await this.page
      .locator(`.ant-select-dropdown:visible .ant-select-item-option`)
      .filter({ hasText: text })
      .first()
      .click();
  }
}
