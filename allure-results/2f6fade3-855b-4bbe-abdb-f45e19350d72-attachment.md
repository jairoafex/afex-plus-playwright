# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/specs/terrapay-europe.spec.ts >> Europa — Terrapay Depósito >> Alemania — Persona >> Crear giro Terrapay cotizando monto a enviar en USD con nuevo beneficiario
- Location: tests/ui/specs/terrapay-europe.spec.ts:38:11

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'Cotizar un envío' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: 'Cotizar un envío' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - button "" [ref=e7] [cursor=pointer]:
        - generic [ref=e8]: 
      - figure [ref=e9]
      - generic [ref=e10]: Parque Arauco For Dummies
      - generic [ref=e11]: ¡Hola, Dummy User!
      - figure [ref=e12]:
        - img [ref=e14]
  - generic [ref=e15]:
    - complementary [ref=e16]:
      - generic [ref=e17]:
        - navigation [ref=e18]:
          - list [ref=e19]:
            - listitem [ref=e20]:
              - link "" [ref=e21] [cursor=pointer]:
                - /url: /transfers
                - generic [ref=e22]: 
            - listitem [ref=e23]:
              - link "" [ref=e24] [cursor=pointer]:
                - /url: /compliance
                - generic [ref=e25]: 
            - listitem [ref=e26]:
              - link "" [ref=e27] [cursor=pointer]:
                - /url: /exchange
                - generic [ref=e28]: 
            - listitem [ref=e29]:
              - link "" [ref=e30] [cursor=pointer]:
                - /url: /svt
                - generic [ref=e31]: 
            - listitem [ref=e32]:
              - link "" [ref=e33] [cursor=pointer]:
                - /url: /process-transfers
                - generic [ref=e34]: 
            - listitem [ref=e35]:
              - link "" [ref=e36] [cursor=pointer]:
                - /url: /admin
                - generic [ref=e37]: 
        - navigation [ref=e38]:
          - list [ref=e39]:
            - listitem [ref=e40]:
              - link "" [ref=e41] [cursor=pointer]:
                - /url: https://sites.google.com/afex.cl/tutoriales
                - generic [ref=e42]: 
            - listitem [ref=e43]:
              - link "" [ref=e44] [cursor=pointer]:
                - /url: "#"
                - generic [ref=e45]: 
            - listitem [ref=e46]:
              - generic [ref=e47]: d.
              - generic [ref=e48]: "--"
    - main [ref=e49]:
      - text: 
      - navigation [ref=e51]:
        - list [ref=e52]:
          - listitem [ref=e53]:
            - generic [ref=e54]: Giros
            - text: /
          - listitem [ref=e55]:
            - link "Cotizar un envío" [ref=e57] [cursor=pointer]:
              - /url: "#"
      - generic [ref=e59]:
        - generic [ref=e62]:
          - generic [ref=e63]:
            - generic [ref=e65] [cursor=pointer]:
              - generic [ref=e67]: $
              - generic [ref=e68]: Cotizar
            - generic [ref=e71] [cursor=pointer]:
              - generic [ref=e73]: 
              - generic [ref=e74]: Beneficiario
            - generic [ref=e77] [cursor=pointer]:
              - img [ref=e79]
              - generic [ref=e85]: Resumen
            - generic [ref=e88] [cursor=pointer]:
              - img [ref=e90]
              - generic [ref=e95]: Recaudación
          - generic [ref=e96]:
            - generic [ref=e98]:
              - heading "Cotizador" [level=3] [ref=e99]
              - button "Tabla de paridades" [ref=e100] [cursor=pointer]:
                - generic [ref=e101]: Tabla de paridades
                - img [ref=e102]
            - generic [ref=e104]:
              - generic [ref=e107]:
                - generic [ref=e109]:
                  - text: Destino a enviar
                  - generic [ref=e112]:
                    - generic [ref=e114]:
                      - text: "*"
                      - generic [ref=e115]: País de destino
                    - generic [ref=e119] [cursor=pointer]:
                      - generic [ref=e120]:
                        - combobox "* País de destino" [ref=e122]
                        - generic: Seleccione el país al que enviará dinero
                      - generic:
                        - img:
                          - img
                  - generic [ref=e125]:
                    - generic "Método de entrega para tu destinatario" [ref=e127]: "* Método de entrega para tu destinatario"
                    - generic [ref=e131]:
                      - generic [ref=e132] [cursor=pointer]:
                        - generic [ref=e133]:
                          - radio "Efectivo"
                        - generic [ref=e134]: Efectivo
                      - generic [ref=e135] [cursor=pointer]:
                        - generic [ref=e136]:
                          - radio "Depósito"
                        - generic [ref=e137]: Depósito
                      - generic [ref=e138] [cursor=pointer]:
                        - generic [ref=e139]:
                          - radio "Todos"
                        - generic [ref=e140]: Todos
                - generic [ref=e142]:
                  - text: Seleccionar monto
                  - generic [ref=e150]:
                    - generic [ref=e151] [cursor=pointer]:
                      - generic [ref=e152]:
                        - radio "Monto a enviar" [checked]
                      - generic [ref=e153]: Monto a enviar
                    - generic [ref=e154] [cursor=pointer]:
                      - generic [ref=e155]:
                        - radio "Monto a recibir"
                      - generic [ref=e156]: Monto a recibir
                  - generic [ref=e159]:
                    - generic "Envía" [ref=e161]: "* Envía"
                    - generic [ref=e166]:
                      - spinbutton "* Envía" [ref=e169]
                      - generic [ref=e171] [cursor=pointer]:
                        - generic [ref=e172]:
                          - combobox [ref=e174]
                          - generic [ref=e176]:
                            - img [ref=e177]
                            - generic [ref=e178]: USD
                        - generic:
                          - img:
                            - img
                  - generic [ref=e181]:
                    - text: "Cambio:"
                    - generic [ref=e182]:
                      - text: Sin información
                      - img "exclamation-circle" [ref=e183]:
                        - img [ref=e184]
                  - generic [ref=e188]:
                    - generic [ref=e191]: Promocode
                    - textbox "Promocode" [ref=e195]:
                      - /placeholder: Ingresar la palabra exacta
                  - generic [ref=e203] [cursor=pointer]:
                    - checkbox "Incluir tarifa" [ref=e205]
                    - generic [ref=e207]: Incluir tarifa
              - button " Buscar" [ref=e209] [cursor=pointer]:
                - generic [ref=e210]: 
                - generic [ref=e211]: Buscar
          - generic [ref=e213]:
            - generic: 
        - generic [ref=e215]:
          - heading "Cliente" [level=3] [ref=e217]: Cliente
          - generic [ref=e218]:
            - generic:
              - generic:
                - table [ref=e219]:
                  - rowgroup [ref=e220]:
                    - row "CARTOLA DE CLIENTES" [ref=e221]:
                      - cell [ref=e222]:
                        - img [ref=e223]
                      - cell "CARTOLA DE CLIENTES" [ref=e224]:
                        - list [ref=e225]:
                          - generic [ref=e226]: CARTOLA DE CLIENTES
                - generic:
                  - table [ref=e227]:
                    - row "Nombres Teléfono" [ref=e228]:
                      - cell "Nombres" [ref=e229]
                      - cell [ref=e230]
                      - cell "Teléfono" [ref=e231]
                      - cell [ref=e232]
                    - row "Dirección Ciudad" [ref=e233]:
                      - cell "Dirección" [ref=e234]
                      - cell [ref=e235]
                      - cell "Ciudad" [ref=e236]
                      - cell [ref=e237]
                    - row "Fecha creación Último Movimiento" [ref=e238]:
                      - cell "Fecha creación" [ref=e239]
                      - cell [ref=e240]
                      - cell "Último Movimiento" [ref=e241]
                      - cell [ref=e242]
                  - table [ref=e243]:
                    - rowgroup [ref=e244]:
                      - row "Fecha Tipo Giro Agente Captador Código Captador Agente Pagador Código Pagador Monto" [ref=e245]:
                        - cell "Fecha" [ref=e246]
                        - cell "Tipo Giro" [ref=e247]
                        - cell "Agente Captador" [ref=e248]
                        - cell "Código Captador" [ref=e249]
                        - cell "Agente Pagador" [ref=e250]
                        - cell "Código Pagador" [ref=e251]
                        - cell "Monto" [ref=e252]
                    - rowgroup
            - generic [ref=e255] [cursor=pointer]:
              - text: RUT/ID/Nombre
              - combobox [ref=e258]:
                - generic [ref=e260]:
                  - textbox "Buscar.." [ref=e261]
                  - button "search" [ref=e263]:
                    - img "search" [ref=e264]:
                      - img [ref=e265]
```

# Test source

```ts
  1   | import { expect, Locator, Page } from "@playwright/test";
  2   | import { AntSelectHelpers } from "../../../utils/helpers/antSelect.helper";
  3   | import { AfexModalHelper } from "../../../utils/helpers/afexModal.helper";
  4   | import { TEST_TIMEOUTS } from "../../../utils/constants/timeouts";
  5   | import {
  6   |   AmountType,
  7   |   MethodPayment,
  8   |   Currency,
  9   |   CurrencySelect,
  10  | } from "../../types/feelookup.types";
  11  | 
  12  | export class FeelookupPage {
  13  | 
  14  |   private readonly afexModal: AfexModalHelper;
  15  |   private readonly antSelect: AntSelectHelpers;
  16  |   private readonly page: Page;
  17  |   private readonly feelookupForm: Locator;
  18  |   private readonly countryInput: Locator;
  19  |   private readonly cityInput: Locator;
  20  |   private readonly methoPaymentAll: Locator;
  21  |   private readonly methodPaymentPickup: Locator;
  22  |   private readonly methodPaymentDeposit: Locator;
  23  |   private readonly amountToSend: Locator;
  24  |   private readonly amounttoReceive: Locator;
  25  |   private readonly inputAmountToSend: Locator;
  26  |   private readonly inputAmountToReceive: Locator;
  27  |   private readonly inputPromocode: Locator;
  28  |   private readonly optionCurrencyClp: Locator;
  29  |   private readonly optionCurrencyUsd: Locator;
  30  |   private readonly optionReceiveCurrencyEUR: Locator;
  31  |   private readonly inputSearchClient: Locator;
  32  |   private readonly textClientFound: Locator;
  33  |   private readonly btnClientNotPresent: Locator;
  34  |   private readonly btnClientRefuse: Locator;
  35  |   private readonly btnSearchQuotations: Locator;
  36  |   private readonly tableAgents: Locator;
  37  |   private readonly tableAgentsRows:Locator;
  38  |   private readonly btnNext:Locator;
  39  | 
  40  |   constructor(page: Page) {
  41  |     this.page = page;
  42  |     this.antSelect = new AntSelectHelpers(page);
  43  |     this.afexModal = new AfexModalHelper(page);
  44  |     this.feelookupForm = page.getByRole("link", { name: "Cotizar un envío" });
  45  |     this.countryInput = page.getByRole("combobox", {name: "* País de destino",});
  46  |     this.cityInput = page.getByRole("combobox", { name: "* Ciudad" });
  47  |     this.methoPaymentAll = page.locator("label").filter({ hasText: "Todos" });
  48  |     this.methodPaymentDeposit = page.locator("label").filter({ hasText: "Depósito" });
  49  |     this.methodPaymentPickup = page.locator("label").filter({ hasText: "Efectivo" });
  50  |     this.amountToSend = page.getByText("Monto a enviar");
  51  |     this.amounttoReceive = page.getByText("Monto a recibir");
  52  |     this.inputAmountToSend = page.locator("//input[contains(@id,'form_item_amount')]");
  53  |     this.inputAmountToReceive = page.locator("//input[contains(@id,'form_item_receiveAmount')]");
  54  |     this.inputPromocode = page.getByRole('textbox', { name: 'Promocode' })
  55  |     this.optionCurrencyClp = page.locator("//span[contains(.,'CLP')]");
  56  |     this.optionCurrencyUsd = page.locator("(//span[contains(.,'USD')])[2]");
  57  |     this.optionReceiveCurrencyEUR = page.locator("//input[contains(@id,'form_item_receiveAmount')]/ancestor::div[contains(@class,'ant-form-item')]//div[contains(@class,'ant-select-selector')]");
  58  |     this.inputSearchClient = page.locator("//input[contains(@placeholder,'Buscar..')]");
  59  |     this.textClientFound = page.locator("//span[contains(@class,'client-name')]");
  60  |     this.btnClientNotPresent = page.getByTestId("noPresentialClientButton");
  61  |     this.btnClientRefuse = page.getByTestId("rejectFingerprintClientButton");
  62  |     this.btnSearchQuotations = page.locator("//span[contains(.,'Buscar')]");
  63  |     this.tableAgents = page.locator("div.ant-table-content tbody.ant-table-tbody");
  64  |     this.tableAgentsRows= page.locator("tbody.ant-table-tbody tr")
  65  |     this.btnNext= page.getByTestId('vnavigator-next')
  66  |   }
  67  | 
  68  |   async expectFeelookupFormVisible() {
> 69  |     await expect(this.feelookupForm).toBeVisible();
      |                                      ^ Error: expect(locator).toBeVisible() failed
  70  |   }
  71  | 
  72  |   async typeCountry(country: string) {
  73  |     await this.countryInput.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
  74  |     await this.countryInput.click();
  75  |     await this.countryInput.fill(country);
  76  |     await this.antSelect.selectByText(country);
  77  |   }
  78  | 
  79  |   async typeCity(city: string) {
  80  |     await this.cityInput.fill(city);
  81  |     await this.antSelect.selectByText(city);
  82  |   }
  83  | 
  84  |   async clickOnMethodPickup() {
  85  |     await this.methodPaymentPickup.click();
  86  |   }
  87  |   async clickOnMethodDeposit() {
  88  |     await this.methodPaymentDeposit.click();
  89  |   }
  90  | 
  91  |   async clickOnMethodAll() {
  92  |     await this.methoPaymentAll.click();
  93  |   }
  94  |   async selectMethodPayment(method: MethodPayment) {
  95  |     switch (method) {
  96  |       case "Efectivo":
  97  |         await this.clickOnMethodPickup();
  98  |         return;
  99  |       case "Depósito":
  100 |         await this.clickOnMethodDeposit();
  101 |         return;
  102 |       case "Todos":
  103 |         await this.clickOnMethodAll();
  104 |         return;
  105 |       default:
  106 |         throw new Error(`Method payment invalid: ${method}`);
  107 |     }
  108 |   }
  109 |   async clickOnAmountType(type: AmountType) {
  110 |     switch (type) {
  111 |       case "Enviar":
  112 |         await this.amountToSend.click();
  113 |         break;
  114 | 
  115 |       case "Recibir":
  116 |         await this.amounttoReceive.click();
  117 |         break;
  118 | 
  119 |       default:
  120 |         throw new Error(`Amount type invalid: ${type}`);
  121 |     }
  122 |   }
  123 | 
  124 |   async typeAmountToSend(amount: string) {
  125 |     await this.inputAmountToSend.fill(amount);
  126 |   }
  127 |   async typeAmountToReceive(amount: string) {
  128 |     await this.inputAmountToReceive.fill(amount);
  129 |   }
  130 |   async typePromocode(code: string){
  131 |     await this.inputPromocode.fill(code)
  132 |   }
  133 | 
  134 |   async expectReceiveCurrencyIsEUR(): Promise<void> {
  135 |     await expect(this.optionReceiveCurrencyEUR).toContainText('EUR', { timeout: TEST_TIMEOUTS.NORMAL_OPERATION });
  136 |   }
  137 | 
  138 |   async typeRandomAmount(currency: Currency): Promise<void> {
  139 |     const currencyRanges: Record<Currency, [number, number]> = {
  140 |       USD: [20, 80],
  141 |       COP: [250000, 350000],
  142 |       BOB: [120, 200],
  143 |       HTG: [3000, 4000],
  144 |       ARP: [2600, 4000],
  145 |       PEN: [10, 40],
  146 |       BRL: [600, 900],
  147 |       CAD: [15, 100],
  148 |       EUR: [120, 200],
  149 |       GBP: [250, 400],
  150 |       CLP: [12000, 30000],
  151 |     };
  152 |     const [min, max] = currencyRanges[currency];
  153 |     const amount = String(Math.floor(Math.random() * (max - min + 1)) + min);
  154 |     if (currency === "USD" || currency === "CLP") {
  155 |       await this.typeAmountToSend(amount);
  156 |     } else {
  157 |       await this.typeAmountToReceive(amount);
  158 |     }
  159 |   }
  160 | 
  161 |   async selectCurrency(currency: CurrencySelect): Promise<void> {
  162 |     const actions: Record<CurrencySelect, Locator> = {
  163 |       USD: this.optionCurrencyUsd,
  164 |       CLP: this.optionCurrencyClp,
  165 |     };
  166 | 
  167 |     await actions[currency].fill(currency);
  168 |   }
  169 | 
```