import { expect, Locator, Page } from "@playwright/test";
import { AfexModalHelper } from "../../../utils/helpers/afexModal.helper.js";
import { TEST_TIMEOUTS } from "../../../utils/constants/timeouts.js";

export class TransferCollectionPage {

    private readonly page:Page;
    private readonly afexModal:AfexModalHelper;
    private readonly cashCollectOption:Locator;
    private readonly wireTransferCollectOption:Locator;
    private readonly tbkCollectionOption:Locator;
    private readonly radioBtnRegisterTransfer:Locator;
    private readonly radioBtnSellTransfer:Locator;
    private readonly btnCollectTransfer:Locator;
    private readonly h3transferSuccess:Locator

    constructor(page:Page){
        this.page=page;
        this.afexModal= new AfexModalHelper(page);
        this.cashCollectOption= page.locator("//span[contains(text(),'Efectivo')]");
        this.wireTransferCollectOption= page.locator("//span[contains(text(),'Transferencia bancaria')]");
        this.tbkCollectionOption= page.locator("//span[contains(text(),'Transbank')]");
        this.radioBtnRegisterTransfer= page.locator("//input[@name='radio-collectAction' and @value='REGISTER']")
        this.radioBtnSellTransfer = page.locator("//input[@name='radio-collectAction' and @value='EXCHANGE']")
        this.btnCollectTransfer= page.locator("//span[contains(text(),'Recaudar')]")
        this.h3transferSuccess=page.getByRole('heading', { name: 'Recaudación exitosa' })
    }

async clickOnCashCollectOption(): Promise<void> {
    await this.afexModal.expectModalMainNotVisible();
    await this.cashCollectOption.waitFor({state:'visible', timeout: TEST_TIMEOUTS.ELEMENT_VISIBLE});
    await this.cashCollectOption.click();
}

async clickOnWireTransferCollectOption(): Promise<void> {
    await this.wireTransferCollectOption.click();
}

async clickOnTbkCollectionOption(): Promise<void> {
    await this.tbkCollectionOption.click();
}

async clickOnRegisterTransfer(): Promise<void> {
    await this.radioBtnRegisterTransfer.click();
}

async clickOnSellTransfer(): Promise<void> {
    await this.radioBtnSellTransfer.click();
}

async clickOnCollectTransfer(): Promise<void> {
    await this.btnCollectTransfer.click();
}

async expectCollectingModalVisisble(): Promise<void> {
    await this.afexModal.expectModalWithSuggestionsNotVisible();
}

async expectSummaryModalVisible(): Promise<void> {
    await expect(this.h3transferSuccess).toBeVisible({ timeout: TEST_TIMEOUTS.ELEMENT_VISIBLE });
}

async clickOnBtnConfirmInModal(): Promise<void> {
    await this.afexModal.clickConfirmButton();
}

}