import { Locator, Page, expect } from "@playwright/test";
import { TEST_TIMEOUTS } from "../../../utils/constants/timeouts.js";

export class TransferDetailsPage {
  private readonly page: Page;
  private readonly inputTransferCode: Locator;
  private readonly inputPayingAgent: Locator;

  constructor(page: Page) {
    this.page = page;

    this.inputTransferCode = page.locator('input[label="Código del giro"]');
    this.inputPayingAgent = page.locator('input[label="Agente pagador"]');
  }

  async getTransferCode(): Promise<string> {
    await expect(this.inputTransferCode).toBeAttached({ timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    return await this.inputTransferCode.inputValue();
  }

  async getPayingAgent(): Promise<string> {
    await expect(this.inputPayingAgent).toBeAttached({ timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    return await this.inputPayingAgent.inputValue();
  }

  async expectGiroCode(pattern: RegExp): Promise<void> {
    await this.inputTransferCode.waitFor({ state: 'visible', timeout: TEST_TIMEOUTS.ELEMENT_VISIBLE });
    await expect(this.inputTransferCode).not.toHaveValue('', { timeout: TEST_TIMEOUTS.NORMAL_OPERATION });
    const code = await this.getTransferCode();
    expect(code).toMatch(pattern);
  }
}
