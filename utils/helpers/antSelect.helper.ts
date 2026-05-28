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
    const dropdown = this.page.locator('.ant-select-dropdown:visible .rc-virtual-list-holder').last();
    const option = this.page.locator(`.ant-select-dropdown:visible .ant-select-item-option[title="${text}"]`);
    // Scroll dentro del dropdown hasta que la opción sea visible (virtual list)
    while (!(await option.isVisible())) {
      await dropdown.evaluate((el) => { el.scrollTop += 100; });
    }
    await option.click();
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
