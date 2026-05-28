# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/specs/terrapay-europe.spec.ts >> Europa — Terrapay Depósito >> Estonia — empresa remitente >> Crear giro Terrapay a Estonia cotizando monto a enviar en USD con nuevo beneficiario persona
- Location: tests/ui/specs/terrapay-europe.spec.ts:174:9

# Error details

```
Error: El spinner tardó más de lo esperado en desaparecer
```

# Test source

```ts
  8   |   private readonly modalMain:Locator;
  9   |   private readonly modalWithSuggestions:Locator;
  10  |   private readonly summaryModal:Locator;
  11  |   private readonly modalBtnConfirm:Locator
  12  |   private readonly modalBtnDismiss:Locator
  13  |   private readonly modalDefaultLoading:Locator;
  14  |   private readonly modaldefaultError:Locator;
  15  |   private readonly detailsError:Locator;
  16  |   private readonly detailsErrorContent:Locator;
  17  |   private readonly antSpinSpinning:Locator;
  18  | 
  19  |   constructor(page: Page) {
  20  |     this.page = page;
  21  |     this.modal = page.locator('#afex-modal');
  22  |     this.closeButton = this.modal.locator('button.close');
  23  |     this.modalMain= this.page.locator('.afex-modal__main')
  24  |     this.modalWithSuggestions= page.locator("//div[contains(@class,'afex-modal-with-suggestions')]")
  25  |     this.summaryModal= page.locator("//div[contains(@class,'summary-modal')]")
  26  |     this.modalBtnConfirm= page.getByTestId('afex-modal-button-confirm')
  27  |     this.modalBtnDismiss= page.getByTestId('afex-modal-button-dismiss')
  28  |     this.modalDefaultLoading= page.locator("//div[contains(@class,'default-loading')]")
  29  |     this.modaldefaultError =page.locator("//div[contains(@class,'error-modal')]")
  30  |     this.detailsError= page.locator("//details[contains(@class,'error-details')]")
  31  |     this.detailsErrorContent= page.locator("//div[contains(@class,'error-details-content')]")
  32  |     this.antSpinSpinning= this.page.locator(".ant-spin-spinning")
  33  |   }
  34  | 
  35  |   async isVisible(): Promise<boolean> {
  36  |     return this.modal.isVisible().catch(() => false);
  37  |   }
  38  | 
  39  |   async closeIfVisible(): Promise<void> {
  40  |     if (await this.isVisible()) {
  41  |       await this.closeButton.click();
  42  |     }
  43  |   }
  44  | 
  45  |   async expectVisible(): Promise<void> {
  46  |     await this.modal.waitFor({ state: 'visible', timeout: TEST_TIMEOUTS.MODAL_OPERATION });
  47  |   }
  48  |   async expectModalWithSuggestionsNotVisible(): Promise<void> {
  49  |     await this.modalWithSuggestions.waitFor({ state: 'hidden', timeout: TEST_TIMEOUTS.LOADING_SPINNER });
  50  |   }
  51  |   async expectModalMainNotVisible(): Promise<void> {
  52  |     try {
  53  |       await this.modalMain.waitFor({ state: 'hidden', timeout: TEST_TIMEOUTS.MODAL_OPERATION });
  54  |     } catch {
  55  |       console.warn('Modal tardó más de lo esperado en desaparecer');
  56  |     }
  57  |   }
  58  |     async summaryModalIsVisible(): Promise<boolean> {
  59  |     return this.summaryModal.isVisible().catch(() => false);
  60  |   }
  61  |   async clickConfirmButton(): Promise<void> {
  62  |     await this.modalBtnConfirm.click();
  63  |   }
  64  |     async expectModalDefaultNotVisible(): Promise<void> {
  65  |     await this.modalDefaultLoading.waitFor({ state: 'hidden', timeout: TEST_TIMEOUTS.LOADING_SPINNER });
  66  |   }
  67  | 
  68  |   async expectModalErrorVisible(): Promise<boolean> {
  69  |     try {
  70  |       await this.modaldefaultError.waitFor({ state: 'visible', timeout: TEST_TIMEOUTS.MODAL_OPERATION });
  71  |       return true;
  72  |     } catch {
  73  |       return false;
  74  |     }
  75  |   }
  76  | 
  77  |   async clickOnBtnConfirmInErrorModal(): Promise<void> {
  78  |     if(await this.expectModalErrorVisible()){
  79  |       await this.modalBtnConfirm.click();
  80  |     }
  81  |     else{
  82  |       throw new Error ("Error modal is not visible")
  83  |     }
  84  |   }
  85  | 
  86  |   async clickOnBtnDismissInErrorModal(): Promise<void> {
  87  |     if(await this.expectModalErrorVisible()){
  88  |       await this.modalBtnDismiss.click();
  89  |     }
  90  |     else{
  91  |       throw new Error ("Error modal is not visible")
  92  |     }
  93  |   }
  94  |   async getDetailsErrorContent(): Promise<string> {
  95  |      if(await this.expectModalErrorVisible()){
  96  |         await this.detailsError.click();
  97  |         return this.detailsErrorContent.innerText();
  98  |     }
  99  |     else{
  100 |       throw new Error ("Error modal is not visible")
  101 |     }
  102 |   }
  103 |   async waitForSpinnerToDisappear(): Promise<void> {
  104 |     try {
  105 |       await this.antSpinSpinning.waitFor({ state: 'visible', timeout: TEST_TIMEOUTS.ELEMENT_VISIBLE }).catch(() => {});
  106 |       await this.antSpinSpinning.waitFor({ state: 'hidden', timeout: TEST_TIMEOUTS.LOADING_SPINNER });
  107 |     } catch  {
> 108 |       throw new Error('El spinner tardó más de lo esperado en desaparecer');
      |             ^ Error: El spinner tardó más de lo esperado en desaparecer
  109 |     }
  110 |   }
  111 | 
  112 |   async dismissDteErrorIfVisible(timeout = 5_000): Promise<void> {
  113 |     try {
  114 |       await this.modaldefaultError.waitFor({ state: 'visible', timeout });
  115 |       await this.modalBtnConfirm.click();
  116 |       // Si aparece de nuevo, cerrar y continuar
  117 |       try {
  118 |         await this.modaldefaultError.waitFor({ state: 'visible', timeout: 3_000 });
  119 |         await this.modalBtnConfirm.click();
  120 |       } catch {
  121 |         // No volvió a aparecer
  122 |       }
  123 |     } catch {
  124 |       // No apareció error DTE
  125 |     }
  126 |   }
  127 | }
```