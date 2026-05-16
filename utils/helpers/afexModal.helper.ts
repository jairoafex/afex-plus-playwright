import { Page, Locator, expect } from '@playwright/test';
import { TEST_TIMEOUTS } from '../constants/timeouts';

export class AfexModalHelper {
  private readonly page: Page;
  private readonly modal: Locator;
  private readonly closeButton: Locator;
  private readonly modalMain:Locator;
  private readonly modalWithSuggestions:Locator;
  private readonly summaryModal:Locator;
  private readonly modalBtnConfirm:Locator
  private readonly modalBtnDismiss:Locator
  private readonly modalDefaultLoading:Locator;
  private readonly modaldefaultError:Locator;
  private readonly detailsError:Locator;
  private readonly detailsErrorContent:Locator;
  private readonly antSpinSpinning:Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('#afex-modal');
    this.closeButton = this.modal.locator('button.close');
    this.modalMain= this.page.locator('.afex-modal__main')
    this.modalWithSuggestions= page.locator("//div[contains(@class,'afex-modal-with-suggestions')]")
    this.summaryModal= page.locator("//div[contains(@class,'summary-modal')]")
    this.modalBtnConfirm= page.getByTestId('afex-modal-button-confirm')
    this.modalBtnDismiss= page.getByTestId('afex-modal-button-dismiss')
    this.modalDefaultLoading= page.locator("//div[contains(@class,'default-loading')]")
    this.modaldefaultError =page.locator("//div[contains(@class,'error-modal')]")
    this.detailsError= page.locator("//details[contains(@class,'error-details')]")
    this.detailsErrorContent= page.locator("//div[contains(@class,'error-details-content')]")
    this.antSpinSpinning= this.page.locator(".ant-spin-spinning")
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible().catch(() => false);
  }

  async closeIfVisible(): Promise<void> {
    if (await this.isVisible()) {
      await this.closeButton.click();
    }
  }

  async expectVisible(): Promise<void> {
    await this.modal.waitFor({ state: 'visible', timeout: TEST_TIMEOUTS.MODAL_OPERATION });
  }
  async expectModalWithSuggestionsNotVisible(): Promise<void> {
    await this.modalWithSuggestions.waitFor({ state: 'hidden', timeout: TEST_TIMEOUTS.LOADING_SPINNER });
  }
  async expectModalMainNotVisible(): Promise<void> {
    try {
      await this.modalMain.waitFor({ state: 'hidden', timeout: TEST_TIMEOUTS.MODAL_OPERATION });
    } catch {
      console.warn('Modal tardó más de lo esperado en desaparecer');
    }
  }
    async summaryModalIsVisible(): Promise<boolean> {
    return this.summaryModal.isVisible().catch(() => false);
  }
  async clickConfirmButton(): Promise<void> {
    await this.modalBtnConfirm.click();
  }
    async expectModalDefaultNotVisible(): Promise<void> {
    await this.modalDefaultLoading.waitFor({ state: 'hidden', timeout: TEST_TIMEOUTS.LOADING_SPINNER });
  }

  async expectModalErrorVisible(): Promise<boolean> {
    try {
      await this.modaldefaultError.waitFor({ state: 'visible', timeout: TEST_TIMEOUTS.MODAL_OPERATION });
      return true;
    } catch {
      return false;
    }
  }

  async clickOnBtnConfirmInErrorModal(): Promise<void> {
    if(await this.expectModalErrorVisible()){
      await this.modalBtnConfirm.click();
    }
    else{
      throw new Error ("Error modal is not visible")
    }
  }

  async clickOnBtnDismissInErrorModal(): Promise<void> {
    if(await this.expectModalErrorVisible()){
      await this.modalBtnDismiss.click();
    }
    else{
      throw new Error ("Error modal is not visible")
    }
  }
  async getDetailsErrorContent(): Promise<string> {
     if(await this.expectModalErrorVisible()){
        await this.detailsError.click();
        return this.detailsErrorContent.innerText();
    }
    else{
      throw new Error ("Error modal is not visible")
    }
  }
  async waitForSpinnerToDisappear(): Promise<void> {
    try {
      await this.antSpinSpinning.waitFor({ state: 'visible', timeout: TEST_TIMEOUTS.ELEMENT_VISIBLE }).catch(() => {});
      await this.antSpinSpinning.waitFor({ state: 'hidden', timeout: TEST_TIMEOUTS.LOADING_SPINNER });
    } catch  {
      throw new Error('El spinner tardó más de lo esperado en desaparecer');
    }
  }

  async dismissDteErrorIfVisible(timeout = 5_000): Promise<void> {
    try {
      await this.modaldefaultError.waitFor({ state: 'visible', timeout });
      await this.modalBtnConfirm.click();
      // Si aparece de nuevo, cerrar y continuar
      try {
        await this.modaldefaultError.waitFor({ state: 'visible', timeout: 3_000 });
        await this.modalBtnConfirm.click();
      } catch {
        // No volvió a aparecer
      }
    } catch {
      // No apareció error DTE
    }
  }
}